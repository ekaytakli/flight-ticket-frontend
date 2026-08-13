// Form alanlarını state'te tutmak ve form gönderme event tipini kullanmak için alınır.
import { useState, type FormEvent } from "react";

// Sayfalar arası bağlantı ve kod ile yönlendirme yapmak için kullanılır.
import { Link, useNavigate } from "react-router-dom";

// Sayfadaki metinleri seçilen dile göre göstermek için kullanılır.
import { useTranslation } from "react-i18next";

// Türkçe / İngilizce dil değiştirme bileşenidir.
import LanguageSwitcher from "../components/LanguageSwitcher";

// Ana sayfanın stil dosyasıdır.
import "./HomePage.css";

/*
 * Kullanıcının giriş yapmadan uçuş arayabildiği ana sayfadır.
 * Kalkış, varış ve tarih bilgilerini uçuş sonuçları sayfasına aktarır.
 */
export default function HomePage() {
    // Arama sonrası FlightResultsPage'e yönlendirme yapmak için kullanılır.
    const navigate = useNavigate();

    // Çeviri dosyalarındaki metinlere erişir.
    const { t } = useTranslation();

    // Kullanıcının seçtiği kalkış noktasını tutar.
    const [departure, setDeparture] = useState("");

    // Kullanıcının seçtiği varış noktasını tutar.
    const [destination, setDestination] = useState("");

    // Kullanıcının seçtiği uçuş tarihini tutar.
    const [date, setDate] = useState("");

    // Form doğrulama hata mesajını tutar.
    const [error, setError] = useState("");

    /*
     * Kullanıcı "Uçuş Ara" butonuna bastığında çalışır.
     * Alanları kontrol edip arama bilgilerini sonuç sayfasına gönderir.
     */
    const handleSearch = (
        event: FormEvent<HTMLFormElement>,
    ) => {
        // Form gönderildiğinde sayfanın yenilenmesini engeller.
        event.preventDefault();

        // Önceden oluşmuş hata mesajını temizler.
        setError("");

        // Kalkış, varış veya tarih boşsa arama işlemini durdurur.
        if (
            !departure.trim() ||
            !destination.trim() ||
            !date
        ) {
            setError(t("home.errors.required"));
            return;
        }

        /*
         * Arama bilgilerini URL'de taşınabilecek
         * query parametrelerine dönüştürür.
         */
        const params = new URLSearchParams({
            from: departure.trim(),
            to: destination.trim(),
            date,
        });

        // Kullanıcıyı arama bilgileriyle FlightResultsPage'e yönlendirir.
        navigate(`/flights?${params.toString()}`);
    };

    return (
        <main className="home-page">

            {/* Ana sayfanın üst menüsü. */}
            <header className="home-header">

                {/* Logoya basıldığında tekrar ana sayfaya gider. */}
                <Link to="/" className="home-logo">
                    ✈ SkyRoute
                </Link>

                {/* Dil, giriş ve kayıt bağlantılarını içerir. */}
                <nav className="home-navigation">
                    <LanguageSwitcher />

                    {/* Login sayfasına yönlendirir. */}
                    <Link
                        to="/login"
                        className="home-login-button"
                    >
                        {t("auth.loginButton")}
                    </Link>

                    {/* Register sayfasına yönlendirir. */}
                    <Link
                        to="/register"
                        className="home-register-button"
                    >
                        {t("auth.registerButton")}
                    </Link>
                </nav>
            </header>

            {/* Ana sayfadaki uçuş arama bölümüdür. */}
            <section className="home-hero">
                <div className="home-hero-content">

                    {/* Ana sayfanın küçük üst başlığını gösterir. */}
                    <p className="home-eyebrow">
                        {t("home.eyebrow")}
                    </p>

                    {/* Ana başlığı gösterir. */}
                    <h1 className="home-title">
                        {t("home.title")}
                    </h1>

                    {/* Ana sayfa açıklamasını gösterir. */}
                    <p className="home-description">
                        {t("home.description")}
                    </p>

                    {/* Form gönderildiğinde handleSearch çalışır. */}
                    <form
                        className="flight-search-form"
                        onSubmit={handleSearch}
                    >

                        {/* Kalkış noktası alanı. */}
                        <div className="flight-search-field">
                            <label htmlFor="departure">
                                {t("home.departure")}
                            </label>

                            <input
                                id="departure"
                                type="text"

                                // Input değerini departure state'ine bağlar.
                                value={departure}

                                placeholder={t(
                                    "home.departurePlaceholder",
                                )}

                                // Kullanıcı yazdıkça departure state'ini günceller.
                                onChange={(event) =>
                                    setDeparture(
                                        event.target.value,
                                    )
                                }
                            />
                        </div>

                        {/* Varış noktası alanı. */}
                        <div className="flight-search-field">
                            <label htmlFor="destination">
                                {t("home.destination")}
                            </label>

                            <input
                                id="destination"
                                type="text"
                                value={destination}
                                placeholder={t(
                                    "home.destinationPlaceholder",
                                )}

                                // Kullanıcı yazdıkça destination state'ini günceller.
                                onChange={(event) =>
                                    setDestination(
                                        event.target.value,
                                    )
                                }
                            />
                        </div>

                        {/* Uçuş tarihi alanı. */}
                        <div className="flight-search-field">
                            <label htmlFor="date">
                                {t("home.date")}
                            </label>

                            <input
                                id="date"
                                type="date"
                                value={date}

                                // Seçilen tarihi date state'ine kaydeder.
                                onChange={(event) =>
                                    setDate(event.target.value)
                                }
                            />
                        </div>

                        {/* Formu gönderip uçuş aramasını başlatır. */}
                        <button
                            type="submit"
                            className="flight-search-button"
                        >
                            {t("home.searchButton")}
                        </button>
                    </form>

                    {/* Formda hata varsa kullanıcıya gösterir. */}
                    {error && (
                        <p
                            className="home-error"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}