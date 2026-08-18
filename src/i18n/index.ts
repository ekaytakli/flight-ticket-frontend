import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import tr from "./locales/tr.json";

/*
 * Uygulamanın desteklediği dilleri tanımlar.
 */
export type SupportedLanguage = "tr" | "en";

/*
 * Tarayıcıdan veya localStorage'dan gelen dil bilgisini
 * uygulamanın desteklediği "tr" veya "en" değerine dönüştürür.
 */
function normalizeLanguage(
    language?: string,
): SupportedLanguage {
    return language?.startsWith("en")
        ? "en"
        : "tr";
}

/*
 * localStorage bazı test ortamlarında bulunmayabilir.
 * Bu nedenle doğrudan localStorage kullanmak yerine
 * önce kullanılabilir olup olmadığını kontrol ederiz.
 */
function canUseLocalStorage(): boolean {
    return (
        typeof window !== "undefined" &&
        typeof window.localStorage !== "undefined"
    );
}

/*
 * Kullanıcının daha önce seçtiği dili localStorage'dan alır.
 *
 * Vitest gibi test ortamlarında localStorage yoksa
 * undefined gönderilir ve varsayılan olarak Türkçe kullanılır.
 */
const savedLanguage = normalizeLanguage(
    canUseLocalStorage()
        ? window.localStorage.getItem("language") ??
        undefined
        : undefined,
);

/*
 * i18next yapılandırmasını başlatır.
 */
void i18n
    .use(initReactI18next)
    .init({
        // Kullanılacak Türkçe ve İngilizce çeviri dosyaları.
        resources: {
            tr: {
                translation: tr,
            },
            en: {
                translation: en,
            },
        },

        // Başlangıçta kullanılacak dil.
        lng: savedLanguage,

        // Dil bulunamazsa Türkçe kullanılır.
        fallbackLng: "tr",

        // Uygulamanın desteklediği diller.
        supportedLngs: [
            "tr",
            "en",
        ],

        interpolation: {
            // React zaten XSS koruması sağladığı için
            // i18next'in ayrıca escape yapmasına gerek yoktur.
            escapeValue: false,
        },
    });

/*
 * Kullanıcı dili değiştirdiğinde:
 *
 * 1. HTML belgesinin lang özelliğini günceller.
 * 2. localStorage kullanılabiliyorsa seçilen dili kaydeder.
 */
const updateDocumentLanguage = (
    language: string,
) => {
    const normalizedLanguage =
        normalizeLanguage(language);

    /*
     * document yalnızca tarayıcı ortamında bulunur.
     */
    if (typeof document !== "undefined") {
        document.documentElement.lang =
            normalizedLanguage;
    }

    /*
     * Normal tarayıcı ortamında seçilen dili kaydeder.
     * Test ortamında localStorage yoksa bu işlem atlanır.
     */
    if (canUseLocalStorage()) {
        window.localStorage.setItem(
            "language",
            normalizedLanguage,
        );
    }
};

/*
 * Uygulama ilk açıldığında HTML dilini ayarlar.
 */
updateDocumentLanguage(savedLanguage);

/*
 * Kullanıcı daha sonra dili değiştirirse
 * document ve localStorage bilgisini günceller.
 */
i18n.on(
    "languageChanged",
    updateDocumentLanguage,
);

export default i18n;