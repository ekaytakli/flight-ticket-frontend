import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../components/LanguageSwitcher";
import { useAuth } from "../hooks/useAuth";
import "./StatusPage.css";

/*
 * Yetkisi olmayan kullanıcılar için 403 sayfasını gösterir.
 */
export default function UnauthorizedPage() {

    /* Metinleri seçili dile göre getirir. */
    const { t } = useTranslation();

    /* Giriş yapan kullanıcı bilgisine erişir. */
    const { user } = useAuth();

    /*
     * Kullanıcının rolüne göre döneceği sayfayı belirler.
     */
    const dashboardPath = !user
        ? "/login"
        : user.role === "ROLE_ADMIN"
            ? "/admin"
            : "/customer";

    return (
        <main className="status-page">

            {/* Türkçe ve İngilizce arasında geçiş sağlar. */}
            <LanguageSwitcher variant="floating" />

            <section className="status-card">

                {/* Kilit simgesi gösterilir. */}
                <div className="status-icon" aria-hidden="true">
                    🔒
                </div>

                {/* HTTP durum kodu gösterilir. */}
                <p className="status-code">403</p>

                <h1 className="status-title">
                    {t("unauthorized.title")}
                </h1>

                <p className="status-description">
                    {t("unauthorized.description")}
                </p>

                {/* Kullanıcıyı uygun sayfaya yönlendiren bağlantı. */}
                <div className="status-actions">
                    <Link
                        className="status-button"
                        to={dashboardPath}
                    >
                        {t("unauthorized.button")}
                    </Link>
                </div>

            </section>
        </main>
    );
}