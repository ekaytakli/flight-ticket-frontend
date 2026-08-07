import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../components/LanguageSwitcher";
import { useAuth } from "../hooks/useAuth";
import "./StatusPage.css";

export default function NotFoundPage() {
    const { t } = useTranslation();
    const { user } = useAuth();

    const homePath = !user
        ? "/login"
        : user.role === "ROLE_ADMIN"
          ? "/admin"
          : "/customer";

    return (
        <main className="status-page">
            <LanguageSwitcher variant="floating" />
            <section className="status-card">
                <div className="status-icon" aria-hidden="true">
                    🧭
                </div>
                <p className="status-code">404</p>
                <h1 className="status-title">{t("notFound.title")}</h1>
                <p className="status-description">
                    {t("notFound.description")}
                </p>
                <div className="status-actions">
                    <Link className="status-button" to={homePath}>
                        {t("notFound.button")}
                    </Link>
                </div>
            </section>
        </main>
    );
}
