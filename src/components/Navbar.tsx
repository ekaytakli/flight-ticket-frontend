import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "../hooks/useAuth";
import LanguageSwitcher from "./LanguageSwitcher";
import "./Navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user, logout } = useAuth();

    const isAdmin = user?.role === "ROLE_ADMIN";
    const dashboardPath = isAdmin ? "/admin" : "/customer";
    const dashboardLabel = isAdmin
        ? t("navigation.adminDashboard")
        : t("navigation.customerDashboard");

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <header className="navbar">
            <div className="navbar__container">
                <Link className="navbar__brand" to={dashboardPath}>
                    <span className="navbar__logo" aria-hidden="true">
                        ✈
                    </span>
                    <span className="navbar__brand-text">
                        {t("common.appName")}
                    </span>
                </Link>

                <nav
                    className="navbar__navigation"
                    aria-label="Dashboard navigation"
                >
                    <Link className="navbar__link" to={dashboardPath}>
                        {dashboardLabel}
                    </Link>
                </nav>

                <div className="navbar__actions">
                    <LanguageSwitcher />

                    <div className="navbar__user">
                        <span className="navbar__avatar" aria-hidden="true">
                            {user?.email.charAt(0).toUpperCase() ?? "U"}
                        </span>
                        <div className="navbar__user-info">
                            <span className="navbar__email">{user?.email}</span>
                            <span className="navbar__role">
                                {dashboardLabel}
                            </span>
                        </div>
                    </div>

                    <button
                        className="navbar__logout"
                        type="button"
                        onClick={handleLogout}
                    >
                        {t("common.logout")}
                    </button>
                </div>
            </div>
        </header>
    );
}
