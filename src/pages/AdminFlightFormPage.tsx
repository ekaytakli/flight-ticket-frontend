import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import {
    createFlight,
    getFlightById,
    updateFlight,
    type FlightPayload,
} from "../api/flightApi";
import "./AdminManagement.css";

const emptyForm: FlightPayload = {
    flightNo: "",
    departurePoint: "",
    destinationPoint: "",
    departureTime: "",
    destinationTime: "",
};

/* Backend tarihini datetime-local inputuna uygun hale getirir. */
function toInputDateTime(value: string) {
    const normalized = value.replace(" ", "T");
    return normalized.length >= 16 ? normalized.slice(0, 16) : normalized;
}

export default function AdminFlightFormPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState<FlightPayload>(emptyForm);
    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    /* Düzenleme modunda mevcut uçuşu backend'den getirir. */
    useEffect(() => {
        if (!isEditMode) {
            return;
        }

        const numericId = Number(id);

        if (!Number.isFinite(numericId)) {
            setError(t("adminFlightForm.loadError"));
            setLoading(false);
            return;
        }

        let active = true;

        const loadFlight = async () => {
            try {
                const flight = await getFlightById(numericId);

                if (active) {
                    setFormData({
                        flightNo: flight.flightNo,
                        departurePoint: flight.departurePoint,
                        destinationPoint: flight.destinationPoint,
                        departureTime: toInputDateTime(flight.departureTime),
                        destinationTime: toInputDateTime(flight.destinationTime),
                    });
                }
            } catch {
                if (active) {
                    setError(t("adminFlightForm.loadError"));
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadFlight();

        return () => {
            active = false;
        };
    }, [id, isEditMode, t]);

    /* Aynı fonksiyon bütün input alanlarını günceller. */
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData((current) => ({
            ...current,
            [event.target.name]: event.target.value,
        }));
    };

    /* Formu POST veya PUT isteğiyle backend'e kaydeder. */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        setError("");

        try {
            if (isEditMode) {
                await updateFlight(Number(id), formData);
            } else {
                await createFlight(formData);
            }

            navigate("/admin/flights");
        } catch {
            setError(t("adminFlightForm.saveError"));
        } finally {
            setSaving(false);
        }
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

                {error && <p className="management-error" role="alert">{error}</p>}

                {loading ? (
                    <p className="management-empty-state">{t("common.loading")}</p>
                ) : (
                    <form className="management-form" onSubmit={(event) => void handleSubmit(event)}>
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

                        <div className="management-form-actions">
                            <Link className="management-secondary-button" to="/admin/flights">
                                {t("common.back")}
                            </Link>
                            <button
                                className="management-primary-button"
                                type="submit"
                                disabled={saving}
                            >
                                {saving
                                    ? t("common.loading")
                                    : isEditMode
                                        ? t("adminFlightForm.updateButton")
                                        : t("adminFlightForm.createButton")}
                            </button>
                        </div>
                    </form>
                )}
            </main>
        </div>
    );
}
