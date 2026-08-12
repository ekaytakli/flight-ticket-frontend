// Form bilgilerini state'te tutmak ve form event tipini kullanmak için alınır.
import { useState, type FormEvent } from "react";

// URL bilgilerini okumak ve sayfalar arasında yönlendirme yapmak için kullanılır.
import {
    Link,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

// Sayfadaki metinleri seçilen dile göre göstermek için kullanılır.
import { useTranslation } from "react-i18next";

// Türkçe / İngilizce dil değiştirme bileşenidir.
import LanguageSwitcher from "../components/LanguageSwitcher";

// Yolcu bilgileri sayfasının stil dosyasıdır.
import "./PassengerInfoPage.css";

/*
 * Seçilen uçuş için yolcu bilgilerinin girildiği sayfadır.
 * Bilgileri kontrol edip bilet özeti sayfasına aktarır.
 */
export default function PassengerInfoPage() {
    // Çeviri dosyalarındaki metinlere erişir.
    const { t } = useTranslation();

    // Sonraki sayfaya yönlendirme yapmak için kullanılır.
    const navigate = useNavigate();

    // Önceki sayfadan URL ile gelen bilgileri okumak için kullanılır.
    const [searchParams] = useSearchParams();

    // Önceki sayfadan gelen uçuş ve koltuk bilgilerini alır.
    const flightId = searchParams.get("flightId") ?? "";
    const flightNo = searchParams.get("flightNo") ?? "";
    const departure = searchParams.get("from") ?? "";
    const destination = searchParams.get("to") ?? "";
    const date = searchParams.get("date") ?? "";
    const seatId = searchParams.get("seatId") ?? "";
    const seatNumber = searchParams.get("seatNumber") ?? "";

    // Seçilen koltuğun fiyat bilgisini önceki sayfadan alır.
    const seatPrice = searchParams.get("seatPrice") ?? "";

    // Kullanıcının forma girdiği yolcu bilgilerini state'te tutar.
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    // Formda oluşabilecek hata mesajını tutar.
    const [error, setError] = useState("");

    /*
     * Form gönderildiğinde yolcu bilgilerini kontrol eder
     * ve bilet özeti sayfasına geçiş yapar.
     */
    const handleSubmit = (
        event: FormEvent<HTMLFormElement>,
    ) => {
        // Form gönderildiğinde sayfanın yenilenmesini engeller.
        event.preventDefault();

        // Önceki hata mesajını temizler.
        setError("");

        // Yolcu bilgilerinden biri boşsa işlemi durdurur.
        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !email.trim() ||
            !phone.trim()
        ) {
            setError(
                t("passengerInfo.errors.required"),
            );
            return;
        }

        /*
         * Uçuş, koltuk, fiyat ve yolcu bilgilerini
         * URL query parametreleri halinde birleştirir.
         */
        const params = new URLSearchParams({
            flightId,
            flightNo,
            from: departure,
            to: destination,
            date,
            seatId,
            seatNumber,

            // Koltuk fiyatını BookingSummaryPage'e taşır.
            seatPrice,

            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
        });

        // Tüm bilgileri taşıyarak BookingSummaryPage'e yönlendirir.
        navigate(
            `/booking-summary?${params.toString()}`,
        );
    };

    return (
        <main className="passenger-page">

            {/* Sayfanın üst menüsüdür. */}
            <header className="passenger-header">

                {/* Logoya basıldığında ana sayfaya döner. */}
                <Link
                    to="/"
                    className="passenger-logo"
                >
                    ✈ SkyRoute
                </Link>

                <div className="passenger-header-actions">

                    {/* Dil değiştirme butonlarını gösterir. */}
                    <LanguageSwitcher />

                    {/* Kullanıcıyı ana sayfaya yönlendirir. */}
                    <Link
                        to="/"
                        className="passenger-home-button"
                    >
                        {t("passengerInfo.home")}
                    </Link>
                </div>
            </header>

            <section className="passenger-container">

                {/* Sayfanın başlık ve açıklama alanıdır. */}
                <div className="passenger-heading">
                    <p className="passenger-eyebrow">
                        {t("passengerInfo.eyebrow")}
                    </p>

                    <h1>
                        {t("passengerInfo.title")}
                    </h1>

                    <p>
                        {t(
                            "passengerInfo.description",
                        )}
                    </p>
                </div>

                {/* Seçilen uçuş ve koltuk bilgilerini özetler. */}
                <section className="passenger-trip-summary">

                    {/* Uçuş numarasını gösterir. */}
                    <div>
                        <span>
                            {t("passengerInfo.flight")}
                        </span>

                        <strong>
                            {flightNo || "-"}
                        </strong>
                    </div>

                    {/* Kalkış ve varış noktalarını gösterir. */}
                    <div>
                        <span>
                            {t("passengerInfo.route")}
                        </span>

                        <strong>
                            {departure || "-"} →{" "}
                            {destination || "-"}
                        </strong>
                    </div>

                    {/* Seçilen koltuk numarasını gösterir. */}
                    <div>
                        <span>
                            {t("passengerInfo.seat")}
                        </span>

                        <strong>
                            {seatNumber || "-"}
                        </strong>
                    </div>
                </section>

                {/* Yolcu bilgilerinin girildiği formdur. */}
                <form
                    className="passenger-form"
                    onSubmit={handleSubmit}
                >
                    <h2>
                        {t(
                            "passengerInfo.formTitle",
                        )}
                    </h2>

                    <div className="passenger-form-grid">

                        {/* Yolcunun adını alır. */}
                        <div className="passenger-field">
                            <label htmlFor="firstName">
                                {t(
                                    "passengerInfo.firstName",
                                )}
                            </label>

                            <input
                                id="firstName"
                                type="text"
                                value={firstName}

                                // Kullanıcı yazdıkça firstName state'ini günceller.
                                onChange={(event) =>
                                    setFirstName(
                                        event.target.value,
                                    )
                                }
                            />
                        </div>

                        {/* Yolcunun soyadını alır. */}
                        <div className="passenger-field">
                            <label htmlFor="lastName">
                                {t(
                                    "passengerInfo.lastName",
                                )}
                            </label>

                            <input
                                id="lastName"
                                type="text"
                                value={lastName}

                                // Kullanıcı yazdıkça lastName state'ini günceller.
                                onChange={(event) =>
                                    setLastName(
                                        event.target.value,
                                    )
                                }
                            />
                        </div>

                        {/* Yolcunun e-posta adresini alır. */}
                        <div className="passenger-field">
                            <label htmlFor="email">
                                {t(
                                    "passengerInfo.email",
                                )}
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}

                                // Kullanıcı yazdıkça email state'ini günceller.
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value,
                                    )
                                }
                            />
                        </div>

                        {/* Yolcunun telefon numarasını alır. */}
                        <div className="passenger-field">
                            <label htmlFor="phone">
                                {t(
                                    "passengerInfo.phone",
                                )}
                            </label>

                            <input
                                id="phone"
                                type="tel"
                                value={phone}

                                // Kullanıcı yazdıkça phone state'ini günceller.
                                onChange={(event) =>
                                    setPhone(
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </div>

                    {/* Formda hata varsa kullanıcıya gösterir. */}
                    {error && (
                        <p
                            className="passenger-error"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

                    {/* Formu göndererek bilet özeti aşamasına geçer. */}
                    <button
                        type="submit"
                        className="passenger-continue-button"
                    >
                        {t("passengerInfo.continue")}
                    </button>
                </form>
            </section>
        </main>
    );
}