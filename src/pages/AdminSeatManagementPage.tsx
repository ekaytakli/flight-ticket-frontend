import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import {
    previewFlights,
    previewSeatsByFlight,
} from "../data/dashboardPreviewData";
import "./AdminManagement.css";

export default function AdminSeatManagementPage() {
    const { t } = useTranslation();
    const { flightId } = useParams();

    /* URL'deki uçuş id'sine göre örnek koltukları bulur. */
    const numericFlightId = Number(flightId);
    const flight = previewFlights.find((item) => item.id === numericFlightId);
    const seats = previewSeatsByFlight[numericFlightId] ?? [];

    return (
        <div className="management-page">
            <Navbar />

            <main className="management-main">
                <header className="management-heading">
                    <div>
                        <p className="management-eyebrow">{t("adminSeats.eyebrow")}</p>
                        <h1>{t("adminSeats.title")}</h1>
                        <p>
                            {flight
                                ? t("adminSeats.flightDescription", {
                                    flightNo: flight.flightNo,
                                    departure: flight.departurePoint,
                                    destination: flight.destinationPoint,
                                })
                                : t("adminSeats.flightNotFound")}
                        </p>
                    </div>

                    <Link className="management-secondary-button" to="/admin/flights">
                        {t("common.back")}
                    </Link>
                </header>

                <section className="seat-management-grid">
                    {seats.map((seat) => (
                        <article
                            className={`seat-management-card ${
                                seat.isAvailable ? "is-available" : "is-unavailable"
                            }`}
                            key={seat.id}
                        >
                            <span className="seat-management-card__number">{seat.seatNumber}</span>
                            <span>{t("adminSeats.type")}: {t(`seatTypes.${seat.seatType}`)}</span>
                            <strong>
                                {seat.isAvailable
                                    ? t("adminSeats.available")
                                    : t("adminSeats.unavailable")}
                            </strong>
                        </article>
                    ))}
                </section>

                {seats.length === 0 && (
                    <p className="management-empty-state">{t("adminSeats.noSeats")}</p>
                )}

                <p className="management-preview-note">{t("adminSeats.previewNote")}</p>
            </main>
        </div>
    );
}
