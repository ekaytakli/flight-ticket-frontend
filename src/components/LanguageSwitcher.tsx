import { useTranslation } from "react-i18next";

import type { SupportedLanguage } from "../i18n";
import "./LanguageSwitcher.css";

interface LanguageSwitcherProps {
    variant?: "inline" | "floating";
}

export default function LanguageSwitcher({
    variant = "inline",
}: LanguageSwitcherProps) {
    const { i18n } = useTranslation();
    const currentLanguage: SupportedLanguage =
        (i18n.resolvedLanguage ?? i18n.language).startsWith("en")
            ? "en"
            : "tr";

    const changeLanguage = (language: SupportedLanguage) => {
        void i18n.changeLanguage(language);
    };

    return (
        <div
            className={`language-switcher ${
                variant === "floating"
                    ? "language-switcher--floating"
                    : ""
            }`}
            aria-label="Language selection"
        >
            <button
                type="button"
                className={`language-switcher__button ${
                    currentLanguage === "tr" ? "is-active" : ""
                }`}
                onClick={() => changeLanguage("tr")}
                aria-pressed={currentLanguage === "tr"}
                aria-label="Türkçe"
            >
                TR
            </button>

            <button
                type="button"
                className={`language-switcher__button ${
                    currentLanguage === "en" ? "is-active" : ""
                }`}
                onClick={() => changeLanguage("en")}
                aria-pressed={currentLanguage === "en"}
                aria-label="English"
            >
                EN
            </button>
        </div>
    );
}
