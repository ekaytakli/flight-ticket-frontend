import {
    Link,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../components/LanguageSwitcher";
import "./BookingSummaryPage.css";

export default function BookingSummaryPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const flightNo = searchParams.get("flightNo") ?? "";
    const departure = searchParams.get("from") ?? "";
    const destination = searchParams.get("to") ?? "";
    const date = searchParams.get("date") ?? "";
    const seatNumber = searchParams.get("seatNumber") ?? "";

    const firstName = searchParams.get("firstName") ?? "";
    const lastName = searchParams.get("lastName") ?? "";
    const email = searchParams.get("email") ?? "";
    const phone = searchParams.get("phone") ?? "";

    /*
     * Şimdilik frontend demo akışında rezervasyonu
     * başarı sayfasına yönlendirerek tamamlar.
     *
     * Backend ticket servisi hazır olduğunda burada önce
     * ticket API isteği gönderilecek, başarılı olursa
     * success sayfasına yönlendirilecektir.
     */
    const handleConfirm = () => {
        const params = new URLSearchParams({
            flightNo,
            from: departure,
            to: destination,
            date,
            seatNumber,
            firstName,
            lastName,
            email,
            phone,
        });

        navigate(
            `/booking-success?${params.toString()}`,
        );
    };

    return (
        <main className="booking-summary-page">
            <header className="booking-summary-header">
                <Link
                    to="/"
                    className="booking-summary-logo"
                >
                    ✈ SkyRoute
                </Link>

                <div className="booking-summary-actions">
                    <LanguageSwitcher />

                    <Link
                        to="/"
                        className="booking-summary-home-button"
                    >
                        {t("bookingSummary.home")}
                    </Link>
                </div>
            </header>

            <section className="booking-summary-container">
                <div className="booking-summary-heading">
                    <p className="booking-summary-eyebrow">
                        {t("bookingSummary.eyebrow")}
                    </p>

                    <h1>
                        {t("bookingSummary.title")}
                    </h1>

                    <p>
                        {t("bookingSummary.description")}
                    </p>
                </div>

                <div className="booking-summary-grid">
                    <section className="booking-summary-card">
                        <h2>
                            {t(
                                "bookingSummary.flightTitle",
                            )}
                        </h2>

                        <div className="booking-summary-row">
                            <span>
                                {t(
                                    "bookingSummary.flight",
                                )}
                            </span>

                            <strong>
                                {flightNo || "-"}
                            </strong>
                        </div>

                        <div className="booking-summary-row">
                            <span>
                                {t(
                                    "bookingSummary.route",
                                )}
                            </span>

                            <strong>
                                {departure || "-"} →{" "}
                                {destination || "-"}
                            </strong>
                        </div>

                        <div className="booking-summary-row">
                            <span>
                                {t(
                                    "bookingSummary.date",
                                )}
                            </span>

                            <strong>
                                {date || "-"}
                            </strong>
                        </div>

                        <div className="booking-summary-row">
                            <span>
                                {t(
                                    "bookingSummary.seat",
                                )}
                            </span>

                            <strong>
                                {seatNumber || "-"}
                            </strong>
                        </div>
                    </section>

                    <section className="booking-summary-card">
                        <h2>
                            {t(
                                "bookingSummary.passengerTitle",
                            )}
                        </h2>

                        <div className="booking-summary-row">
                            <span>
                                {t(
                                    "bookingSummary.name",
                                )}
                            </span>

                            <strong>
                                {firstName} {lastName}
                            </strong>
                        </div>

                        <div className="booking-summary-row">
                            <span>
                                {t(
                                    "bookingSummary.email",
                                )}
                            </span>

                            <strong>
                                {email || "-"}
                            </strong>
                        </div>

                        <div className="booking-summary-row">
                            <span>
                                {t(
                                    "bookingSummary.phone",
                                )}
                            </span>

                            <strong>
                                {phone || "-"}
                            </strong>
                        </div>
                    </section>
                </div>

                <section className="booking-summary-confirmation">
                    <h2>
                        {t(
                            "bookingSummary.confirmTitle",
                        )}
                    </h2>

                    <p>
                        {t(
                            "bookingSummary.confirmDescription",
                        )}
                    </p>

                    <button
                        type="button"
                        className="booking-confirm-button"
                        onClick={handleConfirm}
                    >
                        {t(
                            "bookingSummary.confirmButton",
                        )}
                    </button>
                </section>
            </section>
        </main>
    );
}