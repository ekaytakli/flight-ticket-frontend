import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import tr from "./locales/tr.json";

export type SupportedLanguage = "tr" | "en";

function normalizeLanguage(language?: string): SupportedLanguage {
    return language?.startsWith("en") ? "en" : "tr";
}

const savedLanguage = normalizeLanguage(
    localStorage.getItem("language") ?? undefined,
);

void i18n.use(initReactI18next).init({
    resources: {
        tr: { translation: tr },
        en: { translation: en },
    },
    lng: savedLanguage,
    fallbackLng: "tr",
    supportedLngs: ["tr", "en"],
    interpolation: {
        escapeValue: false,
    },
});

const updateDocumentLanguage = (language: string) => {
    const normalizedLanguage = normalizeLanguage(language);
    document.documentElement.lang = normalizedLanguage;
    localStorage.setItem("language", normalizedLanguage);
};

updateDocumentLanguage(savedLanguage);
i18n.on("languageChanged", updateDocumentLanguage);

export default i18n;
