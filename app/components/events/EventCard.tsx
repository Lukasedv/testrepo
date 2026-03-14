"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Event, isPastEvent } from "../../lib/eventData";
import { getCategoryColor } from "./EventCalendar";

interface Props {
  event: Event;
  userRsvped?: boolean;
  showAdminBadge?: boolean;
}

export default function EventCard({ event, userRsvped, showAdminBadge }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en";
  const past = isPastEvent(event);
  const startDate = new Date(event.startAt);
  const endDate = new Date(event.endAt);

  const dateLabel = startDate.toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: event.timezone,
  });
  const timeLabel = `${startDate.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", timeZone: event.timezone })} – ${endDate.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", timeZone: event.timezone })}`;

  const spotsLeft =
    event.capacity !== null ? event.capacity - event.rsvpCount : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  return (
    <Link
      href={`/events/${event.id}`}
      style={{ textDecoration: "none" }}
    >
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          padding: "1.25rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          opacity: past ? 0.7 : 1,
          cursor: "pointer",
          transition: "box-shadow 0.15s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 4px 12px rgba(0,0,0,0.12)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 1px 4px rgba(0,0,0,0.06)")
        }
      >
        {/* Category + status badges */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          <span
            style={{
              background: getCategoryColor(event.category),
              color: "#fff",
              fontSize: "0.72rem",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {event.category}
          </span>
          {past && (
            <span
              style={{
                background: "#e2e8f0",
                color: "#718096",
                fontSize: "0.72rem",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "10px",
                textTransform: "uppercase",
              }}
            >
              {t("events.pastBadge")}
            </span>
          )}
          {showAdminBadge && event.status === "draft" && (
            <span
              style={{
                background: "#fef3c7",
                color: "#92400e",
                fontSize: "0.72rem",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "10px",
                border: "1px solid #f6e05e",
              }}
            >
              {t("events.draftBadge")}
            </span>
          )}
          {userRsvped && (
            <span
              style={{
                background: "#c6f6d5",
                color: "#276749",
                fontSize: "0.72rem",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "10px",
              }}
            >
              {t("events.going")}
            </span>
          )}
          {isFull && (
            <span
              style={{
                background: "#fed7d7",
                color: "#9b2335",
                fontSize: "0.72rem",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "10px",
              }}
            >
              {t("events.fullBadge")}
            </span>
          )}
        </div>

        <h3
          style={{
            margin: 0,
            fontSize: "1.1rem",
            color: "#2d3748",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {event.title}
        </h3>

        <div style={{ fontSize: "0.88rem", color: "#4a5568" }}>
          📅 {dateLabel} &nbsp;·&nbsp; 🕐 {timeLabel}
        </div>

        {event.location && (
          <div style={{ fontSize: "0.88rem", color: "#4a5568" }}>
            📍 {event.location}
          </div>
        )}

        <div
          style={{
            fontSize: "0.85rem",
            color: "#718096",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
          }}
        >
          {event.description}
        </div>

        <div
          style={{
            fontSize: "0.8rem",
            color: "#718096",
            marginTop: "0.25rem",
          }}
        >
          👥 {event.rsvpCount} {t("events.rsvps")}
          {spotsLeft !== null && !isFull && ` · ${spotsLeft} ${t("events.spotsLeft")}`}
          {isFull && ` · ${t("events.eventFull")}`}
        </div>
      </div>
    </Link>
  );
}

