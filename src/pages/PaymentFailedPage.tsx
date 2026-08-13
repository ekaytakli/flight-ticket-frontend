// Kullanıcıyı tekrar ödeme veya ana sayfaya yönlendirmek için kullanılır.
import { Link, useSearchParams } from "react-router-dom";

// Dil değiştirme bileşenidir.
import LanguageSwitcher from "../components/LanguageSwitcher";

// Başarısız ödeme ekranının stil dosyasıdır.
import "./PaymentStatusPage.css";

/*
 * Ödeme başarısız olduğunda kullanıcıya
 * hata bilgisini ve tekrar deneme seçeneğini gösterir.
 */
export default function PaymentFailedPage() {
    // Önceki ödeme denemesinden gelen bilgileri okur.
    const [searchParams] = useSearchParams();

    const message =
        searchParams.get("message") ??
        "Ödeme işlemi tamamlanamadı.";

    const retryParams =
        searchParams.get("retryParams") ?? "";

    return (
        <main className="payment-status-page">
            {/* Sayfanın üst menüsüdür. */}
            <header className="payment-status-header">
                <Link
                    to="/"
                    className="payment-status-logo"
                >
                    ✈ SkyRoute
                </Link>

                <LanguageSwitcher />
            </header>

            <section className="payment-status-container">
                <div className="payment-status-card">

                    {/* Başarısız ödeme ikonudur. */}
                    <div
                        className="payment-status-icon payment-status-icon--failed"
                        aria-hidden="true"
                    >
                        !
                    </div>

                    <p className="payment-status-eyebrow">
                        Ödeme Başarısız
                    </p>

                    <h1>
                        Ödeme İşlemi Tamamlanamadı
                    </h1>

                    {/* Backend'den gelen hata mesajını gösterir. */}
                    <p
                        className="payment-status-description"
                        role="alert"
                    >
                        {message}
                    </p>

                    <div className="payment-status-actions">
                        {/* Önceki ödeme bilgileri varsa tekrar ödeme sayfasına döner. */}
                        <Link
                            to={
                                retryParams
                                    ? `/payment?${retryParams}`
                                    : "/"
                            }
                            className="payment-status-primary"
                        >
                            Tekrar Dene
                        </Link>

                        {/* Kullanıcıyı ana sayfaya götürür. */}
                        <Link
                            to="/"
                            className="payment-status-secondary"
                        >
                            Ana Sayfaya Dön
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}