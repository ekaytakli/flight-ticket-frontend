// Tekrar ödeme ve ana sayfa bağlantıları için kullanılır.
import { Link, useSearchParams } from "react-router-dom";

// Ekrandaki metinleri aktif dile göre getirir.
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../components/LanguageSwitcher";
import "./PaymentStatusPage.css";

/* Ödeme başarısız olduğunda hata bilgisini ve tekrar denemeyi gösterir. */
export default function PaymentFailedPage() {
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const message = searchParams.get("message") ?? "";
    const messageKey = searchParams.get("messageKey") ?? "";
    const retryParams = searchParams.get("retryParams") ?? "";

    // Frontend hata anahtarı varsa aktif dile göre çevirir.
    const visibleMessage = messageKey
        ? t(messageKey)
        : message || t("paymentFailed.defaultMessage");

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
                        className="payment-status-icon payment-status-icon--failed"
                        aria-hidden="true"
                    >
                        !
                    </div>

                    <p className="payment-status-eyebrow">
                        {t("paymentFailed.eyebrow")}
                    </p>

                    <h1>{t("paymentFailed.title")}</h1>

                    <p
                        className="payment-status-description"
                        role="alert"
                    >
                        {visibleMessage}
                    </p>

                    <div className="payment-status-actions">
                        <Link
                            to={
                                retryParams
                                    ? `/payment?${retryParams}`
                                    : "/"
                            }
                            className="payment-status-primary"
                        >
                            {t("paymentFailed.retry")}
                        </Link>

                        <Link to="/" className="payment-status-secondary">
                            {t("paymentFailed.home")}
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
