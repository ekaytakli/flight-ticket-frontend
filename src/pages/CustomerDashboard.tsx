import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import "./Dashboard.css";

export default function CustomerDashboard() {
    const { t } = useTranslation();
    const { user } = useAuth();

    /* Her kartın gideceği sayfayı burada tanımlıyoruz. */
    const cards = [
        {
            icon: "🔍",
            titleKey: "dashboard.flightSearch",
            descriptionKey: "dashboard.flightSearchDescription",
            actionKey: "dashboard.searchNow",
            to: "/",
        },
        {
            icon: "🎫",
            titleKey: "dashboard.myTickets",
            descriptionKey: "dashboard.myTicketsDescription",
            actionKey: "dashboard.viewTickets",
            to: "/my-tickets",
        },
        {
            icon: "👤",
            titleKey: "dashboard.profile",
            descriptionKey: "dashboard.profileDescription",
            actionKey: "dashboard.comingSoon",
            to: null,
        },
    ] as const;

    return (
        <div className="dashboard-page">
            <Navbar />

            <main className="dashboard-main">
                <section className="dashboard-hero">
                    <span className="dashboard-eyebrow">
                        {t("dashboard.customerEyebrow")}
                    </span>
                    <h1 className="dashboard-title">
                        {t("dashboard.customerTitle")}
                    </h1>
                    <p className="dashboard-description">
                        <strong>{user?.email}</strong> — {" "}
                        {t("dashboard.customerDescription")}
                    </p>
                </section>

                <section className="dashboard-grid">
                    {cards.map((card) => {
                        const content = (
                            <>
                                <div className="dashboard-card__icon" aria-hidden="true">
                                    {card.icon}
                                </div>
                                <h2 className="dashboard-card__title">
                                    {t(card.titleKey)}
                                </h2>
                                <p className="dashboard-card__description">
                                    {t(card.descriptionKey)}
                                </p>
                                <span className="dashboard-card__action">
                                    {t(card.actionKey)}
                                </span>
                            </>
                        );

                        /* Route'u olan kart tıklanabilir Link olarak gösterilir. */
                        return card.to ? (
                            <Link
                                className="dashboard-card dashboard-card--link"
                                key={card.titleKey}
                                to={card.to}
                            >
                                {content}
                            </Link>
                        ) : (
                            <article
                                className="dashboard-card dashboard-card--disabled"
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
