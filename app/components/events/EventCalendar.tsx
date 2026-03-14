"use client";

import { useTranslation } from "react-i18next";
import { Event, isPastEvent } from "../../lib/eventData";

interface Props {
  year: number;
  month: number; // 0-indexed
  events: Event[];
  onEventClick: (event: Event) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstWeekdayOfMonth(year: number, month: number): number {
  // 0=Sun ... 6=Sat; convert to Mon-based: Mon=0 ... Sun=6
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

export default function EventCalendar({
  year,
  month,
  events,
  onEventClick,
  onPrev,
  onNext,
  onToday,
}: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en";

  // Locale-aware month/year label
  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));

  // Locale-aware weekday headers (Mon-based: Mon=0...Sun=6)
  // 2024-01-01 is a Monday — use it as anchor
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" })
      .format(new Date(2024, 0, 1 + i))
      .toUpperCase()
  );

  const daysInMonth = getDaysInMonth(year, month);
  const firstWeekday = getFirstWeekdayOfMonth(year, month);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Build a map: day -> events
  const eventsByDay: Record<number, Event[]> = {};
  events.forEach((ev) => {
    const d = new Date(ev.startAt);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(ev);
    }
  });

  // Build grid cells
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#2d3748", textTransform: "capitalize" }}>
          {monthLabel}
        </h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={onPrev}
            aria-label={t("events.prevMonth")}
            style={navBtnStyle}
          >
            ‹
          </button>
          <button
            onClick={onToday}
            style={{
              ...navBtnStyle,
              padding: "0.3rem 0.8rem",
              fontSize: "0.85rem",
            }}
          >
            {t("events.today")}
          </button>
          <button
            onClick={onNext}
            aria-label={t("events.nextMonth")}
            style={navBtnStyle}
          >
            ›
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div
        role="grid"
        aria-label={monthLabel}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "2px",
        }}
      >
        {weekdays.map((wd) => (
          <div
            key={wd}
            role="columnheader"
            style={{
              textAlign: "center",
              padding: "0.4rem 0",
              fontWeight: 700,
              fontSize: "0.78rem",
              color: "#718096",
              textTransform: "uppercase",
            }}
          >
            {wd}
          </div>
        ))}

        {/* Day cells */}
        {cells.map((day, idx) => {
          if (day === null) {
            return (
              <div
                key={`empty-${idx}`}
                role="gridcell"
                aria-hidden="true"
                style={{ minHeight: "80px", background: "#f7fafc", borderRadius: "6px" }}
              />
            );
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday = dateStr === todayStr;
          const dayEvents = eventsByDay[day] ?? [];

          return (
            <div
              key={day}
              role="gridcell"
              aria-label={new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(new Date(year, month, day))}
              style={{
                minHeight: "80px",
                padding: "0.4rem",
                background: isToday ? "#ebf8ff" : "#ffffff",
                border: isToday ? "2px solid #3182ce" : "1px solid #e2e8f0",
                borderRadius: "6px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <span
                style={{
                  fontSize: "0.82rem",
                  fontWeight: isToday ? 700 : 400,
                  color: isToday ? "#2b6cb0" : "#4a5568",
                  marginBottom: "2px",
                }}
              >
                {day}
              </span>
              {dayEvents.slice(0, 3).map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => onEventClick(ev)}
                  title={ev.title}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "1px 4px",
                    fontSize: "0.7rem",
                    fontFamily: "Arial, sans-serif",
                    background: getCategoryColor(ev.category),
                    color: "#fff",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    opacity: isPastEvent(ev) ? 0.6 : 1,
                  }}
                >
                  {ev.title}
                </button>
              ))}
              {dayEvents.length > 3 && (
                <span style={{ fontSize: "0.65rem", color: "#718096" }}>
                  +{dayEvents.length - 3} more
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {events.length === 0 && (
        <p
          style={{
            textAlign: "center",
            color: "#718096",
            marginTop: "2rem",
            fontStyle: "italic",
          }}
        >
          {t("events.noEventsThisMonth")}
        </p>
      )}
    </div>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Workshop: "#6b46c1",
    Webinar: "#2b6cb0",
    Social: "#2f855a",
    Conference: "#c05621",
    Meetup: "#b7791f",
    Other: "#718096",
  };
  return colors[category] ?? "#718096";
}

export { getCategoryColor };

const navBtnStyle: React.CSSProperties = {
  padding: "0.3rem 0.6rem",
  fontSize: "1.2rem",
  background: "#edf2f7",
  border: "1px solid #cbd5e0",
  borderRadius: "6px",
  cursor: "pointer",
  color: "#2d3748",
  fontFamily: "Arial, sans-serif",
};

