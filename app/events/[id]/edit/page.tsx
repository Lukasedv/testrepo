"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Event,
  getAllEvents,
  getCustomEvents,
  saveCustomEvents,
  MOCK_EVENTS,
} from "../../../lib/eventData";
import { EventForm } from "../../new/page";
import { NAV_HEIGHT } from "../../../constants";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditEventPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
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
          <p style={{ color: "#718096" }}>Event not found.</p>
          <Link href="/events" style={{ color: "#3182ce" }}>← Back to Events</Link>
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
          ← Back to Event
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
            title={`Edit: ${event.title}`}
            submitLabel="Save Changes"
            initialData={event}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </main>
  );
}
