// Sayfalar arasında bağlantı kurmak için kullanılır.
import { Link } from "react-router-dom";

// Sayfadaki metinleri seçilen dile göre göstermek için kullanılır.
import { useTranslation } from "react-i18next";

// Uygulamanın ortak üst menüsünü kullanır.
import Navbar from "../components/Navbar";

// Giriş yapan customer kullanıcısının bilgilerine erişir.
import { useAuth } from "../hooks/useAuth";

// Dashboard sayfasının stil dosyasıdır.
import "./Dashboard.css";

/*
 * Customer rolündeki kullanıcının ana panelidir.
 * Uçuş arama ve bilet görüntüleme işlemlerine erişim sağlar.
 */
export default function CustomerDashboard() {
    // Çeviri dosyalarındaki metinlere erişir.
    const { t } = useTranslation();

    // Giriş yapan customer kullanıcısının bilgisini alır.
    const { user } = useAuth();

    /*
     * Customer panelinde gösterilecek kartları
     * ve yönlenecekleri sayfaları tanımlar.
     */
    const cards = [
        {
            icon: "🔍",
            titleKey: "dashboard.flightSearch",
            descriptionKey:
                "dashboard.flightSearchDescription",
            actionKey: "dashboard.searchNow",

            // Ana uçuş arama sayfasına gider.
            to: "/",
        },
        {
            icon: "🎫",
            titleKey: "dashboard.myTickets",
            descriptionKey:
                "dashboard.myTicketsDescription",
            actionKey: "dashboard.viewTickets",

            // Kullanıcının biletlerinin gösterildiği sayfaya gider.
            to: "/my-tickets",
        },
        {
            icon: "👤",
            titleKey: "dashboard.profile",
            descriptionKey:
                "dashboard.profileDescription",
            actionKey: "dashboard.comingSoon",

            // Profil sayfası henüz hazır olmadığı için route verilmez.
            to: null,
        },
    ] as const;

    return (
        <div className="dashboard-page">

            {/* Ortak üst menüyü gösterir. */}
            <Navbar />

            <main className="dashboard-main">

                {/* Customer kullanıcıyı karşılayan üst alan. */}
                <section className="dashboard-hero">
                    <span className="dashboard-eyebrow">
                        {t(
                            "dashboard.customerEyebrow",
                        )}
                    </span>

                    <h1 className="dashboard-title">
                        {t(
                            "dashboard.customerTitle",
                        )}
                    </h1>

                    <p className="dashboard-description">
                        <strong>{user?.email}</strong>
                        {" — "}
                        {t(
                            "dashboard.customerDescription",
                        )}
                    </p>
                </section>

                {/* Customer işlemlerini kartlar halinde gösterir. */}
                <section className="dashboard-grid">
                    {cards.map((card) => {

                        // Kartların ortak içeriğini oluşturur.
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