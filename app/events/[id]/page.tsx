"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  Event,
  getAllEvents,
  getStoredRsvps,
  addRsvp,
  removeRsvp,
  isAdmin,
  isPastEvent,
  formatEventDate,
  formatEventTime,
  generateIcsContent,
  buildGoogleCalendarUrl,
  getCustomEvents,
  saveCustomEvents,
  MOCK_EVENTS,
} from "../../lib/eventData";
import { getCategoryColor } from "../../components/events/EventCalendar";
import { NAV_HEIGHT } from "../../constants";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();

  const [event, setEvent] = useState<Event | null>(null);
  const [rsvped, setRsvped] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(0);
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRsvpCancel, setShowRsvpCancel] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  useEffect(() => {
    const ev = getAllEvents().find((e) => e.id === id);
    if (ev) {
      setEvent(ev);
      setRsvpCount(ev.rsvpCount);
    }
    setRsvped(getStoredRsvps().includes(id));
    setAdminMode(isAdmin());
  }, [id]);

  if (!event) {
    return (
      <main
        style={{
          minHeight: `calc(100vh - ${NAV_HEIGHT})`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#718096", fontSize: "1.1rem" }}>{t("events.notFound")}</p>
          <Link href="/events" style={{ color: "#3182ce" }}>{t("events.backToEvents")}</Link>
        </div>
      </main>
    );
  }

  const past = isPastEvent(event);
  const spotsLeft = event.capacity !== null ? event.capacity - rsvpCount : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  const handleRsvp = () => {
    if (isFull && !rsvped) return;
    if (rsvped) {
      setShowRsvpCancel(true);
    } else {
      addRsvp(event.id);
      setRsvped(true);
      setRsvpCount((c) => c + 1);
    }
  };

  const confirmCancelRsvp = () => {
    removeRsvp(event.id);
    setRsvped(false);
    setRsvpCount((c) => Math.max(0, c - 1));
    setShowRsvpCancel(false);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      });
    }
  };

  const handleDownloadIcs = () => {
    const ics = generateIcsContent(event);
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, "_")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = () => {
    const custom = getCustomEvents();
    const isMock = MOCK_EVENTS.find((e) => e.id === event.id);
    if (isMock) {
      saveCustomEvents([
        ...custom.filter((e) => e.id !== event.id),
        { ...event, status: "deleted" },
      ]);
    } else {
      saveCustomEvents(
        custom.map((e) => (e.id === event.id ? { ...e, status: "deleted" } : e))
      );
    }
    router.push("/events");
  };

  const handleTogglePublish = () => {
    setPublishLoading(true);
    const newStatus = event.status === "published" ? "draft" : "published";
    const custom = getCustomEvents();
    const isMock = MOCK_EVENTS.find((e) => e.id === event.id);
    if (isMock) {
      saveCustomEvents([
        ...custom.filter((e) => e.id !== event.id),
        { ...event, status: newStatus },
      ]);
    } else {
      saveCustomEvents(
        custom.map((e) => (e.id === event.id ? { ...e, status: newStatus } : e))
      );
    }
    setEvent({ ...event, status: newStatus });
    setPublishLoading(false);
  };

  return (
    <main
      style={{
        minHeight: `calc(100vh - ${NAV_HEIGHT})`,
        backgroundColor: "#f0f4f8",
        fontFamily: "Arial, sans-serif",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        {/* Back link */}
        <Link
          href="/events"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            color: "#3182ce",
            textDecoration: "none",
            fontSize: "0.9rem",
            marginBottom: "1.25rem",
          }}
        >
          {t("events.backToEvents")}
        </Link>

        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          {/* Cover image placeholder */}
          {event.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.coverImage}
              alt={event.title}
              style={{ width: "100%", height: "220px", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "140px",
                background: `linear-gradient(135deg, ${getCategoryColor(event.category)}, #2d3748)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "3rem" }}>📅</span>
            </div>
          )}

          <div style={{ padding: "1.75rem 2rem" }}>
            {/* Category + status badges */}
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
              <span
                style={{
                  background: getCategoryColor(event.category),
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "10px",
                  textTransform: "uppercase",
                }}
              >
                {event.category}
              </span>
              {past && (
                <span style={{ background: "#e2e8f0", color: "#718096", fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: "10px", textTransform: "uppercase" }}>
                  {t("events.pastEvent")}
                </span>
              )}
              {adminMode && event.status === "draft" && (
                <span style={{ background: "#fef3c7", color: "#92400e", fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: "10px", border: "1px solid #f6e05e" }}>
                  {t("events.draftBadge")}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 style={{ fontSize: "1.9rem", color: "#2d3748", margin: "0 0 1rem" }}>
              {event.title}
            </h1>

            {/* Event meta */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", color: "#4a5568", fontSize: "0.95rem" }}>
                <span>📅</span>
                <span>
                  {formatEventDate(event.startAt, event.timezone)}
                  {event.startAt.slice(0, 10) !== event.endAt.slice(0, 10) &&
                    ` — ${formatEventDate(event.endAt, event.timezone)}`}
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color: "#4a5568", fontSize: "0.95rem" }}>
                <span>🕐</span>
                <span>
                  {formatEventTime(event.startAt, event.timezone)} – {formatEventTime(event.endAt, event.timezone)} ({event.timezone})
                </span>
              </div>
              {event.location && (
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", color: "#4a5568", fontSize: "0.95rem" }}>
                  <span>📍</span>
                  <span>
                    {event.location}{" "}
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#3182ce", fontSize: "0.85rem" }}
                    >
                      {t("events.mapLink")}
                    </a>
                  </span>
                </div>
              )}
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color: "#4a5568", fontSize: "0.95rem" }}>
                <span>👥</span>
                <span>
                  {rsvpCount} {t("events.rsvps")}
                  {event.capacity !== null && (
                    <>
                      {" "}/{" "}{event.capacity} {t("events.capacity")}
                      {spotsLeft !== null && spotsLeft > 0 && ` (${spotsLeft} ${t("events.spotsLeft")})`}
                      {isFull && <strong style={{ color: "#e53e3e" }}> · {t("events.eventFull")}</strong>}
                    </>
                  )}
                  {event.capacity === null && ` (${t("events.unlimited")})`}
                </span>
              </div>
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: "0.97rem",
                color: "#4a5568",
                lineHeight: 1.7,
                marginBottom: "1.5rem",
                whiteSpace: "pre-line",
              }}
            >
              {event.description}
            </div>

            {/* Action buttons */}
            {!past && (
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                {/* RSVP button */}
                <button
                  onClick={handleRsvp}
                  disabled={isFull && !rsvped}
                  style={{
                    padding: "0.6rem 1.5rem",
                    borderRadius: "8px",
                    border: "none",
                    background: rsvped ? "#c6f6d5" : isFull ? "#e2e8f0" : "#3182ce",
                    color: rsvped ? "#276749" : isFull ? "#718096" : "#fff",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    fontFamily: "Arial, sans-serif",
                    cursor: isFull && !rsvped ? "not-allowed" : "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  {rsvped ? t("events.going") : isFull ? t("events.eventFull") : t("events.rsvp")}
                </button>

                {/* Add to Calendar */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setShowCalendarMenu((v) => !v)}
                    style={secondaryBtnStyle}
                  >
                    {t("events.addToCalendar")}
                  </button>
                  {showCalendarMenu && (
                    <div
                      style={{
                        position: "absolute",
                        top: "110%",
                        left: 0,
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                        zIndex: 50,
                        minWidth: "200px",
                        overflow: "hidden",
                      }}
                    >
                      <a
                        href={buildGoogleCalendarUrl(event)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={calMenuItemStyle}
                      >
                        {t("events.googleCalendar")}
                      </a>
                      {([t("events.appleCalendar"), t("events.outlookCalendar")] as const).map((label) => (
                        <button
                          key={label}
                          onClick={() => { handleDownloadIcs(); setShowCalendarMenu(false); }}
                          style={{ ...calMenuItemStyle, border: "none", textAlign: "left", width: "100%", cursor: "pointer" }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Share */}
                <button onClick={handleShare} style={secondaryBtnStyle}>
                  {shareCopied ? t("events.linkCopied") : t("events.share")}
                </button>
              </div>
            )}

            {/* Cancel RSVP confirm dialog */}
            {showRsvpCancel && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label={t("events.cancelRsvpTitle")}
                style={dialogOverlayStyle}
              >
                <div style={dialogBoxStyle}>
                  <h3 style={{ margin: "0 0 0.75rem", color: "#2d3748" }}>{t("events.cancelRsvpTitle")}</h3>
                  <p style={{ color: "#4a5568", marginBottom: "1rem" }}>
                    {t("events.cancelRsvpConfirm", { title: event.title })}
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button
                      onClick={confirmCancelRsvp}
                      style={{ padding: "0.5rem 1.2rem", background: "#e53e3e", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "Arial, sans-serif" }}
                    >
                      {t("events.cancelRsvpConfirmBtn")}
                    </button>
                    <button
                      onClick={() => setShowRsvpCancel(false)}
                      style={{ padding: "0.5rem 1.2rem", background: "#edf2f7", color: "#4a5568", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "Arial, sans-serif" }}
                    >
                      {t("events.keepRsvpBtn")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Admin controls */}
            {adminMode && (
              <div
                style={{
                  borderTop: "1px solid #e2e8f0",
                  paddingTop: "1rem",
                  marginTop: "1rem",
                  display: "flex",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "0.82rem", color: "#718096", fontWeight: 600 }}>
                  {t("events.adminLabel")}:
                </span>
                <Link
                  href={`/events/${event.id}/edit`}
                  style={{
                    ...secondaryBtnStyle,
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  {t("events.editEvent")}
                </Link>
                <button
                  onClick={handleTogglePublish}
                  disabled={publishLoading}
                  style={{
                    ...secondaryBtnStyle,
                    background: event.status === "published" ? "#fef3c7" : "#c6f6d5",
                    color: event.status === "published" ? "#92400e" : "#276749",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {event.status === "published" ? t("events.unpublish") : t("events.publish")}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    ...secondaryBtnStyle,
                    background: "#fff5f5",
                    color: "#e53e3e",
                    border: "1px solid #fed7d7",
                    cursor: "pointer",
                  }}
                >
                  {t("events.deleteEvent")}
                </button>
              </div>
            )}

            {/* Delete confirm dialog */}
            {showDeleteConfirm && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label={t("events.deleteEventTitle")}
                style={dialogOverlayStyle}
              >
                <div style={dialogBoxStyle}>
                  <h3 style={{ margin: "0 0 0.75rem", color: "#2d3748" }}>{t("events.deleteEventTitle")}</h3>
                  <p style={{ color: "#4a5568", marginBottom: "0.5rem" }}>
                    {t("events.deleteConfirm", { title: event.title })}
                  </p>
                  {rsvpCount > 0 && (
                    <p style={{ color: "#e53e3e", fontSize: "0.9rem", marginBottom: "1rem" }}>
                      {t("events.deleteRsvpWarning", { count: rsvpCount })}
                    </p>
                  )}
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button
                      onClick={handleDelete}
                      style={{ padding: "0.5rem 1.2rem", background: "#e53e3e", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "Arial, sans-serif" }}
                    >
                      {t("events.deleteEventBtn")}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      style={{ padding: "0.5rem 1.2rem", background: "#edf2f7", color: "#4a5568", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "Arial, sans-serif" }}
                    >
                      {t("events.cancel")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

const secondaryBtnStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  border: "1px solid #cbd5e0",
  background: "#f7fafc",
  color: "#4a5568",
  fontSize: "0.88rem",
  fontFamily: "Arial, sans-serif",
  whiteSpace: "nowrap",
};

const calMenuItemStyle: React.CSSProperties = {
  display: "block",
  padding: "0.65rem 1rem",
  color: "#4a5568",
  textDecoration: "none",
  fontSize: "0.9rem",
  fontFamily: "Arial, sans-serif",
  background: "#fff",
  borderBottom: "1px solid #f0f0f0",
};

const dialogOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 200,
};

const dialogBoxStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "12px",
  padding: "2rem",
  maxWidth: "420px",
  width: "90%",
  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
};
