import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import {
    deleteFlight,
    getAllFlights,
} from "../api/flightApi";
import { deleteSeat, getSeatsByFlightId } from "../api/seatApi";
import type { Flight } from "../types/flight";
import "./AdminManagement.css";

export default function AdminFlightsPage() {
    const { t, i18n } = useTranslation();
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");

    /* Sayfa açılınca uçuşları gerçek backend'den getirir. */
    useEffect(() => {
        let active = true;

        const loadFlights = async () => {
            try {
                const data = await getAllFlights();

                if (active) {
                    setFlights(data);
                }
            } catch {
                if (active) {
                    setError(t("adminFlights.loadError"));
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadFlights();

        return () => {
            active = false;
        };
    }, [t]);

    /* Uçuş saatlerini seçili dile göre biçimlendirir. */
    const formatDateTime = (value: string) =>
        new Intl.DateTimeFormat(
            i18n.language.startsWith("en") ? "en-US" : "tr-TR",
            { dateStyle: "medium", timeStyle: "short" },
        ).format(new Date(value));

    /* Backend cascade silme yapmadığı için önce uçuşun boş koltuklarını siler. */
    const handleDelete = async (flight: Flight) => {
        const confirmed = window.confirm(
            t("adminFlights.deleteConfirm", { flightNo: flight.flightNo }),
        );

        if (!confirmed) {
            return;
        }

        setNotice("");
        setError("");

        try {
            const seats = await getSeatsByFlightId(flight.id);

            /* Satılmış/dolu koltuk varsa kayıt geçmişini korumak için uçuşu silmez. */
            if (seats.some((seat) => !seat.isAvailable)) {
                setError(t("adminFlights.deleteHasSoldSeats"));
                return;
            }

            /* Foreign key hatasını önlemek için bağlı boş koltukları önce kaldırır. */
            for (const seat of seats) {
                await deleteSeat(seat.id);
            }

            await deleteFlight(flight.id);
            setFlights((current) => current.filter((item) => item.id !== flight.id));
            setNotice(t("adminFlights.deleteSuccess", { flightNo: flight.flightNo }));
        } catch {
            setError(t("adminFlights.deleteError"));
        }
    };

    return (
        <div className="management-page">
            <Navbar />

            <main className="management-main">
                <header className="management-heading">
                    <div>
                        <p className="management-eyebrow">{t("adminFlights.eyebrow")}</p>
                        <h1>{t("adminFlights.title")}</h1>
                        <p>{t("adminFlights.description")}</p>
                    </div>

                    <Link className="management-primary-button" to="/admin/flights/new">
                        {t("adminFlights.addFlight")}
                    </Link>
                </header>

                {notice && <p className="management-notice" role="status">{notice}</p>}
                {error && <p className="management-error" role="alert">{error}</p>}

                {loading ? (
                    <p className="management-empty-state">{t("common.loading")}</p>
                ) : (
                    <section className="management-table-card">
                        <div className="management-table-wrap">
                            <table className="management-table">
                                <thead>
                                    <tr>
                                        <th>{t("adminFlights.flightNo")}</th>
                                        <th>{t("adminFlights.route")}</th>
                                        <th>{t("adminFlights.departureTime")}</th>
                                        <th>{t("adminFlights.destinationTime")}</th>
                                        <th>{t("adminFlights.actions")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {flights.map((flight) => (
                                        <tr key={flight.id}>
                                            <td><strong>{flight.flightNo}</strong></td>
                                            <td>{flight.departurePoint} → {flight.destinationPoint}</td>
                                            <td>{formatDateTime(flight.departureTime)}</td>
                                            <td>{formatDateTime(flight.destinationTime)}</td>
                                            <td>
                                                <div className="management-actions">
                                                    <Link
                                                        className="management-action-button"
                                                        to={`/admin/flights/${flight.id}/edit`}
                                                    >
                                                        {t("adminFlights.edit")}
                                                    </Link>
                                                    <Link
                                                        className="management-action-button"
                                                        to={`/admin/flights/${flight.id}/seats`}
                                                    >
                                                        {t("adminFlights.seats")}
                                                    </Link>
                                                    <button
                                                        className="management-action-button management-action-button--danger"
                                                        type="button"
                                                        onClick={() => void handleDelete(flight)}
                                                    >
                                                        {t("adminFlights.delete")}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {!loading && !error && flights.length === 0 && (
                    <p className="management-empty-state">{t("adminFlights.noFlights")}</p>
                )}
            </main>
        </div>
    );
}
