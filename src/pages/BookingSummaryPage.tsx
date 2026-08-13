// Sayfalar arası bağlantı, yönlendirme ve URL parametrelerini okumak için kullanılır.
import {
    Link,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

// Sayfadaki metinleri seçilen dile göre göstermek için kullanılır.
import { useTranslation } from "react-i18next";

// Türkçe / İngilizce dil değiştirme bileşenidir.
import LanguageSwitcher from "../components/LanguageSwitcher";

// Rezervasyon özeti sayfasının stil dosyasıdır.
import "./BookingSummaryPage.css";

/*
 * Uçuş, koltuk ve yolcu bilgilerini kullanıcıya
 * son kez kontrol etmesi için gösterir.
 *
 * Kullanıcı devam ettiğinde ödeme sayfasına yönlendirir.
 */
export default function BookingSummaryPage() {
    // Çeviri dosyalarındaki metinlere erişir.
    const { t } = useTranslation();

    // PaymentPage'e yönlendirme yapmak için kullanılır.
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

    /*
     * Kullanıcı "Ödemeye Geç" dediğinde
     * mevcut rezervasyon bilgilerini PaymentPage'e taşır.
     */
    const handlePayment = () => {
        // Uçuş veya koltuk bilgisi eksikse işlem yapılmaz.
        if (!flightId || !seatId) {
            return;
        }

        /*
         * Uçuş, koltuk ve yolcu bilgilerini
         * ödeme sayfasına aktarılacak URL parametrelerine dönüştürür.
         */
        const params = new URLSearchParams({
            flightId,
            flightNo,
            from: departure,
            to: destination,
            date,
            seatId,
            seatNumber,
            seatPrice,
            firstName,
            lastName,
            email,
            phone,
        });

        // Kullanıcıyı ödeme sayfasına yönlendirir.
        navigate(
            `/payment?${params.toString()}`,
        );
    };

    return (
        <main className="booking-summary-page">

            {/* Sayfanın üst menüsüdür. */}
            <header className="booking-summary-header">

                {/* Logoya basıldığında ana sayfaya döner. */}
                <Link
                    to="/"
                    className="booking-summary-logo"
                >
                    ✈ SkyRoute
                </Link>

                <div className="booking-summary-actions">

                    {/* Dil değiştirme butonlarını gösterir. */}
                    <LanguageSwitcher />

                    {/* Kullanıcıyı ana sayfaya yönlendirir. */}
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

                {/* Uçuş ve yolcu bilgilerini iki ayrı kartta gösterir. */}
                <div className="booking-summary-grid">

                    {/* Uçuş bilgilerinin bulunduğu karttır. */}
                    <section className="booking-summary-card">
                        <h2>
                            {t(
                                "bookingSummary.flightTitle",
                            )}
                        </h2>

                        {/* Uçuş numarasını gösterir. */}
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

                        {/* Uçuş rotasını gösterir. */}
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

                        {/* Uçuş tarihini gösterir. */}
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

                        {/* Seçilen koltuğu gösterir. */}
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

                        {/* Koltuğun backend'den gelen fiyatını gösterir. */}
                        <div className="booking-summary-row">
                            <span>
                                Fiyat
                            </span>

                            <strong>
                                {seatPrice
                                    ? `${seatPrice} TL`
                                    : "-"}
                            </strong>
                        </div>
                    </section>

                    {/* Yolcu bilgilerinin bulunduğu karttır. */}
                    <section className="booking-summary-card">
                        <h2>
                            {t(
                                "bookingSummary.passengerTitle",
                            )}
                        </h2>

                        {/* Yolcunun ad ve soyadını gösterir. */}
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

                        {/* Yolcunun e-posta adresini gösterir. */}
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

                        {/* Yolcunun telefon numarasını gösterir. */}
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

                {/* Kullanıcının ödeme aşamasına geçtiği bölümdür. */}
                <section className="booking-summary-confirmation">
                    <h2>
                        Rezervasyonu Tamamla
                    </h2>

                    <p>
                        Rezervasyon bilgilerinizi kontrol ettikten
                        sonra ödeme aşamasına geçebilirsiniz.
                    </p>

                    {/* Kullanıcıyı PaymentPage'e yönlendirir. */}
                    <button
                        type="button"
                        className="booking-confirm-button"
                        onClick={handlePayment}
                    >
                        Ödemeye Geç
                    </button>
                </section>
            </section>
        </main>
    );
}