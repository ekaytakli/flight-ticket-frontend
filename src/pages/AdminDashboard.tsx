// Sayfadaki metinleri seçilen dile göre göstermek için kullanılır.
import { useTranslation } from "react-i18next";

// Uygulamanın ortak üst menüsünü kullanır.
import Navbar from "../components/Navbar";

// Giriş yapan kullanıcının bilgilerine AuthContext üzerinden erişir.
import { useAuth } from "../hooks/useAuth";

// Admin ve Customer dashboard sayfalarının stil dosyasıdır.
import "./Dashboard.css";

/*
 * Admin rolündeki kullanıcının ana yönetim panelidir.
 * Yönetim işlemlerini kartlar halinde gösterir.
 */
export default function AdminDashboard() {
    // Çeviri dosyalarındaki metinlere erişmek için kullanılır.
    const { t } = useTranslation();

    // Giriş yapan kullanıcının email ve rol bilgilerini alır.
    const { user } = useAuth();

    /*
     * Admin panelinde gösterilecek yönetim kartlarını tanımlar.
     * Her elemanda kartın ikonu ve çeviri anahtarı bulunur.
     */
    const cards = [
        ["✈", "dashboard.flightManagement"],
        ["💺", "dashboard.seatManagement"],
        ["📊", "dashboard.systemOverview"],
    ] as const;

    return (
        <div className="dashboard-page">
            {/* Üst menüyü gösterir. */}
            <Navbar />

            <main className="dashboard-main">

                {/* Admin kullanıcıyı karşılayan ve paneli açıklayan alan. */}
                <section className="dashboard-hero">
                    <span className="dashboard-eyebrow">
                        {t("dashboard.adminEyebrow")}
                    </span>

                    <h1 className="dashboard-title">
                        {t("dashboard.adminTitle")}
                    </h1>

                    <p className="dashboard-description">
                        {/* Giriş yapan adminin e-posta bilgisini gösterir. */}
                        <strong>{user?.email}</strong> —{" "}

                        {/* Admin panelinin açıklama metnini gösterir. */}
                        {t("dashboard.adminDescription")}
                    </p>
                </section>

                {/* Admin işlemlerini kartlar halinde listeler. */}
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

                            {/* Kartın kısa açıklamasını gösterir. */}
                            <p className="dashboard-card__description">
                                {t(
                                    "dashboard.adminCardDescription",
                                )}
                            </p>

                            {/* Özelliğin henüz tamamlanmadığını gösterir. */}
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