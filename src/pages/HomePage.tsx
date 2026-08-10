import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../components/LanguageSwitcher";
import "./HomePage.css";

export default function HomePage() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [departure, setDeparture] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");

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
            setError(t("home.errors.required"));
            return;
        }

        const params = new URLSearchParams({
            from: departure.trim(),
            to: destination.trim(),
            date,
        });

        navigate(`/flights?${params.toString()}`);
    };

    return (
        <main className="home-page">
            <header className="home-header">
                <Link to="/" className="home-logo">
                    ✈ SkyRoute
                </Link>

                <nav className="home-navigation">
                    <LanguageSwitcher />

                    <Link
                        to="/login"
                        className="home-login-button"
                    >
                        {t("auth.loginButton")}
                    </Link>

                    <Link
                        to="/register"
                        className="home-register-button"
                    >
                        {t("auth.registerButton")}
                    </Link>
                </nav>
            </header>

            <section className="home-hero">
                <div className="home-hero-content">
                    <p className="home-eyebrow">
                        {t("home.eyebrow")}
                    </p>

                    <h1 className="home-title">
                        {t("home.title")}
                    </h1>

                    <p className="home-description">
                        {t("home.description")}
                    </p>

                    <form
                        className="flight-search-form"
                        onSubmit={handleSearch}
                    >
                        <div className="flight-search-field">
                            <label htmlFor="departure">
                                {t("home.departure")}
                            </label>

                            <input
                                id="departure"
                                type="text"
                                value={departure}
                                placeholder={t(
                                    "home.departurePlaceholder",
                                )}
                                onChange={(event) =>
                                    setDeparture(
                                        event.target.value,
                                    )
                                }
                            />
                        </div>

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
                                onChange={(event) =>
                                    setDestination(
                                        event.target.value,
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
                                onChange={(event) =>
                                    setDate(event.target.value)
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            className="flight-search-button"
                        >
                            {t("home.searchButton")}
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