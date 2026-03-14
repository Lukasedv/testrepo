"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  Event,
  EVENT_CATEGORIES,
  getAllEvents,
  getStoredRsvps,
  isPastEvent,
  isAdmin,
  setAdmin,
} from "../lib/eventData";
import EventCalendar from "../components/events/EventCalendar";
import EventCard from "../components/events/EventCard";
import { NAV_HEIGHT } from "../constants";

function EventsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const viewParam = searchParams.get("view") === "list" ? "list" : "calendar";
  const monthParam = searchParams.get("month");
  const categoryParams = searchParams.getAll("category");

  const parseMonthParam = () => {
    if (monthParam) {
      const [y, m] = monthParam.split("-").map(Number);
      if (!isNaN(y) && !isNaN(m) && m >= 1 && m <= 12) {
        return { year: y, month: m - 1 };
      }
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  };

  const { year: initYear, month: initMonth } = parseMonthParam();

  const [view, setView] = useState<"calendar" | "list">(viewParam);
  const [calYear, setCalYear] = useState(initYear);
  const [calMonth, setCalMonth] = useState(initMonth);
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(categoryParams);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [rsvpedIds, setRsvpedIds] = useState<string[]>([]);
  const [adminMode, setAdminMode] = useState(false);
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  useEffect(() => {
    setAllEvents(getAllEvents());
    setRsvpedIds(getStoredRsvps());
    setAdminMode(isAdmin());
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync URL params
  const updateUrl = useCallback(
    (
      newView: string,
      newYear: number,
      newMonth: number,
      newCategories: string[],
      newQ: string
    ) => {
      const params = new URLSearchParams();
      if (newView === "list") params.set("view", "list");
      params.set("month", `${newYear}-${String(newMonth + 1).padStart(2, "0")}`);
      newCategories.forEach((c) => params.append("category", c));
      if (newQ) params.set("q", newQ);
      router.replace(`/events?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    updateUrl(view, calYear, calMonth, selectedCategories, debouncedQuery);
  }, [view, calYear, calMonth, selectedCategories, debouncedQuery, updateUrl]);

  // Filtering
  const filteredEvents = allEvents.filter((ev) => {
    if (!adminMode && ev.status !== "published") return false;
    if (selectedCategories.length > 0 && !selectedCategories.includes(ev.category))
      return false;
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      if (
        !ev.title.toLowerCase().includes(q) &&
        !ev.description.toLowerCase().includes(q) &&
        !ev.location.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  // For calendar: events in current month
  const calendarEvents = filteredEvents.filter((ev) => {
    const d = new Date(ev.startAt);
    return d.getFullYear() === calYear && d.getMonth() === calMonth;
  });

  // For list: sorted chronologically
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  );
  const upcomingEvents = sortedEvents.filter((ev) => !isPastEvent(ev));
  const pastEvents = sortedEvents.filter((ev) => isPastEvent(ev)).reverse();

  const handlePrev = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const handleNext = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCalYear(now.getFullYear());
    setCalMonth(now.getMonth());
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleEventClick = (ev: Event) => {
    router.push(`/events/${ev.id}`);
  };

  const handleAdminToggle = () => {
    const next = !adminMode;
    setAdminMode(next);
    setAdmin(next);
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
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Page header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "2rem", color: "#2d3748" }}>
              {t("events.title")}
            </h1>
            <p style={{ margin: "0.25rem 0 0", color: "#718096" }}>
              {t("events.subtitle")}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {/* My Events link */}
            <Link href="/events/my" style={linkBtnStyle}>
              {t("events.myEvents")}
            </Link>
            {/* Admin: Create Event */}
            {adminMode && (
              <Link href="/events/new" style={primaryLinkBtnStyle}>
                {t("events.createEvent")}
              </Link>
            )}
            {/* Admin toggle (demo) */}
            <button
              onClick={handleAdminToggle}
              style={{
                ...linkBtnStyle,
                background: adminMode ? "#fef3c7" : "#edf2f7",
                border: `1px solid ${adminMode ? "#f6e05e" : "#cbd5e0"}`,
                color: adminMode ? "#92400e" : "#4a5568",
                cursor: "pointer",
                fontSize: "0.78rem",
              }}
              title="Toggle admin mode (demo)"
            >
              {adminMode ? t("events.adminOn") : t("events.adminOff")}
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "1rem 1.25rem",
            marginBottom: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          {/* Search */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <label htmlFor="event-search" style={{ color: "#4a5568", fontSize: "0.9rem", whiteSpace: "nowrap" }}>
              🔍 {t("events.search")}:
            </label>
            <input
              id="event-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("events.searchPlaceholder")}
              style={inputStyle}
            />
          </div>

          {/* Category filter */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ color: "#4a5568", fontSize: "0.9rem" }}>🏷 {t("events.category")}:</span>
            {EVENT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                style={{
                  padding: "3px 10px",
                  borderRadius: "12px",
                  border: selectedCategories.includes(cat)
                    ? "2px solid #3182ce"
                    : "1px solid #cbd5e0",
                  background: selectedCategories.includes(cat) ? "#ebf8ff" : "#f7fafc",
                  color: selectedCategories.includes(cat) ? "#2b6cb0" : "#4a5568",
                  fontWeight: selectedCategories.includes(cat) ? 700 : 400,
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {cat}
              </button>
            ))}
            {selectedCategories.length > 0 && (
              <button
                onClick={() => setSelectedCategories([])}
                style={{
                  ...linkBtnStyle,
                  fontSize: "0.78rem",
                  padding: "2px 8px",
                  color: "#e53e3e",
                  border: "1px solid #fed7d7",
                  background: "#fff5f5",
                  cursor: "pointer",
                }}
              >
                {t("events.clearFilters")}
              </button>
            )}
          </div>
        </div>

        {/* View toggle */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1.25rem",
          }}
        >
          {(["calendar", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-pressed={view === v}
              style={{
                padding: "0.4rem 1.2rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e0",
                background: view === v ? "#2d3748" : "#fff",
                color: view === v ? "#fff" : "#4a5568",
                fontWeight: view === v ? 700 : 400,
                cursor: "pointer",
                fontSize: "0.9rem",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {v === "calendar" ? t("events.calendarView") : t("events.listView")}
            </button>
          ))}
        </div>

        {/* Calendar View */}
        {view === "calendar" && (
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "1.5rem",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <EventCalendar
              year={calYear}
              month={calMonth}
              events={calendarEvents}
              onEventClick={handleEventClick}
              onPrev={handlePrev}
              onNext={handleNext}
              onToday={handleToday}
            />
          </div>
        )}

        {/* List View */}
        {view === "list" && (
          <div>
            {filteredEvents.length === 0 && (
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
                  {t("events.noEvents")}
                </p>
                <p style={{ fontSize: "0.9rem" }}>
                  {t("events.noEventsSuggestion")}
                </p>
              </div>
            )}

            {upcomingEvents.length > 0 && (
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
                  {t("events.upcoming")}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {upcomingEvents.map((ev) => (
                    <EventCard
                      key={ev.id}
                      event={ev}
                      userRsvped={rsvpedIds.includes(ev.id)}
                      showAdminBadge={adminMode}
                    />
                  ))}
                </div>
              </section>
            )}

            {pastEvents.length > 0 && (
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
                  {pastEvents.map((ev) => (
                    <EventCard
                      key={ev.id}
                      event={ev}
                      userRsvped={rsvpedIds.includes(ev.id)}
                      showAdminBadge={adminMode}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function EventsPage() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={
      <main style={{ minHeight: `calc(100vh - ${NAV_HEIGHT})`, display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "Arial, sans-serif" }}>
        <p style={{ color: "#718096" }}>{t("events.title")}…</p>
      </main>
    }>
      <EventsContent />
    </Suspense>
  );
}

const linkBtnStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "0.4rem 1rem",
  borderRadius: "6px",
  border: "1px solid #cbd5e0",
  background: "#fff",
  color: "#4a5568",
  fontSize: "0.9rem",
  fontFamily: "Arial, sans-serif",
  textDecoration: "none",
  cursor: "pointer",
};

const primaryLinkBtnStyle: React.CSSProperties = {
  ...linkBtnStyle,
  background: "#3182ce",
  color: "#fff",
  border: "none",
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "0.4rem 0.75rem",
  borderRadius: "6px",
  border: "1px solid #cbd5e0",
  fontSize: "0.9rem",
  fontFamily: "Arial, sans-serif",
  outline: "none",
  color: "#2d3748",
  background: "#f7fafc",
};

