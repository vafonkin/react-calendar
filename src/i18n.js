import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import detector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";
import translationEN from "../dist/locales/en/translation.json";
import translationDE from "../dist/locales/de/translation.json";
import translationRU from "../dist/locales/ru/translation.json";

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  de: {
    translation: translationDE
  },
  ru: {
    translation: translationRU
  }
};

i18n
  .use(Backend)
  .use(detector)
  .use(reactI18nextModule)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    whitelist: ["en", "de", "ru"],
    keySeparator: ".",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
