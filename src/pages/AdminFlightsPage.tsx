import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import { previewFlights } from "../data/dashboardPreviewData";
import "./AdminManagement.css";

export default function AdminFlightsPage() {
    const { t, i18n } = useTranslation();
    const [notice, setNotice] = useState("");

    /* Uçuş saatlerini seçili dile göre biçimlendirir. */
    const formatDateTime = (value: string) =>
        new Intl.DateTimeFormat(
            i18n.language.startsWith("en") ? "en-US" : "tr-TR",
            { dateStyle: "medium", timeStyle: "short" },
        ).format(new Date(value));

    /* Backend hazır olmadığı için silme butonu sadece bilgilendirme gösterir. */
    const handleDeletePreview = (flightNo: string) => {
        setNotice(t("adminFlights.deletePreview", { flightNo }));
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
                                {previewFlights.map((flight) => (
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
                                                    onClick={() => handleDeletePreview(flight.flightNo)}
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

                <p className="management-preview-note">{t("adminFlights.previewNote")}</p>
            </main>
        </div>
    );
}
