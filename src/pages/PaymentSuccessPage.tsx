// Ana sayfaya ve yeni uçuş aramasına bağlantı vermek için kullanılır.
import { Link, useSearchParams } from "react-router-dom";

// Dil değiştirme bileşenidir.
import LanguageSwitcher from "../components/LanguageSwitcher";

// Başarılı ödeme ekranının stil dosyasıdır.
import "./PaymentStatusPage.css";

/*
 * Ödeme başarılı olduğunda kullanıcıya
 * işlem sonucunu ve rezervasyon bilgilerini gösterir.
 */
export default function PaymentSuccessPage() {
    // Önceki sayfadan gelen ödeme ve rezervasyon bilgilerini okur.
    const [searchParams] = useSearchParams();

    const paymentId = searchParams.get("paymentId") ?? "";
    const pnrKodu = searchParams.get("pnrKodu") ?? "";
    const flightNo = searchParams.get("flightNo") ?? "";
    const seatNumber = searchParams.get("seatNumber") ?? "";
    const amount = searchParams.get("amount") ?? "";

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

                    {/* Başarılı ödeme ikonudur. */}
                    <div
                        className="payment-status-icon payment-status-icon--success"
                        aria-hidden="true"
                    >
                        ✓
                    </div>

                    <p className="payment-status-eyebrow">
                        Ödeme Başarılı
                    </p>

                    <h1>
                        Biletiniz Başarıyla Oluşturuldu
                    </h1>

                    <p className="payment-status-description">
                        Ödeme işleminiz tamamlandı ve
                        rezervasyonunuz başarıyla oluşturuldu.
                    </p>

                    {/* Ödeme ve bilet bilgilerini gösterir. */}
                    <div className="payment-status-details">
                        <div>
                            <span>Uçuş</span>
                            <strong>{flightNo || "-"}</strong>
                        </div>

                        <div>
                            <span>Koltuk</span>
                            <strong>{seatNumber || "-"}</strong>
                        </div>

                        <div>
                            <span>Toplam Tutar</span>
                            <strong>
                                {amount ? `${amount} TL` : "-"}
                            </strong>
                        </div>

                        <div>
                            <span>PNR</span>
                            <strong>{pnrKodu || "-"}</strong>
                        </div>

                        <div>
                            <span>Ödeme ID</span>
                            <strong>{paymentId || "-"}</strong>
                        </div>
                    </div>

                    {/* Kullanıcının yeni işlem başlatabileceği butonları gösterir. */}
                    <div className="payment-status-actions">
                        <Link
                            to="/"
                            className="payment-status-primary"
                        >
                            Yeni Uçuş Ara
                        </Link>

                        <Link
                            to="/login"
                            className="payment-status-secondary"
                        >
                            Giriş Yap
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}