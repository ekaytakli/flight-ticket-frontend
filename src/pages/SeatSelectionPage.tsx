import { useMemo, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../components/LanguageSwitcher";
import type { Seat } from "../types/seat";
import "./SeatSelectionPage.css";

export default function SeatSelectionPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { flightId } = useParams();
    const [searchParams] = useSearchParams();

    const departure = searchParams.get("from") ?? "";
    const destination = searchParams.get("to") ?? "";
    const date = searchParams.get("date") ?? "";
    const flightNo = searchParams.get("flightNo") ?? "";

    const [selectedSeatId, setSelectedSeatId] = useState<number | null>(
        null,
    );

    /*
     * Şimdilik arayüzü test etmek için örnek koltuklar.
     * Backend Seat endpointi hazır olduğunda bu alan API verisiyle değişecek.
     */
    const seats: Seat[] = useMemo(
        () => [
            {
                id: 1,
                seatNumber: "1A",
                seatType: "Window",
                isAvailable: true,
            },
            {
                id: 2,
                seatNumber: "1B",
                seatType: "Middle",
                isAvailable: false,
            },
            {
                id: 3,
                seatNumber: "1C",
                seatType: "Aisle",
                isAvailable: true,
            },
            {
                id: 4,
                seatNumber: "1D",
                seatType: "Aisle",
                isAvailable: true,
            },
            {
                id: 5,
                seatNumber: "1E",
                seatType: "Middle",
                isAvailable: false,
            },
            {
                id: 6,
                seatNumber: "1F",
                seatType: "Window",
                isAvailable: true,
            },
            {
                id: 7,
                seatNumber: "2A",
                seatType: "Window",
                isAvailable: true,
            },
            {
                id: 8,
                seatNumber: "2B",
                seatType: "Middle",
                isAvailable: true,
            },
            {
                id: 9,
                seatNumber: "2C",
                seatType: "Aisle",
                isAvailable: false,
            },
            {
                id: 10,
                seatNumber: "2D",
                seatType: "Aisle",
                isAvailable: true,
            },
            {
                id: 11,
                seatNumber: "2E",
                seatType: "Middle",
                isAvailable: true,
            },
            {
                id: 12,
                seatNumber: "2F",
                seatType: "Window",
                isAvailable: true,
            },
        ],
        [],
    );

    const selectedSeat = seats.find(
        (seat) => seat.id === selectedSeatId,
    );

    const handleSeatClick = (seat: Seat) => {
        if (!seat.isAvailable) {
            return;
        }

        setSelectedSeatId(seat.id);
    };

    const handleContinue = () => {
        if (!selectedSeat) {
            return;
        }

        const params = new URLSearchParams({
            flightId: flightId ?? "",
            flightNo,
            from: departure,
            to: destination,
            date,
            seatId: String(selectedSeat.id),
            seatNumber: selectedSeat.seatNumber,
        });

        navigate(`/passenger-info?${params.toString()}`);
    };

    return (
        <main className="seat-selection-page">
            <header className="seat-selection-header">
                <Link to="/" className="seat-selection-logo">
                    ✈ SkyRoute
                </Link>

                <div className="seat-selection-actions">
                    <LanguageSwitcher />

                    <Link
                        to="/"
                        className="seat-selection-home-button"
                    >
                        {t("seatSelection.home")}
                    </Link>
                </div>
            </header>

            <section className="seat-selection-container">
                <div className="seat-selection-heading">
                    <p className="seat-selection-eyebrow">
                        {t("seatSelection.eyebrow")}
                    </p>

                    <h1>
                        {t("seatSelection.title")}
                    </h1>

                    <p>
                        {t("seatSelection.description")}
                    </p>
                </div>

                <section className="seat-flight-summary">
                    <div>
                        <span>
                            {t("seatSelection.flight")}
                        </span>

                        <strong>
                            {flightNo || `#${flightId ?? "-"}`}
                        </strong>
                    </div>

                    <div>
                        <span>
                            {t("seatSelection.route")}
                        </span>

                        <strong>
                            {departure || "-"} →{" "}
                            {destination || "-"}
                        </strong>
                    </div>

                    <div>
                        <span>
                            {t("seatSelection.date")}
                        </span>

                        <strong>
                            {date || "-"}
                        </strong>
                    </div>
                </section>

                <section className="seat-selection-content">
                    <div className="seat-map-card">
                        <div className="seat-map-header">
                            <h2>
                                {t("seatSelection.chooseSeat")}
                            </h2>

                            <div className="seat-legend">
                                <div>
                                    <span className="seat-legend-box seat-available" />
                                    {t("seatSelection.available")}
                                </div>

                                <div>
                                    <span className="seat-legend-box seat-selected" />
                                    {t("seatSelection.selected")}
                                </div>

                                <div>
                                    <span className="seat-legend-box seat-unavailable" />
                                    {t("seatSelection.unavailable")}
                                </div>
                            </div>
                        </div>

                        <div className="aircraft-front">
                            ✈
                        </div>

                        <div className="seat-map">

                            {seats.map((seat, index) => {
                                const isSelected =
                                    selectedSeatId === seat.id;

                                const columnPosition = index % 6;

                                return (
                                    <div
                                        className={
                                            columnPosition === 3
                                                ? "seat-with-aisle"
                                                : undefined
                                        }
                                        key={seat.id}
                                    >
                                        <button
                                            type="button"
                                            className={[
                                                "seat-button",
                                                !seat.isAvailable
                                                    ? "seat-button--unavailable"
                                                    : "",
                                                isSelected
                                                    ? "seat-button--selected"
                                                    : "",
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                            disabled={!seat.isAvailable}
                                            onClick={() =>
                                                handleSeatClick(seat)
                                            }
                                            aria-pressed={isSelected}
                                        >
                                            {seat.seatNumber}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <aside className="seat-selection-summary">
                        <h2>
                            {t("seatSelection.summaryTitle")}
                        </h2>

                        {selectedSeat ? (
                            <>
                                <div className="selected-seat-box">
                                    <span>
                                        {t(
                                            "seatSelection.selectedSeat",
                                        )}
                                    </span>

                                    <strong>
                                        {selectedSeat.seatNumber}
                                    </strong>
                                </div>

                                <p>
                                    {t("seatSelection.seatType")}:{" "}
                                    <strong>
                                        {selectedSeat.seatType}
                                    </strong>
                                </p>

                                <button
                                    type="button"
                                    className="seat-continue-button"
                                    onClick={handleContinue}
                                >
                                    {t("seatSelection.continue")}
                                </button>
                            </>
                        ) : (
                            <p className="seat-selection-empty">
                                {t(
                                    "seatSelection.noSeatSelected",
                                )}
                            </p>
                        )}
                    </aside>
                </section>
            </section>
        </main>
    );
}