"use client";

import { useTranslation } from "react-i18next";
import { supportedLngs } from "../i18n";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language?.split("-")[0] ?? "en";

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    i18n.changeLanguage(event.target.value);
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 1000,
      }}
    >
      <label
        htmlFor="language-switcher"
        style={{ marginRight: "0.5rem", fontWeight: 600, color: "var(--color-label-text)" }}
      >
        {t("languageSwitcher.label")}:
      </label>
      <select
        id="language-switcher"
        value={supportedLngs.includes(currentLang as (typeof supportedLngs)[number]) ? currentLang : "en"}
        onChange={handleChange}
        aria-label={t("languageSwitcher.label")}
        style={{
          padding: "0.3rem 0.6rem",
          borderRadius: "6px",
          border: "1px solid var(--color-select-border)",
          fontSize: "0.9rem",
          cursor: "pointer",
          backgroundColor: "var(--color-select-bg)",
          color: "var(--color-select-text)",
        }}
      >
        {supportedLngs.map((lng) => (
          <option key={lng} value={lng}>
            {t(`languageSwitcher.${lng}`)}
          </option>
        ))}
      </select>
    </div>
  );
}
