import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import { getFlightById } from "../api/flightApi";
import {
    createSeat,
    deleteSeat,
    getSeatsByFlightId,
    updateSeat,
    type SeatPayload,
} from "../api/seatApi";
import type { Flight } from "../types/flight";
import type { Seat } from "../types/seat";
import "./AdminManagement.css";

interface SeatFormState {
    seatNumber: string;
    seatType: string;
    isAvailable: boolean;
    price: string;
}

const emptySeatForm: SeatFormState = {
    seatNumber: "",
    seatType: "",
    isAvailable: true,
    price: "",
};

export default function AdminSeatManagementPage() {
    const { t, i18n } = useTranslation();
    const { flightId } = useParams();
    const numericFlightId = Number(flightId);

    const [flight, setFlight] = useState<Flight | null>(null);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [editingSeatId, setEditingSeatId] = useState<number | null>(null);
    const [formData, setFormData] = useState<SeatFormState>(emptySeatForm);

    /* Uçuşu ve koltukları backend'den birlikte getirir. */
    useEffect(() => {
        if (!Number.isFinite(numericFlightId)) {
            setError(t("adminSeats.loadError"));
            setLoading(false);
            return;
        }

        let active = true;

        const loadPage = async () => {
            try {
                const [flightData, seatData] = await Promise.all([
                    getFlightById(numericFlightId),
                    getSeatsByFlightId(numericFlightId),
                ]);

                if (active) {
                    setFlight(flightData);
                    setSeats(seatData);
                }
            } catch {
                if (active) {
                    setError(t("adminSeats.loadError"));
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadPage();

        return () => {
            active = false;
        };
    }, [numericFlightId, t]);

    /* Fiyatı seçili dile göre gösterir. */
    const formatPrice = (price: number) =>
        new Intl.NumberFormat(
            i18n.language.startsWith("en") ? "en-US" : "tr-TR",
            { style: "currency", currency: "TRY" },
        ).format(price);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    /* Seçilen koltuğu düzenleme formuna taşır. */
    const startEdit = (seat: Seat) => {
        setEditingSeatId(seat.id);
        setFormData({
            seatNumber: seat.seatNumber,
            seatType: seat.seatType,
            isAvailable: seat.isAvailable,
            price: String(seat.price),
        });
        setNotice("");
        setError("");
    };

    const cancelEdit = () => {
        setEditingSeatId(null);
        setFormData(emptySeatForm);
    };

    /* Koltuğu POST veya PUT isteğiyle backend'e kaydeder. */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        setNotice("");
        setError("");

        const payload: SeatPayload = {
            seatNumber: formData.seatNumber,
            seatType: formData.seatType,
            isAvailable: formData.isAvailable,
            price: Number(formData.price),
            flightId: numericFlightId,
        };

        try {
            if (editingSeatId) {
                const updated = await updateSeat(editingSeatId, payload);
                setSeats((current) =>
                    current.map((seat) => seat.id === updated.id ? updated : seat),
                );
                setNotice(t("adminSeats.updateSuccess"));
            } else {
                const created = await createSeat(payload);
                setSeats((current) => [...current, created]);
                setNotice(t("adminSeats.createSuccess"));
            }

            cancelEdit();
        } catch {
            setError(t("adminSeats.saveError"));
        } finally {
            setSaving(false);
        }
    };

    /* Onaydan sonra koltuğu backend'den siler. */
    const handleDelete = async (seat: Seat) => {
        const confirmed = window.confirm(
            t("adminSeats.deleteConfirm", { seatNumber: seat.seatNumber }),
        );

        if (!confirmed) {
            return;
        }

        setNotice("");
        setError("");

        try {
            await deleteSeat(seat.id);
            setSeats((current) => current.filter((item) => item.id !== seat.id));
            setNotice(t("adminSeats.deleteSuccess"));

            if (editingSeatId === seat.id) {
                cancelEdit();
            }
        } catch {
            setError(t("adminSeats.deleteError"));
        }
    };

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

                {notice && <p className="management-notice" role="status">{notice}</p>}
                {error && <p className="management-error" role="alert">{error}</p>}

                {!loading && !error && (
                    <form className="management-form management-seat-form" onSubmit={(event) => void handleSubmit(event)}>
                        <h2>
                            {editingSeatId
                                ? t("adminSeats.editSeatTitle")
                                : t("adminSeats.addSeatTitle")}
                        </h2>

                        <div className="management-form-grid">
                            <label className="management-field">
                                <span>{t("adminSeats.seatNumber")}</span>
                                <input
                                    name="seatNumber"
                                    value={formData.seatNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>

                            <label className="management-field">
                                <span>{t("adminSeats.type")}</span>
                                <input
                                    name="seatType"
                                    value={formData.seatType}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>

                            <label className="management-field">
                                <span>{t("adminSeats.price")}</span>
                                <input
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>

                            <label className="management-checkbox-field">
                                <input
                                    name="isAvailable"
                                    type="checkbox"
                                    checked={formData.isAvailable}
                                    onChange={handleInputChange}
                                />
                                <span>{t("adminSeats.available")}</span>
                            </label>
                        </div>

                        <div className="management-form-actions">
                            {editingSeatId && (
                                <button
                                    className="management-secondary-button"
                                    type="button"
                                    onClick={cancelEdit}
                                >
                                    {t("adminSeats.cancelEdit")}
                                </button>
                            )}
                            <button
                                className="management-primary-button"
                                type="submit"
                                disabled={saving}
                            >
                                {saving
                                    ? t("common.loading")
                                    : editingSeatId
                                        ? t("adminSeats.updateSeat")
                                        : t("adminSeats.addSeat")}
                            </button>
                        </div>
                    </form>
                )}

                {loading ? (
                    <p className="management-empty-state">{t("common.loading")}</p>
                ) : (
                    <section className="seat-management-grid">
                        {seats.map((seat) => (
                            <article
                                className={`seat-management-card ${
                                    seat.isAvailable ? "is-available" : "is-unavailable"
                                }`}
                                key={seat.id}
                            >
                                <span className="seat-management-card__number">{seat.seatNumber}</span>
                                <span>{t("adminSeats.type")}: {seat.seatType}</span>
                                <span>{t("adminSeats.price")}: {formatPrice(seat.price)}</span>
                                <strong>
                                    {seat.isAvailable
                                        ? t("adminSeats.available")
                                        : t("adminSeats.unavailable")}
                                </strong>
                                <div className="management-actions">
                                    <button
                                        className="management-action-button"
                                        type="button"
                                        onClick={() => startEdit(seat)}
                                    >
                                        {t("adminSeats.edit")}
                                    </button>
                                    <button
                                        className="management-action-button management-action-button--danger"
                                        type="button"
                                        onClick={() => void handleDelete(seat)}
                                    >
                                        {t("adminSeats.delete")}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>
                )}

                {!loading && !error && seats.length === 0 && (
                    <p className="management-empty-state">{t("adminSeats.noSeats")}</p>
                )}
            </main>
        </div>
    );
}
