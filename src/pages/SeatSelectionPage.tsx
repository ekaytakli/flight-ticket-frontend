// Backend koltuklarını yüklemek ve seçilen koltuğu state'te tutmak için kullanılır.
import {
    useEffect,
    useState,
} from "react";

// URL bilgilerini okumak ve sayfalar arasında yönlendirme yapmak için kullanılır.
import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

// Sayfadaki metinleri seçilen dile göre göstermek için kullanılır.
import { useTranslation } from "react-i18next";

// Backend'den seçilen uçuşa ait koltukları getirir.
import { getSeatsByFlightId } from "../api/seatApi";

// Türkçe / İngilizce dil değiştirme bileşenidir.
import LanguageSwitcher from "../components/LanguageSwitcher";

// Koltuk verisinin TypeScript tipini alır.
import type { Seat } from "../types/seat";

// Sayfanın stil dosyasıdır.
import "./SeatSelectionPage.css";

/*
 * Seçilen uçuşun koltuklarını backend'den getirir.
 * Kullanıcının müsait bir koltuk seçmesini sağlar.
 */
export default function SeatSelectionPage() {
    // Çeviri metinlerine erişir.
    const { t } = useTranslation();

    // Sonraki sayfaya yönlendirme yapmak için kullanılır.
    const navigate = useNavigate();

    // URL içindeki uçuş ID bilgisini alır.
    const { flightId } = useParams();

    // Önceki sayfadan gelen uçuş bilgilerini okur.
    const [searchParams] = useSearchParams();

    // Uçuş bilgilerini URL query parametrelerinden alır.
    const departure = searchParams.get("from") ?? "";
    const destination = searchParams.get("to") ?? "";
    const date = searchParams.get("date") ?? "";
    const flightNo = searchParams.get("flightNo") ?? "";

    // Backend'den gelen koltuk listesini tutar.
    const [seats, setSeats] = useState<Seat[]>([]);

    // Kullanıcının seçtiği koltuğun ID bilgisini tutar.
    const [selectedSeatId, setSelectedSeatId] =
        useState<number | null>(null);

    // Backend isteğinin devam edip etmediğini tutar.
    const [loading, setLoading] = useState(true);

    // Backend isteğinde oluşabilecek hata mesajını tutar.
    const [error, setError] = useState("");

    /*
     * Sayfa açıldığında flightId kullanılarak
     * o uçuşa ait koltuklar backend'den alınır.
     */
    useEffect(() => {
        const loadSeats = async () => {
            // Flight ID yoksa backend isteği gönderilmez.
            if (!flightId) {
                setError("Uçuş bilgisi bulunamadı.");
                setLoading(false);
                return;
            }

            try {
                // İstek başlamadan önce loading aktif edilir.
                setLoading(true);

                // Önceki hata mesajını temizler.
                setError("");

                // URL'den gelen flightId string olduğu için number'a çevrilir.
                const id = Number(flightId);

                // Geçerli bir uçuş ID değilse işlemi durdurur.
                if (Number.isNaN(id)) {
                    throw new Error("Geçersiz uçuş ID.");
                }

                // Seçilen uçuşun gerçek koltuklarını backend'den getirir.
                const data = await getSeatsByFlightId(id);

                // Gelen veriyi kontrol etmek için konsola yazdırır.
                console.log(
                    "Backend'den gelen koltuklar:",
                    data,
                );

                // Koltuk listesini state'e kaydeder.
                setSeats(data);
            } catch (error) {
                // Gerçek hatayı geliştirici konsolunda gösterir.
                console.error(
                    "Koltuklar alınırken hata:",
                    error,
                );

                // Kullanıcıya hata mesajı gösterir.
                setError(
                    "Koltuk bilgileri alınırken bir hata oluştu.",
                );
            } finally {
                // İşlem tamamlandığında loading kapanır.
                setLoading(false);
            }
        };

        // Asenkron koltuk yükleme fonksiyonunu çalıştırır.
        void loadSeats();
    }, [flightId]);

    // Seçilen koltuğun tüm bilgilerini seats dizisinden bulur.
    const selectedSeat = seats.find(
        (seat) => seat.id === selectedSeatId,
    );

    /*
     * Kullanıcı koltuğa tıkladığında çalışır.
     * Dolu koltukların seçilmesini engeller.
     */
    const handleSeatClick = (seat: Seat) => {
        // Koltuk müsait değilse işlem yapılmaz.
        if (!seat.isAvailable) {
            return;
        }

        // Seçilen koltuğun ID'sini state'e kaydeder.
        setSelectedSeatId(seat.id);
    };

    /*
     * Kullanıcı devam ettiğinde uçuş ve seçilen
     * koltuk bilgilerini PassengerInfoPage'e taşır.
     */
    const handleContinue = () => {
        // Koltuk seçilmemişse ilerlemez.
        if (!selectedSeat) {
            return;
        }

        // Uçuş ve koltuk bilgilerini query parametrelerine dönüştürür.
        const params = new URLSearchParams({
            flightId: flightId ?? "",
            flightNo,
            from: departure,
            to: destination,
            date,
            seatId: String(selectedSeat.id),
            seatNumber: selectedSeat.seatNumber,

            // Backend'den gelen gerçek koltuk fiyatını da sonraki sayfaya aktarır.
            seatPrice: String(selectedSeat.price),
        });

        // Yolcu bilgileri sayfasına yönlendirir.
        navigate(
            `/passenger-info?${params.toString()}`,
        );
    };

    return (
        <main className="seat-selection-page">

            {/* Sayfanın üst menüsüdür. */}
            <header className="seat-selection-header">
                <Link
                    to="/"
                    className="seat-selection-logo"
                >
                    ✈ SkyRoute
                </Link>

                <div className="seat-selection-actions">
                    {/* Dil değiştirme butonlarını gösterir. */}
                    <LanguageSwitcher />

                    {/* Kullanıcıyı ana sayfaya götürür. */}
                    <Link
                        to="/"
                        className="seat-selection-home-button"
                    >
                        {t("seatSelection.home")}
                    </Link>
                </div>
            </header>

            <section className="seat-selection-container">

                {/* Sayfanın başlık ve açıklama alanıdır. */}
                <div className="seat-selection-heading">
                    <p className="seat-selection-eyebrow">
                        {t("seatSelection.eyebrow")}
                    </p>

                    <h1>
                        {t("seatSelection.title")}
                    </h1>

                    <p>
                        {t("seatSelection.description")}
                    </p>
                </div>

                {/* Seçilen uçuşun özet bilgilerini gösterir. */}
                <section className="seat-flight-summary">
                    <div>
                        <span>
                            {t("seatSelection.flight")}
                        </span>

                        <strong>
                            {flightNo || `#${flightId ?? "-"}`}
                        </strong>
                    </div>

                    <div>
                        <span>
                            {t("seatSelection.route")}
                        </span>

                        <strong>
                            {departure || "-"} →{" "}
                            {destination || "-"}
                        </strong>
                    </div>

                    <div>
                        <span>
                            {t("seatSelection.date")}
                        </span>

                        <strong>
                            {date || "-"}
                        </strong>
                    </div>
                </section>

                {/* Backend isteği devam ederken yükleniyor mesajı gösterir. */}
                {loading && (
                    <p className="seat-selection-empty">
                        {t("common.loading")}
                    </p>
                )}

                {/* Backend isteği başarısız olursa hata mesajını gösterir. */}
                {!loading && error && (
                    <p
                        className="seat-selection-empty"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                {/* Uçuşta koltuk yoksa kullanıcıya bilgi verir. */}
                {!loading &&
                    !error &&
                    seats.length === 0 && (
                        <p className="seat-selection-empty">
                            Bu uçuş için henüz koltuk bulunmuyor.
                        </p>
                    )}

                {/* Backend'den koltuk geldiyse koltuk seçim alanını gösterir. */}
                {!loading &&
                    !error &&
                    seats.length > 0 && (
                        <section className="seat-selection-content">

                            {/* Koltukların bulunduğu ana karttır. */}
                            <div className="seat-map-card">
                                <div className="seat-map-header">

                                    <h2>
                                        {t(
                                            "seatSelection.chooseSeat",
                                        )}
                                    </h2>

                                    {/* Koltuk durumlarının açıklamalarını gösterir. */}
                                    <div className="seat-legend">
                                        <div>
                                            <span className="seat-legend-box seat-available" />
                                            {t(
                                                "seatSelection.available",
                                            )}
                                        </div>

                                        <div>
                                            <span className="seat-legend-box seat-selected" />
                                            {t(
                                                "seatSelection.selected",
                                            )}
                                        </div>

                                        <div>
                                            <span className="seat-legend-box seat-unavailable" />
                                            {t(
                                                "seatSelection.unavailable",
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Uçağın ön tarafını temsil eder. */}
                                <div className="aircraft-front">
                                    ✈
                                </div>

                                {/* Backend'den gelen koltukları ekranda oluşturur. */}
                                <div className="seat-map">
                                    {seats.map((seat, index) => {
                                        // Koltuğun seçili olup olmadığını kontrol eder.
                                        const isSelected =
                                            selectedSeatId === seat.id;

                                        // Altılı koltuk düzeninde konumu hesaplar.
                                        const columnPosition =
                                            index % 6;

                                        return (
                                            <div
                                                // İlk üç koltuktan sonra koridor boşluğu oluşturur.
                                                className={
                                                    columnPosition === 3
                                                        ? "seat-with-aisle"
                                                        : undefined
                                                }
                                                key={seat.id}
                                            >
                                                <button
                                                    type="button"

                                                    // Koltuğun durumuna göre CSS sınıflarını belirler.
                                                    className={[
                                                        "seat-button",
                                                        !seat.isAvailable
                                                            ? "seat-button--unavailable"
                                                            : "",
                                                        isSelected
                                                            ? "seat-button--selected"
                                                            : "",
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" ")}

                                                    // Dolu koltukların seçilmesini engeller.
                                                    disabled={
                                                        !seat.isAvailable
                                                    }

                                                    // Tıklanan koltuğu seçer.
                                                    onClick={() =>
                                                        handleSeatClick(
                                                            seat,
                                                        )
                                                    }

                                                    aria-pressed={
                                                        isSelected
                                                    }
                                                >
                                                    {seat.seatNumber}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Kullanıcının seçtiği koltuğun özetini gösterir. */}
                            <aside className="seat-selection-summary">
                                <h2>
                                    {t(
                                        "seatSelection.summaryTitle",
                                    )}
                                </h2>

                                {selectedSeat ? (
                                    <>
                                        {/* Seçilen koltuk numarasını gösterir. */}
                                        <div className="selected-seat-box">
                                            <span>
                                                {t(
                                                    "seatSelection.selectedSeat",
                                                )}
                                            </span>

                                            <strong>
                                                {
                                                    selectedSeat.seatNumber
                                                }
                                            </strong>
                                        </div>

                                        {/* Koltuğun tipini gösterir. */}
                                        <p>
                                            {t(
                                                "seatSelection.seatType",
                                            )}
                                            :{" "}
                                            <strong>
                                                {
                                                    selectedSeat.seatType
                                                }
                                            </strong>
                                        </p>

                                        {/* Backend'den gelen koltuk fiyatını gösterir. */}
                                        <p>
                                            Fiyat:{" "}
                                            <strong>
                                                {selectedSeat.price} TL
                                            </strong>
                                        </p>

                                        {/* Yolcu bilgileri sayfasına geçer. */}
                                        <button
                                            type="button"
                                            className="seat-continue-button"
                                            onClick={handleContinue}
                                        >
                                            {t(
                                                "seatSelection.continue",
                                            )}
                                        </button>
                                    </>
                                ) : (
                                    // Koltuk seçilmediyse kullanıcıyı bilgilendirir.
                                    <p className="seat-selection-empty">
                                        {t(
                                            "seatSelection.noSeatSelected",
                                        )}
                                    </p>
                                )}
                            </aside>
                        </section>
                    )}
            </section>
        </main>
    );
}