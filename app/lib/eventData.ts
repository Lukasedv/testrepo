export type EventStatus = "draft" | "published" | "deleted";

export interface Event {
  id: string;
  title: string;
  description: string;
  startAt: string; // ISO 8601
  endAt: string;   // ISO 8601
  timezone: string;
  location: string;
  category: string;
  coverImage: string;
  capacity: number | null;
  status: EventStatus;
  createdBy: string;
  rsvpCount: number;
}

export interface EventRsvp {
  eventId: string;
  userId: string;
  createdAt: string;
}

export const EVENT_CATEGORIES = [
  "Workshop",
  "Webinar",
  "Social",
  "Conference",
  "Meetup",
  "Other",
];

export const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Spring Kickoff Meetup",
    description:
      "Join us for our annual spring meetup! We'll have talks, networking, and great food. Come connect with fellow community members and learn about what's coming this year.",
    startAt: "2026-03-20T17:00:00.000Z",
    endAt: "2026-03-20T20:00:00.000Z",
    timezone: "Europe/Stockholm",
    location: "Stockholm City Hub, Drottninggatan 5, Stockholm",
    category: "Meetup",
    coverImage: "",
    capacity: 80,
    status: "published",
    createdBy: "admin",
    rsvpCount: 42,
  },
  {
    id: "2",
    title: "React Advanced Workshop",
    description:
      "A hands-on workshop diving deep into advanced React patterns, hooks, and performance optimizations. Bring your laptop — we'll be coding together throughout the session.",
    startAt: "2026-03-25T09:00:00.000Z",
    endAt: "2026-03-25T16:00:00.000Z",
    timezone: "Europe/Stockholm",
    location: "Online (Zoom link sent upon RSVP)",
    category: "Workshop",
    coverImage: "",
    capacity: 30,
    status: "published",
    createdBy: "admin",
    rsvpCount: 28,
  },
  {
    id: "3",
    title: "Product Strategy Webinar",
    description:
      "Learn how to craft a winning product strategy from industry veterans. This 90-minute session covers frameworks, real-world case studies, and a live Q&A.",
    startAt: "2026-04-02T13:00:00.000Z",
    endAt: "2026-04-02T14:30:00.000Z",
    timezone: "Europe/Stockholm",
    location: "Online (Webinar)",
    category: "Webinar",
    coverImage: "",
    capacity: null,
    status: "published",
    createdBy: "admin",
    rsvpCount: 115,
  },
  {
    id: "4",
    title: "Developer Conference 2026",
    description:
      "The biggest developer conference of the year! Two days of keynotes, breakout sessions, and workshops covering AI, cloud, and modern web development.",
    startAt: "2026-04-15T08:00:00.000Z",
    endAt: "2026-04-16T18:00:00.000Z",
    timezone: "Europe/Stockholm",
    location: "Stockholm Convention Center, Älvsjö",
    category: "Conference",
    coverImage: "",
    capacity: 500,
    status: "published",
    createdBy: "admin",
    rsvpCount: 312,
  },
  {
    id: "5",
    title: "Community Social Evening",
    description:
      "An informal get-together for the community. No agenda, just good conversations, drinks, and snacks. Everyone is welcome!",
    startAt: "2026-04-22T18:30:00.000Z",
    endAt: "2026-04-22T21:30:00.000Z",
    timezone: "Europe/Stockholm",
    location: "The Brewhouse, Götgatan 12, Stockholm",
    category: "Social",
    coverImage: "",
    capacity: 50,
    status: "published",
    createdBy: "admin",
    rsvpCount: 18,
  },
  {
    id: "6",
    title: "AI & Future of Work Webinar",
    description:
      "Explore how artificial intelligence is reshaping the workplace. Discuss automation, augmentation, and how teams can adapt to thrive in the AI era.",
    startAt: "2026-05-07T14:00:00.000Z",
    endAt: "2026-05-07T15:30:00.000Z",
    timezone: "Europe/Stockholm",
    location: "Online (Webinar)",
    category: "Webinar",
    coverImage: "",
    capacity: null,
    status: "published",
    createdBy: "admin",
    rsvpCount: 67,
  },
  {
    id: "7",
    title: "Design Systems Workshop",
    description:
      "Build and maintain scalable design systems. This workshop covers component libraries, tokens, documentation, and cross-team collaboration.",
    startAt: "2026-05-14T10:00:00.000Z",
    endAt: "2026-05-14T17:00:00.000Z",
    timezone: "Europe/Stockholm",
    location: "Design Studio, Sveavägen 44, Stockholm",
    category: "Workshop",
    coverImage: "",
    capacity: 20,
    status: "draft",
    createdBy: "admin",
    rsvpCount: 0,
  },
  {
    id: "8",
    title: "February Tech Meetup (Past)",
    description:
      "Our February monthly meetup — look back at highlights from this exciting session on TypeScript and tooling.",
    startAt: "2026-02-18T17:00:00.000Z",
    endAt: "2026-02-18T20:00:00.000Z",
    timezone: "Europe/Stockholm",
    location: "Stockholm City Hub, Drottninggatan 5, Stockholm",
    category: "Meetup",
    coverImage: "",
    capacity: 60,
    status: "published",
    createdBy: "admin",
    rsvpCount: 55,
  },
];

// localStorage helpers

const RSVP_KEY = "events_rsvps";
const ADMIN_KEY = "events_admin";

export function getStoredRsvps(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RSVP_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRsvp(eventId: string): void {
  const current = getStoredRsvps();
  if (!current.includes(eventId)) {
    localStorage.setItem(RSVP_KEY, JSON.stringify([...current, eventId]));
  }
}

export function removeRsvp(eventId: string): void {
  const current = getStoredRsvps();
  localStorage.setItem(
    RSVP_KEY,
    JSON.stringify(current.filter((id) => id !== eventId))
  );
}

export function isAdmin(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(ADMIN_KEY) === "true";
  } catch {
    return false;
  }
}

export function setAdmin(value: boolean): void {
  localStorage.setItem(ADMIN_KEY, value ? "true" : "false");
}

// Custom events stored in localStorage

const CUSTOM_EVENTS_KEY = "events_custom";

export function getCustomEvents(): Event[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomEvents(events: Event[]): void {
  localStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(events));
}

export function getAllEvents(): Event[] {
  return [...MOCK_EVENTS, ...getCustomEvents()];
}

export function getEventById(id: string): Event | undefined {
  return getAllEvents().find((e) => e.id === id);
}

export function formatEventDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatEventTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isPastEvent(event: Event): boolean {
  return new Date(event.endAt) < new Date();
}

export function generateIcsContent(event: Event): string {
  const formatIcsDate = (iso: string) =>
    iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const escape = (s: string) => s.replace(/,/g, "\\,").replace(/\n/g, "\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Events App//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@events-app`,
    `DTSTART:${formatIcsDate(event.startAt)}`,
    `DTEND:${formatIcsDate(event.endAt)}`,
    `SUMMARY:${escape(event.title)}`,
    `DESCRIPTION:${escape(event.description)}`,
    `LOCATION:${escape(event.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function buildGoogleCalendarUrl(event: Event): string {
  const formatGoogleDate = (iso: string) =>
    iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatGoogleDate(event.startAt)}/${formatGoogleDate(event.endAt)}`,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
