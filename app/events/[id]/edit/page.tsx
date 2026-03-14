"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  Event,
  getAllEvents,
  getCustomEvents,
  saveCustomEvents,
  MOCK_EVENTS,
  isAdmin,
} from "../../../lib/eventData";
import { EventForm } from "../../../components/events/EventForm";
import { NAV_HEIGHT } from "../../../constants";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const [event, setEvent] = useState<Event | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      setUnauthorized(true);
      return;
    }
    const ev = getAllEvents().find((e) => e.id === id);
    setEvent(ev ?? null);
  }, [id]);

  const handleSubmit = (data: Omit<Event, "id" | "rsvpCount" | "createdBy">) => {
    if (!event) return;
    const updated: Event = { ...event, ...data };
    const custom = getCustomEvents();
    const isMock = MOCK_EVENTS.find((e) => e.id === event.id);
    if (isMock) {
      saveCustomEvents([
        ...custom.filter((e) => e.id !== event.id),
        updated,
      ]);
    } else {
      saveCustomEvents(
        custom.map((e) => (e.id === event.id ? updated : e))
      );
    }
    router.push(`/events/${event.id}`);
  };

  if (unauthorized) {
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
          <p style={{ color: "#e53e3e", fontSize: "1.1rem", marginBottom: "0.75rem" }}>
            Unauthorized
          </p>
          <Link href="/events" style={{ color: "#3182ce" }}>
            {t("events.backToEvents")}
          </Link>
        </div>
      </main>
    );
  }

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
          <p style={{ color: "#718096" }}>{t("events.notFound")}</p>
          <Link href="/events" style={{ color: "#3182ce" }}>{t("events.backToEvents")}</Link>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: `calc(100vh - ${NAV_HEIGHT})`,
        backgroundColor: "#f0f4f8",
        fontFamily: "Arial, sans-serif",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <Link
          href={`/events/${id}`}
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
          {t("events.backToEvent")}
        </Link>
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            padding: "2rem",
          }}
        >
          <EventForm
            title={`${t("events.editEvent").replace("✏️ ", "")} ${event.title}`}
            submitLabel={t("events.saveChanges")}
            initialData={event}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </main>
  );
}
