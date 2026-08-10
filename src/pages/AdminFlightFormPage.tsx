import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import { previewFlights } from "../data/dashboardPreviewData";
import "./AdminManagement.css";

interface FlightFormData {
    flightNo: string;
    departurePoint: string;
    destinationPoint: string;
    departureTime: string;
    destinationTime: string;
}

const emptyForm: FlightFormData = {
    flightNo: "",
    departurePoint: "",
    destinationPoint: "",
    departureTime: "",
    destinationTime: "",
};

export default function AdminFlightFormPage() {
    const { t } = useTranslation();
    const { id } = useParams();

    /* URL'de id varsa form düzenleme modunda açılır. */
    const flightToEdit = previewFlights.find((flight) => flight.id === Number(id));
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState<FlightFormData>(() =>
        flightToEdit
            ? {
                flightNo: flightToEdit.flightNo,
                departurePoint: flightToEdit.departurePoint,
                destinationPoint: flightToEdit.destinationPoint,
                departureTime: flightToEdit.departureTime,
                destinationTime: flightToEdit.destinationTime,
            }
            : emptyForm,
    );
    const [message, setMessage] = useState("");

    /* Aynı fonksiyon bütün input alanlarını günceller. */
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData((current) => ({
            ...current,
            [event.target.name]: event.target.value,
        }));
    };

    /* Şimdilik API çağrısı yapmaz, formun hazır olduğunu gösterir. */
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage(
            isEditMode
                ? t("adminFlightForm.updatePreview")
                : t("adminFlightForm.createPreview"),
        );
    };

    return (
        <div className="management-page">
            <Navbar />

            <main className="management-main management-main--narrow">
                <header className="management-heading">
                    <div>
                        <p className="management-eyebrow">{t("adminFlightForm.eyebrow")}</p>
                        <h1>
                            {isEditMode
                                ? t("adminFlightForm.editTitle")
                                : t("adminFlightForm.newTitle")}
                        </h1>
                        <p>{t("adminFlightForm.description")}</p>
                    </div>
                </header>

                <form className="management-form" onSubmit={handleSubmit}>
                    <div className="management-form-grid">
                        <label className="management-field">
                            <span>{t("adminFlightForm.flightNo")}</span>
                            <input
                                name="flightNo"
                                value={formData.flightNo}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="management-field">
                            <span>{t("adminFlightForm.departurePoint")}</span>
                            <input
                                name="departurePoint"
                                value={formData.departurePoint}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="management-field">
                            <span>{t("adminFlightForm.destinationPoint")}</span>
                            <input
                                name="destinationPoint"
                                value={formData.destinationPoint}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="management-field">
                            <span>{t("adminFlightForm.departureTime")}</span>
                            <input
                                name="departureTime"
                                type="datetime-local"
                                value={formData.departureTime}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="management-field">
                            <span>{t("adminFlightForm.destinationTime")}</span>
                            <input
                                name="destinationTime"
                                type="datetime-local"
                                value={formData.destinationTime}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>

                    {message && <p className="management-notice" role="status">{message}</p>}

                    <div className="management-form-actions">
                        <Link className="management-secondary-button" to="/admin/flights">
                            {t("common.back")}
                        </Link>
                        <button className="management-primary-button" type="submit">
                            {isEditMode
                                ? t("adminFlightForm.updateButton")
                                : t("adminFlightForm.createButton")}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
