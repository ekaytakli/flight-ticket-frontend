// Sayfalar arası bağlantı kurmak ve URL parametrelerini okumak için kullanılır.
import { Link, useSearchParams } from "react-router-dom";

// Sayfadaki metinleri seçilen dile göre göstermek için kullanılır.
import { useTranslation } from "react-i18next";

// Türkçe / İngilizce dil değiştirme bileşenidir.
import LanguageSwitcher from "../components/LanguageSwitcher";

// Başarı sayfasının stil dosyasıdır.
import "./BookingSuccessPage.css";

/*
 * Bilet onayından sonra gösterilen başarı sayfasıdır.
 * Uçuş ve yolcu bilgilerini özet halinde gösterir.
 */
export default function BookingSuccessPage() {
    // Çeviri dosyalarındaki metinlere erişir.
    const { t } = useTranslation();

    // Önceki sayfadan URL ile gelen bilgileri okumak için kullanılır.
    const [searchParams] = useSearchParams();

    // Uçuş bilgilerini URL parametrelerinden alır.
    const flightNo = searchParams.get("flightNo") ?? "";
    const departure = searchParams.get("from") ?? "";
    const destination = searchParams.get("to") ?? "";
    const date = searchParams.get("date") ?? "";
    const seatNumber = searchParams.get("seatNumber") ?? "";

    // Yolcunun ad ve soyad bilgisini URL'den alır.
    const firstName = searchParams.get("firstName") ?? "";
    const lastName = searchParams.get("lastName") ?? "";

    return (
        <main className="booking-success-page">

            {/* Sayfanın üst menüsüdür. */}
            <header className="booking-success-header">

                {/* Logoya basıldığında ana sayfaya döner. */}
                <Link
                    to="/"
                    className="booking-success-logo"
                >
                    ✈ SkyRoute
                </Link>

                <div className="booking-success-actions">
                    {/* Dil değiştirme butonlarını gösterir. */}
                    <LanguageSwitcher />

                    {/* Kullanıcıyı ana sayfaya yönlendirir. */}
                    <Link
                        to="/"
                        className="booking-success-home-button"
                    >
                        {t("bookingSuccess.home")}
                    </Link>
                </div>
            </header>

            <section className="booking-success-container">

                {/* Başarı mesajı ve rezervasyon bilgilerini içeren ana karttır. */}
                <div className="booking-success-card">

                    {/* İşlemin başarılı olduğunu gösteren ikon. */}
                    <div
                        className="booking-success-icon"
                        aria-hidden="true"
                    >
                        ✓
                    </div>

                    {/* Küçük üst başlığı gösterir. */}
                    <p className="booking-success-eyebrow">
                        {t("bookingSuccess.eyebrow")}
                    </p>

                    {/* Başarı mesajının ana başlığını gösterir. */}
                    <h1>
                        {t("bookingSuccess.title")}
                    </h1>

                    {/* İşlemin tamamlandığını açıklayan metni gösterir. */}
                    <p className="booking-success-description">
                        {t("bookingSuccess.description")}
                    </p>

                    {/* Rezervasyonun özet bilgilerini gösterir. */}
                    <div className="booking-success-details">

                        {/* Yolcu ad ve soyadını gösterir. */}
                        <div>
                            <span>
                                {t("bookingSuccess.passenger")}
                            </span>

                            <strong>
                                {firstName} {lastName}
                            </strong>
                        </div>

                        {/* Uçuş numarasını gösterir. */}
                        <div>
                            <span>
                                {t("bookingSuccess.flight")}
                            </span>

                            <strong>
                                {flightNo || "-"}
                            </strong>
                        </div>

                        {/* Kalkış ve varış rotasını gösterir. */}
                        <div>
                            <span>
                                {t("bookingSuccess.route")}
                            </span>

                            <strong>
                                {departure || "-"} →{" "}
                                {destination || "-"}
                            </strong>
                        </div>

                        {/* Uçuş tarihini gösterir. */}
                        <div>
                            <span>
                                {t("bookingSuccess.date")}
                            </span>

                            <strong>
                                {date || "-"}
                            </strong>
                        </div>

                        {/* Seçilen koltuk numarasını gösterir. */}
                        <div>
                            <span>
                                {t("bookingSuccess.seat")}
                            </span>

                            <strong>
                                {seatNumber || "-"}
                            </strong>
                        </div>
                    </div>

                    {/* Kullanıcıya sonraki işlemler için bağlantılar sunar. */}
                    <div className="booking-success-buttons">

                        {/* Yeni bir uçuş aramak için ana sayfaya döner. */}
                        <Link
                            to="/"
                            className="booking-success-primary"
                        >
                            {t("bookingSuccess.newSearch")}
                        </Link>

                        {/* Kullanıcı isterse login sayfasına geçebilir. */}
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