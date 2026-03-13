"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Keeps the <html lang> attribute in sync with the active i18next language.
 * Must be rendered inside I18nProvider.
 */
export default function HtmlLangSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return null;
}
