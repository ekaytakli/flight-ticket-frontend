// Ana sayfa bağlantısı ve URL bilgileri için kullanılır.
import { Link, useSearchParams } from "react-router-dom";

// Ekrandaki metinleri aktif dile göre getirir.
import { useTranslation } from "react-i18next";

// Dil değiştirme bileşenidir.
import LanguageSwitcher from "../components/LanguageSwitcher";

import "./PaymentStatusPage.css";

/* Ödeme başarılı olduğunda bilet ve PNR bilgisini gösterir. */
export default function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const paymentId = searchParams.get("paymentId") ?? "";
    const pnrKodu = searchParams.get("pnrKodu") ?? "";
    const flightNo = searchParams.get("flightNo") ?? "";
    const seatNumber = searchParams.get("seatNumber") ?? "";
    const amount = searchParams.get("amount") ?? "";

    return (
        <main className="payment-status-page">
            <header className="payment-status-header">
                <Link to="/" className="payment-status-logo">
                    ✈ SkyRoute
                </Link>

                <LanguageSwitcher />
            </header>

            <section className="payment-status-container">
                <div className="payment-status-card">
                    <div
                        className="payment-status-icon payment-status-icon--success"
                        aria-hidden="true"
                    >
                        ✓
                    </div>

                    <p className="payment-status-eyebrow">
                        {t("paymentSuccess.eyebrow")}
                    </p>

                    <h1>{t("paymentSuccess.title")}</h1>

                    <p className="payment-status-description">
                        {t("paymentSuccess.description")}
                    </p>

                    {/* Backend'den gelen ödeme ve bilet bilgilerini gösterir. */}
                    <div className="payment-status-details">
                        <div>
                            <span>{t("paymentSuccess.flight")}</span>
                            <strong>{flightNo || "-"}</strong>
                        </div>

                        <div>
                            <span>{t("paymentSuccess.seat")}</span>
                            <strong>{seatNumber || "-"}</strong>
                        </div>

                        <div>
                            <span>{t("paymentSuccess.total")}</span>
                            <strong>
                                {amount ? `${amount} TL` : "-"}
                            </strong>
                        </div>

                        <div>
                            <span>{t("paymentSuccess.pnr")}</span>
                            <strong>{pnrKodu || "-"}</strong>
                        </div>

                        <div>
                            <span>{t("paymentSuccess.paymentId")}</span>
                            <strong>{paymentId || "-"}</strong>
                        </div>
                    </div>

                    <div className="payment-status-actions">
                        <Link to="/" className="payment-status-primary">
                            {t("paymentSuccess.newSearch")}
                        </Link>

                        <Link
                            to="/login"
                            className="payment-status-secondary"
                        >
                            {t("paymentSuccess.login")}
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
