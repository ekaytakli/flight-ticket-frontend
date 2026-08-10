import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../components/LanguageSwitcher";
import type { Flight } from "../types/flight";
import "./FlightResultsPage.css";

export default function FlightResultsPage() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();

    const departure = searchParams.get("from") ?? "";
    const destination = searchParams.get("to") ?? "";
    const date = searchParams.get("date") ?? "";

    /*
     * Şimdilik yalnızca arayüzü test etmek için geçici veri.
     * Backend flight endpointi hazır olduğunda kaldırılacak.
     */
    const flights: Flight[] = [
        {
            id: 1,
            flightNo: "SR101",
            departurePoint: departure || "İstanbul",
            destinationPoint: destination || "Ankara",
            departureTime: `${date || "2026-08-15"}T09:00:00`,
            destinationTime: `${date || "2026-08-15"}T10:15:00`,
        },
        {
            id: 2,
            flightNo: "SR205",
            departurePoint: departure || "İstanbul",
            destinationPoint: destination || "Ankara",
            departureTime: `${date || "2026-08-15"}T14:30:00`,
            destinationTime: `${date || "2026-08-15"}T15:45:00`,
        },
    ];

    const formatTime = (dateTime: string) =>
        new Date(dateTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <main className="flight-results-page">
            <header className="flight-results-header">
                <Link
                    to="/"
                    className="flight-results-logo"
                >
                    ✈ SkyRoute
                </Link>

                <div className="flight-results-actions">
                    <LanguageSwitcher />

                    <Link
                        to="/"
                        className="flight-results-home-button"
                    >
                        {t("flightResults.backHome")}
                    </Link>
                </div>
            </header>

            <section className="flight-results-container">
                <div className="flight-results-heading">
                    <p className="flight-results-eyebrow">
                        {t("flightResults.eyebrow")}
                    </p>

                    <h1>
                        {t("flightResults.title")}
                    </h1>

                    <p>
                        {t("flightResults.description")}
                    </p>
                </div>

                <section className="flight-search-summary">
                    <div className="flight-search-summary-item">
                        <span>
                            {t("flightResults.departure")}
                        </span>

                        <strong>
                            {departure || "-"}
                        </strong>
                    </div>

                    <div className="flight-search-summary-arrow">
                        →
                    </div>

                    <div className="flight-search-summary-item">
                        <span>
                            {t("flightResults.destination")}
                        </span>

                        <strong>
                            {destination || "-"}
                        </strong>
                    </div>

                    <div className="flight-search-summary-item">
                        <span>
                            {t("flightResults.date")}
                        </span>

                        <strong>
                            {date || "-"}
                        </strong>
                    </div>
                </section>

                <section className="flight-list">
                    {flights.map((flight) => (
                        <article
                            className="flight-card"
                            key={flight.id}
                        >
                            <div className="flight-card-number">
                                <span>
                                    {t("flightResults.flightNo")}
                                </span>
                                <strong>
                                    {flight.flightNo}
                                </strong>
                            </div>

                            <div className="flight-card-route">
                                <div>
                                    <strong>
                                        {formatTime(
                                            flight.departureTime,
                                        )}
                                    </strong>

                                    <span>
                                        {flight.departurePoint}
                                    </span>
                                </div>

                                <div className="flight-card-line">
                                    <span>✈</span>
                                </div>

                                <div>
                                    <strong>
                                        {formatTime(
                                            flight.destinationTime,
                                        )}
                                    </strong>

                                    <span>
                                        {flight.destinationPoint}
                                    </span>
                                </div>
                            </div>

                            <Link
                                to={`/flights/${flight.id}/seats?${new URLSearchParams({
                                    flightNo: flight.flightNo,
                                    from: flight.departurePoint,
                                    to: flight.destinationPoint,
                                    date,
                                }).toString()}`}
                                className="flight-card-select"
                            >
                                {t("flightResults.selectFlight")}
                            </Link>
                        </article>
                    ))}
                </section>
            </section>
        </main>
    );
}