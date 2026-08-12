// Sayfadaki metinleri seçilen dile göre göstermek için kullanılır.
import { useTranslation } from "react-i18next";

// Uygulamanın ortak üst menüsünü kullanır.
import Navbar from "../components/Navbar";

// Giriş yapan customer kullanıcısının bilgilerine erişmek için kullanılır.
import { useAuth } from "../hooks/useAuth";

// Dashboard sayfasının stil dosyasıdır.
import "./Dashboard.css";

/*
 * Customer rolündeki kullanıcının ana panelidir.
 * Uçuş arama, biletlerim ve profil gibi seçenekleri gösterir.
 */
export default function CustomerDashboard() {
    // Çeviri dosyalarındaki metinlere erişmek için kullanılır.
    const { t } = useTranslation();

    // Giriş yapan kullanıcının bilgilerini AuthContext'ten alır.
    const { user } = useAuth();

    /*
     * Customer panelinde gösterilecek kartları tanımlar.
     * Her elemanda kartın ikonu ve çeviri anahtarı bulunur.
     */
    const cards = [
        ["🔍", "dashboard.flightSearch"],
        ["🎫", "dashboard.myTickets"],
        ["👤", "dashboard.profile"],
    ] as const;

    return (
        <div className="dashboard-page">
            {/* Üst menüyü gösterir. */}
            <Navbar />

            <main className="dashboard-main">

                {/* Customer kullanıcıyı karşılayan üst alan. */}
                <section className="dashboard-hero">
                    <span className="dashboard-eyebrow">
                        {t("dashboard.customerEyebrow")}
                    </span>

                    <h1 className="dashboard-title">
                        {t("dashboard.customerTitle")}
                    </h1>

                    <p className="dashboard-description">
                        {/* Giriş yapan kullanıcının e-posta bilgisini gösterir. */}
                        <strong>{user?.email}</strong> —{" "}

                        {/* Customer panelinin açıklama metnini gösterir. */}
                        {t("dashboard.customerDescription")}
                    </p>
                </section>

                {/* Customer işlemlerini kartlar halinde listeler. */}
                <section className="dashboard-grid">

                    {/* cards dizisindeki her eleman için bir kart oluşturur. */}
                    {cards.map(([icon, titleKey]) => (
                        <article
                            className="dashboard-card"
                            key={titleKey}
                        >
                            {/* Kartın ikonunu gösterir. */}
                            <div
                                className="dashboard-card__icon"
                                aria-hidden="true"
                            >
                                {icon}
                            </div>

                            {/* Kartın başlığını çeviri dosyasından getirir. */}
                            <h2 className="dashboard-card__title">
                                {t(titleKey)}
                            </h2>

                            {/* Customer kartlarının açıklama metnini gösterir. */}
                            <p className="dashboard-card__description">
                                {t(
                                    "dashboard.customerCardDescription",
                                )}
                            </p>

                            {/* Özelliğin henüz aktif olmadığını gösterir. */}
                            <span className="dashboard-card__status">
                                {t("dashboard.comingSoon")}
                            </span>
                        </article>
                    ))}
                </section>
            </main>
        </div>
    );
}