"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Event, EventStatus, EVENT_CATEGORIES } from "../../lib/eventData";

export interface EventFormProps {
  initialData?: Partial<Event>;
  onSubmit: (data: Omit<Event, "id" | "rsvpCount" | "createdBy">) => void;
  submitLabel: string;
  title: string;
}

export function EventForm({
  initialData,
  onSubmit,
  submitLabel,
  title,
}: EventFormProps) {
  const { t } = useTranslation();

  const [formTitle, setFormTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [startAt, setStartAt] = useState(
    initialData?.startAt
      ? new Date(initialData.startAt).toISOString().slice(0, 16)
      : ""
  );
  const [endAt, setEndAt] = useState(
    initialData?.endAt
      ? new Date(initialData.endAt).toISOString().slice(0, 16)
      : ""
  );
  const [timezone, setTimezone] = useState(initialData?.timezone ?? "UTC");
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [category, setCategory] = useState(
    initialData?.category ?? EVENT_CATEGORIES[0]
  );
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");
  const [capacity, setCapacity] = useState(
    initialData?.capacity?.toString() ?? ""
  );
  const [published, setPublished] = useState(
    initialData?.status === "published"
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formTitle.trim()) errs.title = t("events.form.titleRequired");
    if (!startAt) errs.startAt = t("events.form.startAtRequired");
    if (!endAt) errs.endAt = t("events.form.endAtRequired");
    if (!timezone) errs.timezone = t("events.form.timezoneRequired");
    if (startAt && endAt && new Date(endAt) <= new Date(startAt)) {
      errs.endAt = t("events.form.endAfterStart");
    }
    if (capacity && (isNaN(Number(capacity)) || Number(capacity) <= 0)) {
      errs.capacity = t("events.form.capacityPositive");
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: formTitle.trim(),
      description: description.trim(),
      startAt: new Date(startAt).toISOString(),
      endAt: new Date(endAt).toISOString(),
      timezone,
      location: location.trim(),
      category,
      coverImage: coverImage.trim(),
      capacity: capacity ? Number(capacity) : null,
      status: (published ? "published" : "draft") as EventStatus,
    });
    setDirty(false);
  };

  const handleChange = (setter: (v: string) => void) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setter(e.target.value);
    setDirty(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <h2 style={{ margin: "0 0 0.5rem", color: "#2d3748" }}>{title}</h2>

      <Field label={t("events.form.titleLabel")} error={errors.title}>
        <input
          type="text"
          value={formTitle}
          onChange={handleChange(setFormTitle)}
          placeholder={t("events.form.titlePlaceholder")}
          style={inputStyle(!!errors.title)}
          required
        />
      </Field>

      <Field label={t("events.form.descriptionLabel")}>
        <textarea
          value={description}
          onChange={handleChange(setDescription)}
          placeholder={t("events.form.descriptionPlaceholder")}
          rows={5}
          style={{ ...inputStyle(false), resize: "vertical" }}
        />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <Field label={t("events.form.startAtLabel")} error={errors.startAt}>
          <input
            type="datetime-local"
            value={startAt}
            onChange={handleChange(setStartAt)}
            style={inputStyle(!!errors.startAt)}
            required
          />
        </Field>
        <Field label={t("events.form.endAtLabel")} error={errors.endAt}>
          <input
            type="datetime-local"
            value={endAt}
            onChange={handleChange(setEndAt)}
            style={inputStyle(!!errors.endAt)}
            required
          />
        </Field>
      </div>

      <Field label={t("events.form.timezoneLabel")} error={errors.timezone}>
        <select
          value={timezone}
          onChange={handleChange(setTimezone)}
          style={inputStyle(!!errors.timezone)}
        >
          <option value="UTC">UTC</option>
          <option value="Europe/Stockholm">Europe/Stockholm</option>
          <option value="Europe/Helsinki">Europe/Helsinki</option>
          <option value="America/New_York">America/New_York</option>
          <option value="America/Los_Angeles">America/Los_Angeles</option>
          <option value="Asia/Tokyo">Asia/Tokyo</option>
        </select>
      </Field>

      <Field label={t("events.form.locationLabel")}>
        <input
          type="text"
          value={location}
          onChange={handleChange(setLocation)}
          placeholder={t("events.form.locationPlaceholder")}
          style={inputStyle(false)}
        />
      </Field>

      <Field label={t("events.form.categoryLabel")}>
        <select
          value={category}
          onChange={handleChange(setCategory)}
          style={inputStyle(false)}
        >
          {EVENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t("events.form.coverImageLabel")}>
        <input
          type="url"
          value={coverImage}
          onChange={handleChange(setCoverImage)}
          placeholder={t("events.form.coverImagePlaceholder")}
          style={inputStyle(false)}
        />
      </Field>

      <Field label={t("events.form.capacityLabel")} error={errors.capacity}>
        <input
          type="number"
          value={capacity}
          onChange={handleChange(setCapacity)}
          placeholder={t("events.form.capacityPlaceholder")}
          min={1}
          style={inputStyle(!!errors.capacity)}
        />
      </Field>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => { setPublished(e.target.checked); setDirty(true); }}
          style={{ width: "18px", height: "18px", cursor: "pointer" }}
        />
        <label
          htmlFor="published"
          style={{ color: "#4a5568", fontSize: "0.95rem", cursor: "pointer" }}
        >
          {t("events.form.publishedLabel")}
        </label>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
        <button
          type="submit"
          style={{
            padding: "0.6rem 1.75rem",
            background: "#3182ce",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "0.95rem",
            fontFamily: "Arial, sans-serif",
            cursor: "pointer",
          }}
        >
          {submitLabel}
        </button>
        <Link
          href="/events"
          onClick={(e) => {
            if (dirty && !window.confirm(t("events.unsavedChanges"))) {
              e.preventDefault();
            }
          }}
          style={{
            padding: "0.6rem 1.2rem",
            background: "#edf2f7",
            color: "#4a5568",
            border: "none",
            borderRadius: "8px",
            fontSize: "0.95rem",
            fontFamily: "Arial, sans-serif",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          {t("events.cancel")}
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      <label style={{ fontSize: "0.88rem", fontWeight: 600, color: "#4a5568" }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{ fontSize: "0.82rem", color: "#e53e3e" }}>{error}</span>
      )}
    </div>
  );
}

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  padding: "0.45rem 0.75rem",
  borderRadius: "6px",
  border: `1px solid ${hasError ? "#fc8181" : "#cbd5e0"}`,
  fontSize: "0.92rem",
  fontFamily: "Arial, sans-serif",
  color: "#2d3748",
  background: "#f7fafc",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
});
