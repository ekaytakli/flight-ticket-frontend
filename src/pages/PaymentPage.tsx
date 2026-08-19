// Ödeme formundaki alanları ve istek durumunu yönetir.
import {
    useState,
    type FormEvent,
} from "react";

// Axios hatalarında HTTP durum kodunu okumak için kullanılır.
import axios from "axios";

// Sayfalar arasında geçiş ve URL parametrelerini okumak için kullanılır.
import {
    Link,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

// Ekrandaki metinleri aktif dile göre getirir.
import { useTranslation } from "react-i18next";

// Backend ödeme servisine istek gönderir.
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
    const navigate = useNavigate();
    const { t } = useTranslation();

    // BookingSummaryPage'den gelen rezervasyon bilgilerini okur.
    const [searchParams] = useSearchParams();

    const flightId = searchParams.get("flightId") ?? "";
    const flightNo = searchParams.get("flightNo") ?? "";
    const departure = searchParams.get("from") ?? "";
    const destination = searchParams.get("to") ?? "";
    const date = searchParams.get("date") ?? "";

    const seatId = searchParams.get("seatId") ?? "";
    const seatNumber = searchParams.get("seatNumber") ?? "";
    const seatPrice = searchParams.get("seatPrice") ?? "";

    const firstName = searchParams.get("firstName") ?? "";
    const lastName = searchParams.get("lastName") ?? "";
    const email = searchParams.get("email") ?? "";
    const phone = searchParams.get("phone") ?? "";

    // Kart bilgilerini form state'inde tutar.
    const [cardHolder, setCardHolder] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expireMonth, setExpireMonth] = useState("");
    const [expireYear, setExpireYear] = useState("");
    const [cvc, setCvc] = useState("");

    // İstek sırasında butonu pasif yapmak için kullanılır.
    const [loading, setLoading] = useState(false);

    // Form doğrulama hatasını kullanıcıya gösterir.
    const [error, setError] = useState("");

    // Başarısız ödemeden sonra aynı rezervasyona geri dönmeyi sağlar.
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

    // Failed sayfasına giderken rezervasyon bilgilerini korur.
    const goToFailedPage = (
        options: {
            message?: string;
            messageKey?: string;
        },
    ) => {
        const retryParams = createReservationParams();
        const failedParams = new URLSearchParams({
            retryParams: retryParams.toString(),
        });

        if (options.message) {
            failedParams.set("message", options.message);
        }

        if (options.messageKey) {
            failedParams.set("messageKey", options.messageKey);
        }

        navigate(`/payment-failed?${failedParams.toString()}`);
    };

    // Formu kontrol eder ve ödeme isteğini başlatır.
    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();
        setError("");

        // Kart alanlarından biri boşsa backend'e istek göndermez.
        if (
            !cardHolder.trim() ||
            !cardNumber.trim() ||
            !expireMonth.trim() ||
            !expireYear.trim() ||
            !cvc.trim()
        ) {
            setError(t("payment.errors.required"));
            return;
        }

        // Rezervasyonun temel bilgileri yoksa ödeme başlatılmaz.
        if (!flightId || !seatId || !seatPrice) {
            setError(t("payment.errors.reservationMissing"));
            return;
        }

        try {
            setLoading(true);

            // Form verilerini backend ödeme endpointine gönderir.
            const payment = await createPayment({
                flightId: Number(flightId),
                seatId: Number(seatId),
                amount: Number(seatPrice),
                firstName,
                lastName,
                email,
                phone,
                cardHolderName: cardHolder.trim(),

                // Kart numarasındaki boşlukları backend'e göndermeden kaldırır.
                cardNumber: cardNumber.replace(/\s/g, ""),
                expireMonth: expireMonth.trim(),
                expireYear: expireYear.trim(),
                cvc: cvc.trim(),
            });

            // Başarılı ödemede PNR ve ödeme bilgilerini success sayfasına taşır.
            if (payment.status === "SUCCESS") {
                const params = new URLSearchParams({
                    paymentId: payment.paymentId ?? "",
                    pnrKodu: payment.pnrKodu ?? "",
                    flightNo,
                    seatNumber,
                    amount: seatPrice,
                });

                navigate(`/payment-success?${params.toString()}`);
                return;
            }

            // Backend FAILED döndürürse mesajı kullanıcıya gösterir.
            if (payment.message) {
                goToFailedPage({ message: payment.message });
            } else {
                goToFailedPage({
                    messageKey: "payment.errors.failed",
                });
            }
        } catch (requestError) {
            console.error("Ödeme sırasında hata:", requestError);

            // Rate limit aşılırsa 429 için özel ve anlaşılır mesaj gösterir.
            if (
                axios.isAxiosError(requestError) &&
                requestError.response?.status === 429
            ) {
                goToFailedPage({
                    messageKey: "payment.errors.tooManyRequests",
                });
                return;
            }

            // Backend hata mesajı döndürdüyse onu kullanıcıya iletir.
            if (axios.isAxiosError(requestError)) {
                const backendMessage = (
                    requestError.response?.data as
                        | { message?: string }
                        | undefined
                )?.message;

                if (backendMessage) {
                    goToFailedPage({ message: backendMessage });
                    return;
                }
            }

            // Bağlantı gibi diğer hatalarda genel servis mesajı kullanılır.
            goToFailedPage({
                messageKey: "payment.errors.serviceUnavailable",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="payment-page">
            <header className="payment-header">
                <Link to="/" className="payment-logo">
                    ✈ SkyRoute
                </Link>

                <div className="payment-header-actions">
                    <LanguageSwitcher />

                    <Link to="/" className="payment-home-button">
                        {t("payment.home")}
                    </Link>
                </div>
            </header>

            <section className="payment-container">
                <div className="payment-heading">
                    <p className="payment-eyebrow">
                        {t("payment.eyebrow")}
                    </p>

                    <h1>{t("payment.title")}</h1>

                    <p>{t("payment.description")}</p>
                </div>

                <div className="payment-layout">
                    <form
                        className="payment-form"
                        onSubmit={handleSubmit}
                    >
                        <h2>{t("payment.cardTitle")}</h2>

                        <p className="payment-sandbox-info">
                            {t("payment.sandboxInfo")}
                        </p>

                        <div className="payment-field">
                            <label htmlFor="cardHolder">
                                {t("payment.cardHolder")}
                            </label>

                            <input
                                id="cardHolder"
                                type="text"
                                value={cardHolder}
                                placeholder={t("payment.cardHolderPlaceholder")}
                                onChange={(event) =>
                                    setCardHolder(event.target.value)
                                }
                            />
                        </div>

                        <div className="payment-field">
                            <label htmlFor="cardNumber">
                                {t("payment.cardNumber")}
                            </label>

                            <input
                                id="cardNumber"
                                type="text"
                                inputMode="numeric"
                                value={cardNumber}
                                placeholder="0000 0000 0000 0000"
                                maxLength={19}
                                onChange={(event) =>
                                    setCardNumber(event.target.value)
                                }
                            />
                        </div>

                        <div className="payment-row">
                            <div className="payment-field">
                                <label htmlFor="expireMonth">
                                    {t("payment.expireMonth")}
                                </label>

                                <input
                                    id="expireMonth"
                                    type="text"
                                    inputMode="numeric"
                                    value={expireMonth}
                                    placeholder="MM"
                                    maxLength={2}
                                    onChange={(event) =>
                                        setExpireMonth(event.target.value)
                                    }
                                />
                            </div>

                            <div className="payment-field">
                                <label htmlFor="expireYear">
                                    {t("payment.expireYear")}
                                </label>

                                <input
                                    id="expireYear"
                                    type="text"
                                    inputMode="numeric"
                                    value={expireYear}
                                    placeholder="YY"
                                    maxLength={2}
                                    onChange={(event) =>
                                        setExpireYear(event.target.value)
                                    }
                                />
                            </div>

                            <div className="payment-field">
                                <label htmlFor="cvc">
                                    {t("payment.cvc")}
                                </label>

                                <input
                                    id="cvc"
                                    type="password"
                                    inputMode="numeric"
                                    value={cvc}
                                    placeholder="***"
                                    maxLength={4}
                                    onChange={(event) =>
                                        setCvc(event.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="payment-error" role="alert">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="payment-submit-button"
                            disabled={loading}
                        >
                            {loading
                                ? t("payment.processing")
                                : t("payment.submit")}
                        </button>
                    </form>

                    <aside className="payment-summary">
                        <h2>{t("payment.summaryTitle")}</h2>

                        <div className="payment-summary-row">
                            <span>{t("payment.passenger")}</span>
                            <strong>
                                {firstName} {lastName}
                            </strong>
                        </div>

                        <div className="payment-summary-row">
                            <span>{t("payment.flight")}</span>
                            <strong>{flightNo || "-"}</strong>
                        </div>

                        <div className="payment-summary-row">
                            <span>{t("payment.route")}</span>
                            <strong>
                                {departure || "-"} → {destination || "-"}
                            </strong>
                        </div>

                        <div className="payment-summary-row">
                            <span>{t("payment.date")}</span>
                            <strong>{date || "-"}</strong>
                        </div>

                        <div className="payment-summary-row">
                            <span>{t("payment.seat")}</span>
                            <strong>{seatNumber || "-"}</strong>
                        </div>

                        <div className="payment-total">
                            <span>{t("payment.total")}</span>
                            <strong>{seatPrice || "0"} TL</strong>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}
