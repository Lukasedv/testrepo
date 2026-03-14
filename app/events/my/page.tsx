"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  Event,
  getAllEvents,
  getStoredRsvps,
  removeRsvp,
  isPastEvent,
} from "../../lib/eventData";
import EventCard from "../../components/events/EventCard";
import { NAV_HEIGHT } from "../../constants";

export default function MyEventsPage() {
  const { t } = useTranslation();
  const [rsvpedEvents, setRsvpedEvents] = useState<Event[]>([]);
  const [rsvpedIds, setRsvpedIds] = useState<string[]>([]);

  const loadData = () => {
    const ids = getStoredRsvps();
    setRsvpedIds(ids);
    const allEvs = getAllEvents().filter(
      (e) => ids.includes(e.id) && e.status === "published"
    );
    setRsvpedEvents(allEvs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelRsvp = (eventId: string) => {
    removeRsvp(eventId);
    loadData();
  };

  const upcoming = rsvpedEvents
    .filter((e) => !isPastEvent(e))
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

  const past = rsvpedEvents
    .filter((e) => isPastEvent(e))
    .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());

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
        {/* Back */}
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

        <h1 style={{ fontSize: "2rem", color: "#2d3748", marginBottom: "0.25rem" }}>
          {t("events.myEvents")}
        </h1>
        <p style={{ color: "#718096", marginBottom: "1.5rem" }}>
          {t("events.myEventsSubtitle")}
        </p>

        {rsvpedEvents.length === 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "3rem",
              textAlign: "center",
              color: "#718096",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              {t("events.noRsvps")}
            </p>
            <Link href="/events" style={{ color: "#3182ce" }}>
              {t("events.browseEvents")}
            </Link>
          </div>
        )}

        {upcoming.length > 0 && (
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.1rem",
                color: "#4a5568",
                margin: "0 0 0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {t("events.upcomingSection")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {upcoming.map((ev) => (
                <div key={ev.id} style={{ position: "relative" }}>
                  <EventCard event={ev} userRsvped={rsvpedIds.includes(ev.id)} />
                  <button
                    onClick={() => handleCancelRsvp(ev.id)}
                    style={{
                      position: "absolute",
                      top: "0.75rem",
                      right: "0.75rem",
                      padding: "3px 10px",
                      fontSize: "0.75rem",
                      background: "#fff5f5",
                      color: "#e53e3e",
                      border: "1px solid #fed7d7",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    {t("events.cancelRsvp")}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: "1.1rem",
                color: "#718096",
                margin: "0 0 0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {t("events.past")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {past.map((ev) => (
                <EventCard key={ev.id} event={ev} userRsvped={rsvpedIds.includes(ev.id)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
