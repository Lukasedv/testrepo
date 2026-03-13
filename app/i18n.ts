import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import fi from "./locales/fi.json";
import sv from "./locales/sv.json";

const supportedLngs = ["en", "fi", "sv"] as const;

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        fi: { translation: fi },
        sv: { translation: sv },
      },
      supportedLngs,
      // Strip region subtags (e.g. fi-FI → fi, sv-SE → sv) so browser
      // locale tags always resolve to a supported language instead of
      // falling back to English.
      load: "languageOnly",
      nonExplicitSupportedLngs: true,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "i18nextLng",
      },
    });
}

export default i18n;
export { supportedLngs };
