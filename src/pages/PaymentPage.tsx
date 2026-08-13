// Ödeme formundaki alanları, loading ve hata durumunu yönetmek için kullanılır.
import {
    useState,
    type FormEvent,
} from "react";

// URL bilgilerini okumak ve sayfalar arasında yönlendirme yapmak için kullanılır.
import {
    Link,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

// Backend ödeme servisine istek gönderen fonksiyondur.
import { createPayment } from "../api/paymentApi";

// Türkçe / İngilizce dil değiştirme bileşenidir.
import LanguageSwitcher from "../components/LanguageSwitcher";

// Ödeme sayfasının stil dosyasıdır.
import "./PaymentPage.css";

/*
 * Kullanıcının seçtiği uçuş ve koltuk için
 * ödeme bilgilerini girdiği sayfadır.
 */
export default function PaymentPage() {
    // Ödeme sonucuna göre başka sayfalara yönlendirme yapmak için kullanılır.
    const navigate = useNavigate();

    // BookingSummaryPage'den gelen URL bilgilerini okumak için kullanılır.
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

    // Ödeme formundaki kart bilgilerini state'te tutar.
    const [cardHolder, setCardHolder] =
        useState("");

    const [cardNumber, setCardNumber] =
        useState("");

    const [expireMonth, setExpireMonth] =
        useState("");

    const [expireYear, setExpireYear] =
        useState("");

    const [cvc, setCvc] =
        useState("");

    // Ödeme isteğinin devam edip etmediğini tutar.
    const [loading, setLoading] =
        useState(false);

    // Kullanıcıya gösterilecek hata mesajını tutar.
    const [error, setError] =
        useState("");

    /*
     * Mevcut rezervasyon bilgilerini
     * tekrar ödeme sayfasına dönebilmek için hazırlar.
     */
    const createReservationParams = () =>
        new URLSearchParams({
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

    /*
     * Ödeme formu gönderildiğinde alanları kontrol eder
     * ve backend ödeme servisine istek gönderir.
     */
    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        // Form gönderildiğinde sayfanın yenilenmesini engeller.
        event.preventDefault();

        // Önceki hata mesajını temizler.
        setError("");

        // Kart bilgilerinden biri boşsa işlemi durdurur.
        if (
            !cardHolder.trim() ||
            !cardNumber.trim() ||
            !expireMonth.trim() ||
            !expireYear.trim() ||
            !cvc.trim()
        ) {
            setError(
                "Ödeme bilgilerini eksiksiz doldurmalısınız.",
            );
            return;
        }

        // Uçuş, koltuk veya fiyat bilgisi eksikse ödeme yapılmaz.
        if (
            !flightId ||
            !seatId ||
            !seatPrice
        ) {
            setError(
                "Rezervasyon bilgileri eksik.",
            );
            return;
        }

        try {
            // Ödeme isteği başlarken butonu pasif hale getirir.
            setLoading(true);

            /*
             * Backend ödeme servisine uçuş,
             * koltuk ve tutar bilgisini gönderir.
             */
            /*
 * Formdaki rezervasyon, yolcu ve kart bilgilerini
 * backend ödeme endpointine gönderir.
 */
            const payment =
                await createPayment({
                    flightId: Number(flightId),
                    seatId: Number(seatId),
                    amount: Number(seatPrice),

                    firstName,
                    lastName,
                    email,
                    phone,

                    cardHolderName: cardHolder.trim(),

                    // Kullanıcı kart numarasını boşluklu yazarsa
                    // backend'e boşlukları kaldırarak gönderir.
                    cardNumber: cardNumber.replace(/\s/g, ""),

                    expireMonth: expireMonth.trim(),
                    expireYear: expireYear.trim(),
                    cvc: cvc.trim(),
                });

            // Backend ödeme sonucunu başarılı döndürürse success sayfasına gider.
            if (
                payment.status ===
                "SUCCESS"
            ) {
                const params =
                    new URLSearchParams({
                        paymentId:
                            payment.paymentId ??
                            "",
                        pnrKodu:
                            payment.pnrKodu ??
                            "",
                        flightNo,
                        seatNumber,
                        amount: seatPrice,
                    });

                navigate(
                    `/payment-success?${params.toString()}`,
                );

                return;
            }

            /*
             * Backend ödeme işlemini başarısız olarak
             * döndürürse failed sayfasına yönlendirir.
             */
            const retryParams =
                createReservationParams();

            const failedParams =
                new URLSearchParams({
                    message:
                        payment.message ??
                        "Ödeme işlemi başarısız oldu.",

                    // Kullanıcının tekrar ödeme yapabilmesi için rezervasyon bilgilerini korur.
                    retryParams:
                        retryParams.toString(),
                });

            navigate(
                `/payment-failed?${failedParams.toString()}`,
            );
        } catch (error) {
            // Gerçek backend hatasını geliştirici konsolunda gösterir.
            console.error(
                "Ödeme sırasında hata:",
                error,
            );

            /*
             * Backend ödeme endpointine ulaşılamazsa
             * başarısız ödeme ekranına yönlendirir.
             */
            const retryParams =
                createReservationParams();

            const failedParams =
                new URLSearchParams({
                    message:
                        "Ödeme servisine şu anda ulaşılamıyor.",

                    retryParams:
                        retryParams.toString(),
                });

            navigate(
                `/payment-failed?${failedParams.toString()}`,
            );
        } finally {
            // Ödeme isteği tamamlandığında loading durumunu kapatır.
            setLoading(false);
        }
    };

    return (
        <main className="payment-page">

            {/* Sayfanın üst menüsüdür. */}
            <header className="payment-header">
                <Link
                    to="/"
                    className="payment-logo"
                >
                    ✈ SkyRoute
                </Link>

                <div className="payment-header-actions">
                    {/* Dil değiştirme butonlarını gösterir. */}
                    <LanguageSwitcher />

                    {/* Kullanıcıyı ana sayfaya götürür. */}
                    <Link
                        to="/"
                        className="payment-home-button"
                    >
                        Ana Sayfa
                    </Link>
                </div>
            </header>

            <section className="payment-container">

                {/* Sayfanın başlık alanıdır. */}
                <div className="payment-heading">
                    <p className="payment-eyebrow">
                        Güvenli Ödeme
                    </p>

                    <h1>
                        Ödeme Bilgileri
                    </h1>

                    <p>
                        Rezervasyonunuzu tamamlamak için
                        ödeme bilgilerinizi girin.
                    </p>
                </div>

                <div className="payment-layout">

                    {/* Kullanıcının ödeme bilgilerini girdiği formdur. */}
                    <form
                        className="payment-form"
                        onSubmit={handleSubmit}
                    >
                        <h2>
                            Kart Bilgileri
                        </h2>

                        {/* Sandbox ortamı hakkında kullanıcıyı bilgilendirir. */}
                        <p className="payment-sandbox-info">
                            Sandbox test ortamında yalnızca
                            test kart bilgileri kullanılmalıdır.
                        </p>

                        {/* Kart sahibinin adını alır. */}
                        <div className="payment-field">
                            <label htmlFor="cardHolder">
                                Kart Üzerindeki İsim
                            </label>

                            <input
                                id="cardHolder"
                                type="text"
                                value={cardHolder}
                                placeholder="Ad Soyad"
                                onChange={(event) =>
                                    setCardHolder(
                                        event.target.value,
                                    )
                                }
                            />
                        </div>

                        {/* Kart numarasını alır. */}
                        <div className="payment-field">
                            <label htmlFor="cardNumber">
                                Kart Numarası
                            </label>

                            <input
                                id="cardNumber"
                                type="text"
                                inputMode="numeric"
                                value={cardNumber}
                                placeholder="0000 0000 0000 0000"
                                maxLength={19}
                                onChange={(event) =>
                                    setCardNumber(
                                        event.target.value,
                                    )
                                }
                            />
                        </div>

                        {/* Son kullanma tarihi ve CVC alanlarıdır. */}
                        <div className="payment-row">

                            {/* Son kullanma ayını alır. */}
                            <div className="payment-field">
                                <label htmlFor="expireMonth">
                                    Ay
                                </label>

                                <input
                                    id="expireMonth"
                                    type="text"
                                    inputMode="numeric"
                                    value={expireMonth}
                                    placeholder="MM"
                                    maxLength={2}
                                    onChange={(event) =>
                                        setExpireMonth(
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>

                            {/* Son kullanma yılını alır. */}
                            <div className="payment-field">
                                <label htmlFor="expireYear">
                                    Yıl
                                </label>

                                <input
                                    id="expireYear"
                                    type="text"
                                    inputMode="numeric"
                                    value={expireYear}
                                    placeholder="YY"
                                    maxLength={2}
                                    onChange={(event) =>
                                        setExpireYear(
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>

                            {/* Kart güvenlik kodunu alır. */}
                            <div className="payment-field">
                                <label htmlFor="cvc">
                                    CVC
                                </label>

                                <input
                                    id="cvc"
                                    type="password"
                                    inputMode="numeric"
                                    value={cvc}
                                    placeholder="***"
                                    maxLength={4}
                                    onChange={(event) =>
                                        setCvc(
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {/* Formda hata varsa kullanıcıya gösterir. */}
                        {error && (
                            <p
                                className="payment-error"
                                role="alert"
                            >
                                {error}
                            </p>
                        )}

                        {/* Ödeme işlemini backend üzerinden başlatır. */}
                        <button
                            type="submit"
                            className="payment-submit-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Ödeme İşleniyor..."
                                : "Ödemeyi Tamamla"}
                        </button>
                    </form>

                    {/* Rezervasyon özetini gösterir. */}
                    <aside className="payment-summary">
                        <h2>
                            Rezervasyon Özeti
                        </h2>

                        <div className="payment-summary-row">
                            <span>
                                Yolcu
                            </span>

                            <strong>
                                {firstName} {lastName}
                            </strong>
                        </div>

                        <div className="payment-summary-row">
                            <span>
                                Uçuş
                            </span>

                            <strong>
                                {flightNo || "-"}
                            </strong>
                        </div>

                        <div className="payment-summary-row">
                            <span>
                                Rota
                            </span>

                            <strong>
                                {departure || "-"} →{" "}
                                {destination || "-"}
                            </strong>
                        </div>

                        <div className="payment-summary-row">
                            <span>
                                Tarih
                            </span>

                            <strong>
                                {date || "-"}
                            </strong>
                        </div>

                        <div className="payment-summary-row">
                            <span>
                                Koltuk
                            </span>

                            <strong>
                                {seatNumber || "-"}
                            </strong>
                        </div>

                        {/* Backend'den gelen gerçek koltuk fiyatını gösterir. */}
                        <div className="payment-total">
                            <span>
                                Toplam
                            </span>

                            <strong>
                                {seatPrice || "0"} TL
                            </strong>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}