// Backend isteği ve sayfa durumlarını yönetmek için React araçları kullanılır.
import {
    useEffect,
    useMemo,
    useState,
} from "react";

// Sayfalar arası bağlantı ve URL parametrelerini okumak için kullanılır.
import {
    Link,
    useSearchParams,
} from "react-router-dom";

// Sayfadaki metinleri seçilen dile göre göstermek için kullanılır.
import { useTranslation } from "react-i18next";

// Backend'deki uçuşları getiren API fonksiyonudur.
import { getAllFlights } from "../api/flightApi";

// Türkçe / İngilizce dil değiştirme bileşenidir.
import LanguageSwitcher from "../components/LanguageSwitcher";

// Uçuş verisinin TypeScript tipini alır.
import type { Flight } from "../types/flight";

// Uçuş sonuçları sayfasının stil dosyasıdır.
import "./FlightResultsPage.css";

/*
 * Kullanıcının arama kriterlerine uygun
 * uçuşları backend'den getirip listeler.
 */
export default function FlightResultsPage() {
    // Çeviri dosyalarındaki metinlere erişir.
    const { t } = useTranslation();

    // HomePage'den URL ile gelen arama bilgilerini okumak için kullanılır.
    const [searchParams] = useSearchParams();

    // Kullanıcının aradığı kalkış, varış ve tarih bilgilerini alır.
    const departure =
        searchParams.get("from") ?? "";

    const destination =
        searchParams.get("to") ?? "";

    const date =
        searchParams.get("date") ?? "";

    // Backend'den gelen bütün uçuşları tutar.
    const [flights, setFlights] =
        useState<Flight[]>([]);

    // Backend isteğinin devam edip etmediğini tutar.
    const [loading, setLoading] =
        useState(true);

    // Backend isteğinde oluşabilecek hata mesajını tutar.
    const [error, setError] =
        useState("");

    /*
     * Sayfa ilk açıldığında backend'den
     * gerçek uçuş listesini getirir.
     */
    useEffect(() => {
        const loadFlights = async () => {
            try {
                // İstek başlamadan önce loading durumunu açar.
                setLoading(true);

                // Önceki hata mesajını temizler.
                setError("");

                // Uçuş listesini backend'den alır.
                const data = await getAllFlights();

                // Backend'den gelen gerçek uçuşları kontrol etmek için konsola yazdırır.
                console.log(
                    "Backend'den gelen uçuşlar:",
                    data,
                );

                // Gelen uçuşları state'e kaydeder.
                setFlights(data);
            } catch (error) {
                // Gerçek hatayı geliştirici konsolunda görmemizi sağlar.
                console.error(
                    "Uçuşlar alınırken hata:",
                    error,
                );

                // Backend isteği başarısız olursa kullanıcıya hata mesajı gösterir.
                setError(
                    t(
                        "flightResults.errors.fetchFailed",
                    ),
                );
            } finally {
                // İşlem başarılı veya başarısız olsa da loading durumunu kapatır.
                setLoading(false);
            }
        };

        // Asenkron uçuş getirme fonksiyonunu çalıştırır.
        void loadFlights();
    }, [t]);

    /*
     * Backend'den gelen uçuşları kullanıcının
     * arama kriterlerine göre filtreler.
     */
    const filteredFlights = useMemo(
        () =>
            flights.filter((flight) => {
                // Kalkış noktasının kullanıcının aramasıyla eşleşmesini kontrol eder.
                const departureMatches =
                    flight.departurePoint
                        .trim()
                        .toLocaleLowerCase("tr-TR") ===
                    departure
                        .trim()
                        .toLocaleLowerCase("tr-TR");

                // Varış noktasının kullanıcının aramasıyla eşleşmesini kontrol eder.
                const destinationMatches =
                    flight.destinationPoint
                        .trim()
                        .toLocaleLowerCase("tr-TR") ===
                    destination
                        .trim()
                        .toLocaleLowerCase("tr-TR");

                /*
                 * Backend'deki kalkış tarihinin,
                 * kullanıcının seçtiği tarihle eşleşmesini kontrol eder.
                 */
                const dateMatches =
                    !date ||
                    flight.departureTime.startsWith(
                        date,
                    );

                // Üç kriter de eşleşiyorsa uçuş sonuçlarda gösterilir.
                return (
                    departureMatches &&
                    destinationMatches &&
                    dateMatches
                );
            }),
        [
            flights,
            departure,
            destination,
            date,
        ],
    );

    /*
     * Backend'den gelen tarih-saat bilgisinden
     * sadece saat kısmını ekranda göstermek için kullanılır.
     */
    const formatTime = (
        dateTime: string,
    ) => {
        // Örneğin "2026-09-03 09:30" değerini iki parçaya ayırır.
        const parts =
            dateTime.trim().split(" ");

        // İkinci parça olan saat bilgisini döndürür.
        return parts[1] ?? dateTime;
    };

    return (
        <main className="flight-results-page">

            {/* Sayfanın üst menüsüdür. */}
            <header className="flight-results-header">

                {/* Logoya basıldığında ana sayfaya döner. */}
                <Link
                    to="/"
                    className="flight-results-logo"
                >
                    ✈ SkyRoute
                </Link>

                <div className="flight-results-actions">

                    {/* Türkçe / İngilizce dil değiştirme alanıdır. */}
                    <LanguageSwitcher />

                    {/* Kullanıcıyı ana sayfaya geri götürür. */}
                    <Link
                        to="/"
                        className="flight-results-home-button"
                    >
                        {t(
                            "flightResults.backHome",
                        )}
                    </Link>
                </div>
            </header>

            <section className="flight-results-container">

                {/* Sayfanın başlık ve açıklama alanıdır. */}
                <div className="flight-results-heading">
                    <p className="flight-results-eyebrow">
                        {t(
                            "flightResults.eyebrow",
                        )}
                    </p>

                    <h1>
                        {t(
                            "flightResults.title",
                        )}
                    </h1>

                    <p>
                        {t(
                            "flightResults.description",
                        )}
                    </p>
                </div>

                {/* Kullanıcının yaptığı uçuş aramasını özetler. */}
                <section className="flight-search-summary">

                    {/* Kalkış bilgisini gösterir. */}
                    <div className="flight-search-summary-item">
                        <span>
                            {t(
                                "flightResults.departure",
                            )}
                        </span>

                        <strong>
                            {departure || "-"}
                        </strong>
                    </div>

                    {/* Kalkış ve varış arasındaki yönü gösterir. */}
                    <div className="flight-search-summary-arrow">
                        →
                    </div>

                    {/* Varış bilgisini gösterir. */}
                    <div className="flight-search-summary-item">
                        <span>
                            {t(
                                "flightResults.destination",
                            )}
                        </span>

                        <strong>
                            {destination || "-"}
                        </strong>
                    </div>

                    {/* Seçilen tarihi gösterir. */}
                    <div className="flight-search-summary-item">
                        <span>
                            {t(
                                "flightResults.date",
                            )}
                        </span>

                        <strong>
                            {date || "-"}
                        </strong>
                    </div>
                </section>

                {/* Backend isteği devam ederken yükleniyor mesajı gösterir. */}
                {loading && (
                    <p className="flight-results-message">
                        {t("common.loading")}
                    </p>
                )}

                {/* Backend isteği başarısız olursa hata mesajını gösterir. */}
                {!loading && error && (
                    <p
                        className="flight-results-message"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                {/* Backend çalışıyor fakat kriterlere uygun uçuş yoksa gösterilir. */}
                {!loading &&
                    !error &&
                    filteredFlights.length === 0 && (
                        <p className="flight-results-message">
                            {t(
                                "flightResults.noFlights",
                            )}
                        </p>
                    )}

                {/* Kriterlere uygun uçuşlar varsa kartlar halinde gösterilir. */}
                {!loading &&
                    !error &&
                    filteredFlights.length > 0 && (
                        <section className="flight-list">

                            {/* Her uçuş için ayrı bir kart oluşturur. */}
                            {filteredFlights.map(
                                (flight) => (
                                    <article
                                        className="flight-card"
                                        key={flight.id}
                                    >

                                        {/* Uçuş numarasını gösterir. */}
                                        <div className="flight-card-number">
                                            <span>
                                                {t(
                                                    "flightResults.flightNo",
                                                )}
                                            </span>

                                            <strong>
                                                {flight.flightNo}
                                            </strong>
                                        </div>

                                        {/* Kalkış ve varış bilgilerini gösterir. */}
                                        <div className="flight-card-route">

                                            {/* Kalkış saati ve noktasını gösterir. */}
                                            <div>
                                                <strong>
                                                    {formatTime(
                                                        flight.departureTime,
                                                    )}
                                                </strong>

                                                <span>
                                                    {
                                                        flight.departurePoint
                                                    }
                                                </span>
                                            </div>

                                            {/* Uçuş yönünü görsel olarak gösterir. */}
                                            <div className="flight-card-line">
                                                <span>
                                                    ✈
                                                </span>
                                            </div>

                                            {/* Varış saati ve noktasını gösterir. */}
                                            <div>
                                                <strong>
                                                    {formatTime(
                                                        flight.destinationTime,
                                                    )}
                                                </strong>

                                                <span>
                                                    {
                                                        flight.destinationPoint
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        {/*
                                         * Uçuş seçildiğinde gerçek flight ID ve
                                         * uçuş bilgilerini SeatSelectionPage'e aktarır.
                                         */}
                                        <Link
                                            to={`/flights/${flight.id}/seats?${new URLSearchParams(
                                                {
                                                    flightNo:
                                                    flight.flightNo,
                                                    from:
                                                    flight.departurePoint,
                                                    to:
                                                    flight.destinationPoint,
                                                    date,
                                                },
                                            ).toString()}`}
                                            className="flight-card-select"
                                        >
                                            {t(
                                                "flightResults.selectFlight",
                                            )}
                                        </Link>
                                    </article>
                                ),
                            )}
                        </section>
                    )}
            </section>
        </main>
    );
}