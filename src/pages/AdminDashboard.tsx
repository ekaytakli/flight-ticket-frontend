import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import "./Dashboard.css";

export default function AdminDashboard() {
    const { t } = useTranslation();
    const { user } = useAuth();

    /* Admin kartlarının hedef sayfalarını burada tutuyoruz. */
    const cards = [
        {
            icon: "✈",
            titleKey: "dashboard.flightManagement",
            descriptionKey: "dashboard.flightManagementDescription",
            actionKey: "dashboard.manageFlights",
            to: "/admin/flights",
        },
        {
            icon: "💺",
            titleKey: "dashboard.seatManagement",
            descriptionKey: "dashboard.seatManagementDescription",
            actionKey: "dashboard.chooseFlight",
            to: "/admin/flights",
        },
        {
            icon: "📊",
            titleKey: "dashboard.systemOverview",
            descriptionKey: "dashboard.systemOverviewDescription",
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
                        {t("dashboard.adminEyebrow")}
                    </span>
                    <h1 className="dashboard-title">
                        {t("dashboard.adminTitle")}
                    </h1>
                    <p className="dashboard-description">
                        <strong>{user?.email}</strong> —{" "}
                        {t("dashboard.adminDescription")}
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
