// Bilet oluşturma sırasında loading ve hata durumunu yönetmek için kullanılır.
import { useState } from "react";

// Sayfalar arası bağlantı, yönlendirme ve URL parametrelerini okumak için kullanılır.
import {
    Link,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

// Sayfadaki metinleri seçilen dile göre göstermek için kullanılır.
import { useTranslation } from "react-i18next";

// Backend'de gerçek bilet oluşturan API fonksiyonudur.
import { createTicket } from "../api/ticketApi";

// Türkçe / İngilizce dil değiştirme bileşenidir.
import LanguageSwitcher from "../components/LanguageSwitcher";

// Sayfanın stil dosyasıdır.
import "./BookingSummaryPage.css";

/*
 * Uçuş, koltuk ve yolcu bilgilerini kullanıcıya gösterir.
 * Kullanıcı onay verdiğinde backend'de gerçek bilet oluşturur.
 */
export default function BookingSummaryPage() {
    // Çeviri dosyalarındaki metinlere erişir.
    const { t } = useTranslation();

    // Başarı sayfasına yönlendirme yapmak için kullanılır.
    const navigate = useNavigate();

    // Önceki sayfadan URL ile gelen bilgileri okumak için kullanılır.
    const [searchParams] = useSearchParams();

    // Uçuş bilgilerini URL parametrelerinden alır.
    const flightId =
        searchParams.get("flightId") ?? "";

    const flightNo =
        searchParams.get("flightNo") ?? "";

    const departure =
        searchParams.get("from") ?? "";

    const destination =
        searchParams.get("to") ?? "";

    const date =
        searchParams.get("date") ?? "";

    // Koltuk bilgilerini URL parametrelerinden alır.
    const seatId =
        searchParams.get("seatId") ?? "";

    const seatNumber =
        searchParams.get("seatNumber") ?? "";

    const seatPrice =
        searchParams.get("seatPrice") ?? "";

    // Yolcu bilgilerini URL parametrelerinden alır.
    const firstName =
        searchParams.get("firstName") ?? "";

    const lastName =
        searchParams.get("lastName") ?? "";

    const email =
        searchParams.get("email") ?? "";

    const phone =
        searchParams.get("phone") ?? "";

    // Ticket oluşturma isteğinin devam edip etmediğini tutar.
    const [loading, setLoading] =
        useState(false);

    // Ticket oluşturma sırasında oluşan hata mesajını tutar.
    const [error, setError] =
        useState("");

    /*
     * Kullanıcı Bileti Onayla dediğinde
     * backend'e gerçek ticket oluşturma isteği gönderir.
     */
    const handleConfirm = async () => {
        // Uçuş veya koltuk ID eksikse işlem yapılmaz.
        if (!flightId || !seatId) {
            setError(
                "Uçuş veya koltuk bilgisi eksik.",
            );
            return;
        }

        try {
            // İstek başlamadan önce loading açılır.
            setLoading(true);

            // Önceki hata mesajı temizlenir.
            setError("");

            /*
             * Backend'e flightId ve seatId gönderilerek
             * gerçek ticket kaydı oluşturulur.
             */
            const ticket =
                await createTicket({
                    flightId:
                        Number(flightId),
                    seatId:
                        Number(seatId),
                });

            /*
             * Ticket başarıyla oluşturulursa
             * backend'den gelen PNR ile success sayfasına geçilir.
             */
            const params =
                new URLSearchParams({
                    flightNo,
                    from: departure,
                    to: destination,
                    date,
                    seatNumber,
                    seatPrice,
                    firstName,
                    lastName,
                    email,
                    phone,

                    // Backend'in oluşturduğu gerçek PNR kodunu taşır.
                    pnrKodu:
                    ticket.pnrKodu,
                });

            // Kullanıcıyı başarı sayfasına yönlendirir.
            navigate(
                `/booking-success?${params.toString()}`,
            );
        } catch (error) {
            // Gerçek backend hatasını geliştirici konsolunda gösterir.
            console.error(
                "Bilet oluşturulurken hata:",
                error,
            );

            // Kullanıcıya hata mesajı gösterir.
            setError(
                "Bilet oluşturulurken bir hata oluştu.",
            );
        } finally {
            // İşlem tamamlandığında loading kapatılır.
            setLoading(false);
        }
    };

    return (
        <main className="booking-summary-page">
            {/* Sayfanın üst menüsüdür. */}
            <header className="booking-summary-header">
                <Link
                    to="/"
                    className="booking-summary-logo"
                >
                    ✈ SkyRoute
                </Link>

                <div className="booking-summary-actions">
                    <LanguageSwitcher />

                    {/* Kullanıcıyı ana sayfaya götürür. */}
                    <Link
                        to="/"
                        className="booking-summary-home-button"
                    >
                        {t(
                            "bookingSummary.home",
                        )}
                    </Link>
                </div>
            </header>

            <section className="booking-summary-container">

                {/* Sayfanın başlık ve açıklama alanıdır. */}
                <div className="booking-summary-heading">
                    <p className="booking-summary-eyebrow">
                        {t(
                            "bookingSummary.eyebrow",
                        )}
                    </p>

                    <h1>
                        {t(
                            "bookingSummary.title",
                        )}
                    </h1>

                    <p>
                        {t(
                            "bookingSummary.description",
                        )}
                    </p>
                </div>

                {/* Uçuş ve yolcu bilgilerini iki kart halinde gösterir. */}
                <div className="booking-summary-grid">

                    {/* Uçuş bilgilerinin bulunduğu karttır. */}
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

                        {/* Koltuk fiyatını gösterir. */}
                        {seatPrice && (
                            <div className="booking-summary-row">
                                <span>
                                    Fiyat
                                </span>

                                <strong>
                                    {seatPrice} TL
                                </strong>
                            </div>
                        )}
                    </section>

                    {/* Yolcu bilgilerinin bulunduğu karttır. */}
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

                {/* Kullanıcının bileti onayladığı alandır. */}
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

                    {/* Backend hatası oluşursa kullanıcıya gösterir. */}
                    {error && (
                        <p
                            className="booking-summary-error"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

                    {/* Onay verildiğinde gerçek Ticket API isteğini başlatır. */}
                    <button
                        type="button"
                        className="booking-confirm-button"
                        onClick={handleConfirm}

                        // İstek devam ederken tekrar tıklanmasını engeller.
                        disabled={loading}
                    >
                        {loading
                            ? "Bilet oluşturuluyor..."
                            : t(
                                "bookingSummary.confirmButton",
                            )}
                    </button>
                </section>
            </section>
        </main>
    );
}