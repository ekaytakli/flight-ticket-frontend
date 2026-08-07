import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import "./Dashboard.css";

/*
 * Admin rolündeki kullanıcının yönetim panelini gösterir.
 */
export default function AdminDashboard() {
    /* Metinleri seçili dile göre getirir. */
    const { t } = useTranslation();

    /* Giriş yapan kullanıcının bilgisine erişir. */
    const { user } = useAuth();

    /*
     * Admin panelinde gösterilecek kartları tanımlar.
     * Her kart bir ikon ve çeviri anahtarından oluşur.
     */
    const cards = [
        ["✈", "dashboard.flightManagement"],
        ["💺", "dashboard.seatManagement"],
        ["📊", "dashboard.systemOverview"],
    ] as const;

    return (
        <div className="dashboard-page">
            {/* Ortak üst menüyü gösterir. */}
            <Navbar />

            <main className="dashboard-main">
                {/* Admin kullanıcıyı karşılayan üst bölüm. */}
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

                {/* Yönetim seçeneklerini kartlar halinde gösterir. */}
                <section className="dashboard-grid">
                    {cards.map(([icon, titleKey]) => (
                        <article
                            className="dashboard-card"
                            key={titleKey}
                        >
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
                                {t(
                                    "dashboard.adminCardDescription",
                                )}
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