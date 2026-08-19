// Sayfalar arasında bağlantı kurmak için kullanılır.
import { Link } from "react-router-dom";

// Sayfadaki metinleri seçilen dile göre göstermek için kullanılır.
import { useTranslation } from "react-i18next";

// Uygulamanın ortak üst menüsünü kullanır.
import Navbar from "../components/Navbar";

// Giriş yapan admin kullanıcısının bilgilerine erişir.
import { useAuth } from "../hooks/useAuth";

// Dashboard sayfasının stil dosyasıdır.
import "./Dashboard.css";

/*
 * Admin rolündeki kullanıcının ana yönetim panelidir.
 * Uçuş ve koltuk yönetimi sayfalarına erişim sağlar.
 */
export default function AdminDashboard() {
    // Çeviri dosyalarındaki metinlere erişir.
    const { t } = useTranslation();

    // Giriş yapan admin kullanıcısının bilgisini alır.
    const { user } = useAuth();

    /*
     * Admin panelindeki kartları ve
     * kartların yönleneceği sayfaları tanımlar.
     */
    const cards = [
        {
            icon: "✈",
            titleKey: "dashboard.flightManagement",
            descriptionKey:
                "dashboard.flightManagementDescription",
            actionKey: "dashboard.manageFlights",

            // Uçuş yönetim sayfasına gider.
            to: "/admin/flights",
        },
        {
            icon: "💺",
            titleKey: "dashboard.seatManagement",
            descriptionKey:
                "dashboard.seatManagementDescription",
            actionKey: "dashboard.chooseFlight",

            /*
             * Önce uçuş seçilmesi gerektiği için
             * uçuş yönetim sayfasına yönlendirir.
             */
            to: "/admin/flights",
        },
        {
            icon: "📊",
            titleKey: "dashboard.systemOverview",
            descriptionKey:
                "dashboard.systemOverviewDescription",
            actionKey: "dashboard.comingSoon",

            // Henüz aktif bir sayfası olmadığı için route verilmez.
            to: null,
        },
    ] as const;

    return (
        <div className="dashboard-page">

            {/* Ortak üst menüyü gösterir. */}
            <Navbar />

            <main className="dashboard-main">

                {/* Admin kullanıcıyı karşılayan üst alan. */}
                <section className="dashboard-hero">
                    <span className="dashboard-eyebrow">
                        {t("dashboard.adminEyebrow")}
                    </span>

                    <h1 className="dashboard-title">
                        {t("dashboard.adminTitle")}
                    </h1>

                    <p className="dashboard-description">
                        <strong>{user?.email}</strong>
                        {" — "}
                        {t(
                            "dashboard.adminDescription",
                        )}
                    </p>
                </section>

                {/* Admin yönetim işlemlerini kartlar halinde gösterir. */}
                <section className="dashboard-grid">
                    {cards.map((card) => {

                        /*
                         * Kartların ortak içeriğini
                         * tekrar yazmamak için burada oluşturur.
                         */
                        const content = (
                            <>
                                <div
                                    className="dashboard-card__icon"
                                    aria-hidden="true"
                                >
                                    {card.icon}
                                </div>

                                <h2 className="dashboard-card__title">
                                    {t(card.titleKey)}
                                </h2>

                                <p className="dashboard-card__description">
                                    {t(
                                        card.descriptionKey,
                                    )}
                                </p>

                                <span className="dashboard-card__action">
                                    {t(card.actionKey)}
                                </span>
                            </>
                        );

                        /*
                         * Route'u olan kartları tıklanabilir
                         * Link olarak gösterir.
                         */
                        return card.to ? (
                            <Link
                                className="
                                    dashboard-card
                                    dashboard-card--link
                                "
                                key={card.titleKey}
                                to={card.to}
                            >
                                {content}
                            </Link>
                        ) : (
                            /*
                             * Route'u olmayan kartı
                             * pasif kart olarak gösterir.
                             */
                            <article
                                className="
                                    dashboard-card
                                    dashboard-card--disabled
                                "
                                key={card.titleKey}
                            >
                                {content}
                            </article>
                        );
                    })}
                </section>
            </main>
        </div>
    );
}