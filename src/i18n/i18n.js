// src/i18n/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import en from "./locales/en.json";
import ar from "./locales/ar.json";
import ku from "./locales/ku.json";

// Define the default language, check local storage for saved language
const defaultLanguage = localStorage.getItem("i18nextLng") || "en";
document.documentElement.dir = defaultLanguage === "en" ? "ltr" : "rtl";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    ku: { translation: ku },
  },
  lng: defaultLanguage,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// Set the document direction and save language to local storage
i18n.on("languageChanged", (lng) => {
  document.documentElement.dir = lng === "en" ? "ltr" : "rtl";
  localStorage.setItem("i18nextLng", lng);
});

export default i18n;
