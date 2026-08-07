import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import "./Dashboard.css";

export default function CustomerDashboard() {
    const { t } = useTranslation();
    const { user } = useAuth();

    const cards = [
        ["🔍", "dashboard.flightSearch"],
        ["🎫", "dashboard.myTickets"],
        ["👤", "dashboard.profile"],
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
                    {cards.map(([icon, titleKey]) => (
                        <article className="dashboard-card" key={titleKey}>
                            <div
                                className="dashboard-card__icon"
                                aria-hidden="true"
                            >
                                {icon}
                            </div>
                            <h2 className="dashboard-card__title">
                                {t(titleKey)}
                            </h2>
                            <p className="dashboard-card__description">
                                {t("dashboard.customerCardDescription")}
                            </p>
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
