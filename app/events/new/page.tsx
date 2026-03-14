"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  Event,
  getCustomEvents,
  saveCustomEvents,
  isAdmin,
} from "../../lib/eventData";
import { EventForm } from "../../components/events/EventForm";
import { NAV_HEIGHT } from "../../constants";

export default function CreateEventPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      setUnauthorized(true);
    }
  }, []);

  const handleSubmit = (
    data: Omit<Event, "id" | "rsvpCount" | "createdBy">
  ) => {
    const newEvent: Event = {
      ...data,
      id: crypto.randomUUID(),
      rsvpCount: 0,
      createdBy: "admin",
    };
    const current = getCustomEvents();
    saveCustomEvents([...current, newEvent]);
    router.push(`/events/${newEvent.id}`);
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
            padding: "2rem",
          }}
        >
          <EventForm
            title={t("events.createNewEvent")}
            submitLabel={t("events.createEvent")}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </main>
  );
}
