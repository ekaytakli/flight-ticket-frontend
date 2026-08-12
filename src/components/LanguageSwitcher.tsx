// Uygulamanın aktif diline erişmek ve dili değiştirmek için kullanılır.
import { useTranslation } from "react-i18next";

// Uygulamada desteklenen "tr" ve "en" dil tiplerini alır.
import type { SupportedLanguage } from "../i18n";

// Dil değiştirme butonlarının stil dosyasıdır.
import "./LanguageSwitcher.css";

/*
 * Bileşenin normal veya ekranda sabit şekilde
 * gösterilip gösterilmeyeceğini belirler.
 */
interface LanguageSwitcherProps {
    variant?: "inline" | "floating";
}

/*
 * Kullanıcının Türkçe ve İngilizce arasında
 * geçiş yapmasını sağlayan ortak bileşendir.
 */
export default function LanguageSwitcher({
                                             // Variant gönderilmezse varsayılan olarak inline kullanılır.
                                             variant = "inline",
                                         }: LanguageSwitcherProps) {

    // i18next'in dil yönetimi nesnesine erişir.
    const { i18n } = useTranslation();

    // Uygulamada şu anda hangi dilin aktif olduğunu belirler.
    const currentLanguage: SupportedLanguage =
        (i18n.resolvedLanguage ?? i18n.language).startsWith("en")
            ? "en"
            : "tr";

    // Kullanıcının seçtiği dili uygulamanın aktif dili yapar.
    const changeLanguage = (language: SupportedLanguage) => {
        void i18n.changeLanguage(language);
    };

    return (
        <div
            // Floating seçilmişse ek CSS sınıfı eklenir.
            className={`language-switcher ${
                variant === "floating"
                    ? "language-switcher--floating"
                    : ""
            }`}
            aria-label="Language selection"
        >
            {/* Türkçe dilini seçen buton. */}
            <button
                type="button"
                // Türkçe aktifse butona is-active sınıfı eklenir.
                className={`language-switcher__button ${
                    currentLanguage === "tr" ? "is-active" : ""
                }`}
                // Butona basıldığında dili Türkçe yapar.
                onClick={() => changeLanguage("tr")}
                aria-pressed={currentLanguage === "tr"}
                aria-label="Türkçe"
            >
                TR
            </button>

            {/* İngilizce dilini seçen buton. */}
            <button
                type="button"
                // İngilizce aktifse butona is-active sınıfı eklenir.
                className={`language-switcher__button ${
                    currentLanguage === "en" ? "is-active" : ""
                }`}
                // Butona basıldığında dili İngilizce yapar.
                onClick={() => changeLanguage("en")}
                aria-pressed={currentLanguage === "en"}
                aria-label="English"
            >
                EN
            </button>
        </div>
    );
}