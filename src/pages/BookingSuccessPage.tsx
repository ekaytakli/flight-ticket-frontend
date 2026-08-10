import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../components/LanguageSwitcher";
import "./BookingSuccessPage.css";

export default function BookingSuccessPage() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();

    const flightNo = searchParams.get("flightNo") ?? "";
    const departure = searchParams.get("from") ?? "";
    const destination = searchParams.get("to") ?? "";
    const date = searchParams.get("date") ?? "";
    const seatNumber = searchParams.get("seatNumber") ?? "";

    const firstName = searchParams.get("firstName") ?? "";
    const lastName = searchParams.get("lastName") ?? "";

    return (
        <main className="booking-success-page">
            <header className="booking-success-header">
                <Link
                    to="/"
                    className="booking-success-logo"
                >
                    ✈ SkyRoute
                </Link>

                <div className="booking-success-actions">
                    <LanguageSwitcher />

                    <Link
                        to="/"
                        className="booking-success-home-button"
                    >
                        {t("bookingSuccess.home")}
                    </Link>
                </div>
            </header>

            <section className="booking-success-container">
                <div className="booking-success-card">
                    <div
                        className="booking-success-icon"
                        aria-hidden="true"
                    >
                        ✓
                    </div>

                    <p className="booking-success-eyebrow">
                        {t("bookingSuccess.eyebrow")}
                    </p>

                    <h1>
                        {t("bookingSuccess.title")}
                    </h1>

                    <p className="booking-success-description">
                        {t("bookingSuccess.description")}
                    </p>

                    <div className="booking-success-details">
                        <div>
                            <span>
                                {t("bookingSuccess.passenger")}
                            </span>
                            <strong>
                                {firstName} {lastName}
                            </strong>
                        </div>

                        <div>
                            <span>
                                {t("bookingSuccess.flight")}
                            </span>
                            <strong>
                                {flightNo || "-"}
                            </strong>
                        </div>

                        <div>
                            <span>
                                {t("bookingSuccess.route")}
                            </span>
                            <strong>
                                {departure || "-"} →{" "}
                                {destination || "-"}
                            </strong>
                        </div>

                        <div>
                            <span>
                                {t("bookingSuccess.date")}
                            </span>
                            <strong>
                                {date || "-"}
                            </strong>
                        </div>

                        <div>
                            <span>
                                {t("bookingSuccess.seat")}
                            </span>
                            <strong>
                                {seatNumber || "-"}
                            </strong>
                        </div>
                    </div>

                    <div className="booking-success-buttons">
                        <Link
                            to="/"
                            className="booking-success-primary"
                        >
                            {t("bookingSuccess.newSearch")}
                        </Link>

                        <Link
                            to="/login"
                            className="booking-success-secondary"
                        >
                            {t("bookingSuccess.login")}
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}