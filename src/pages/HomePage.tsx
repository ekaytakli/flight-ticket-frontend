import { useState, type FormEvent } from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../components/LanguageSwitcher";

// Giriş yapan kullanıcının bilgilerine ve logout fonksiyonuna erişir.
import { useAuth } from "../hooks/useAuth";

import "./HomePage.css";

/*
 * Kullanıcının giriş yapmadan da uçuş arayabildiği ana sayfadır.
 *
 * Kullanıcı giriş yaptıysa üst menüde
 * oturum bilgisi ve panel bağlantısı gösterilir.
 */
export default function HomePage() {
    const navigate = useNavigate();

    const { t } = useTranslation();

    /*
     * Giriş yapan kullanıcı bilgilerini ve
     * çıkış yapma fonksiyonunu AuthContext'ten alır.
     */
    const { user, logout } = useAuth();

    const [departure, setDeparture] =
        useState("");

    const [destination, setDestination] =
        useState("");

    const [date, setDate] =
        useState("");

    const [error, setError] =
        useState("");

    /*
     * Kullanıcı giriş yaptıysa rolüne göre
     * yönlendirileceği dashboard adresini belirler.
     */
    const dashboardPath =
        user?.role === "ROLE_ADMIN"
            ? "/admin"
            : "/customer";

    /*
     * Kullanıcı çıkış yaptığında
     * oturum bilgilerini temizler.
     *
     * Ana sayfa public olduğu için kullanıcı
     * ana sayfada kalmaya devam eder.
     */
    const handleLogout = () => {
        logout();
    };

    /*
     * Kullanıcı "Uçuş Ara" butonuna bastığında çalışır.
     */
    const handleSearch = (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setError("");

        if (
            !departure.trim() ||
            !destination.trim() ||
            !date
        ) {
            setError(
                t("home.errors.required"),
            );
            return;
        }

        const params =
            new URLSearchParams({
                from: departure.trim(),
                to: destination.trim(),
                date,
            });

        navigate(
            `/flights?${params.toString()}`,
        );
    };

    return (
        <main className="home-page">

            {/* Ana sayfanın üst menüsü. */}
            <header className="home-header">

                <Link
                    to="/"
                    className="home-logo"
                >
                    ✈ SkyRoute
                </Link>

                <nav className="home-navigation">

                    <LanguageSwitcher />

                    {/*
                     * Kullanıcı giriş yaptıysa
                     * login/register yerine hesap bilgileri gösterilir.
                     */}
                    {user ? (
                        <>
                            {/* Giriş yapan kullanıcının e-postasını gösterir. */}
                            <span className="home-user-email">
                                {user.email}
                            </span>

                            {/*
                             * Admin ise admin paneline,
                             * customer ise customer paneline gider.
                             */}
                            <Link
                                to={dashboardPath}
                                className="home-login-button"
                            >
                                {user.role ===
                                "ROLE_ADMIN"
                                    ? t(
                                        "navigation.adminDashboard",
                                    )
                                    : t(
                                        "navigation.customerDashboard",
                                    )}
                            </Link>

                            {/* Kullanıcıyı oturumdan çıkarır. */}
                            <button
                                type="button"
                                className="home-register-button"
                                onClick={handleLogout}
                            >
                                {t("common.logout")}
                            </button>
                        </>
                    ) : (
                        <>
                            {/*
                             * Kullanıcı giriş yapmamışsa
                             * normal login/register butonları gösterilir.
                             */}
                            <Link
                                to="/login"
                                className="home-login-button"
                            >
                                {t(
                                    "auth.loginButton",
                                )}
                            </Link>

                            <Link
                                to="/register"
                                className="home-register-button"
                            >
                                {t(
                                    "auth.registerButton",
                                )}
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            {/* Ana sayfadaki uçuş arama bölümü. */}
            <section className="home-hero">
                <div className="home-hero-content">

                    <p className="home-eyebrow">
                        {t("home.eyebrow")}
                    </p>

                    <h1 className="home-title">
                        {t("home.title")}
                    </h1>

                    <p className="home-description">
                        {t(
                            "home.description",
                        )}
                    </p>

                    <form
                        className="flight-search-form"
                        onSubmit={handleSearch}
                    >
                        <div className="flight-search-field">
                            <label htmlFor="departure">
                                {t(
                                    "home.departure",
                                )}
                            </label>

                            <input
                                id="departure"
                                type="text"
                                value={departure}
                                placeholder={t(
                                    "home.departurePlaceholder",
                                )}
                                onChange={(
                                    event,
                                ) =>
                                    setDeparture(
                                        event.target
                                            .value,
                                    )
                                }
                            />
                        </div>

                        <div className="flight-search-field">
                            <label htmlFor="destination">
                                {t(
                                    "home.destination",
                                )}
                            </label>

                            <input
                                id="destination"
                                type="text"
                                value={destination}
                                placeholder={t(
                                    "home.destinationPlaceholder",
                                )}
                                onChange={(
                                    event,
                                ) =>
                                    setDestination(
                                        event.target
                                            .value,
                                    )
                                }
                            />
                        </div>

                        <div className="flight-search-field">
                            <label htmlFor="date">
                                {t("home.date")}
                            </label>

                            <input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(
                                    event,
                                ) =>
                                    setDate(
                                        event.target
                                            .value,
                                    )
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            className="flight-search-button"
                        >
                            {t(
                                "home.searchButton",
                            )}
                        </button>
                    </form>

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