import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../components/LanguageSwitcher";
import { useAuth } from "../hooks/useAuth";
import "./AuthPage.css";

/*
 * Kullanıcının sisteme giriş yapmasını sağlar.
 * Başarılı girişte kullanıcı rolüne göre ilgili panele yönlendirilir.
 */
export default function LoginPage() {
    /* Sayfalar arasında yönlendirme yapmak için kullanılır. */
    const navigate = useNavigate();

    /* AuthContext içindeki gerçek backend login fonksiyonuna erişir. */
    const { login } = useAuth();

    /* Çoklu dil desteği için çeviri fonksiyonu. */
    const { t } = useTranslation();

    /* Form alanları ve ekran durumları state ile yönetilir. */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /*
     * Form gönderildiğinde alanları kontrol eder
     * ve giriş işlemini başlatır.
     */
    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        /* Formun sayfayı yenilemesini engeller. */
        event.preventDefault();

        /* Önceki hata mesajını temizler. */
        setError("");

        /* E-posta veya şifre boşsa işlem durdurulur. */
        if (!email.trim() || !password.trim()) {
            setError(t("auth.errors.loginRequired"));
            return;
        }

        try {
            /* İşlem sırasında buton pasif hale gelir. */
            setLoading(true);

            /*
             * AuthContext üzerinden backend'e gerçek login isteği gönderilir.
             */
            const user = await login({
                email: email.trim(),
                password,
            });

            /* Kullanıcı rolüne göre ilgili panele yönlendirilir. */
            navigate(
                user.role === "ROLE_ADMIN"
                    ? "/admin"
                    : "/customer",
                {
                    replace: true,
                },
            );
        } catch {
            /* Backend giriş işlemini reddederse hata gösterilir. */
            setError(t("auth.errors.loginFailed"));
        } finally {
            /* İşlem tamamlandığında loading kapatılır. */
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            {/* Dil değiştirme bileşeni. */}
            <LanguageSwitcher variant="floating" />

            <section className="auth-container">
                {/* Sol taraftaki tanıtım alanı. */}
                <div className="auth-brand-panel">
                    <div className="auth-brand-content">
                        <div
                            className="auth-plane-icon"
                            aria-hidden="true"
                        >
                            ✈
                        </div>

                        <p className="auth-brand-name">
                            {t("common.appName")}
                        </p>

                        <h2 className="auth-brand-title">
                            {t("auth.welcomeTitle")}
                        </h2>

                        <p className="auth-brand-description">
                            {t("auth.welcomeDescription")}
                        </p>
                    </div>
                </div>

                {/* Sağ taraftaki giriş formu. */}
                <div className="auth-form-panel">
                    <div className="auth-form-wrapper">
                        <h1 className="auth-title">
                            {t("auth.loginTitle")}
                        </h1>

                        <p className="auth-subtitle">
                            {t("auth.loginSubtitle")}
                        </p>

                        <form
                            className="auth-form"
                            onSubmit={handleSubmit}
                        >
                            {/* E-posta alanı */}
                            <div className="auth-field">
                                <label
                                    className="auth-label"
                                    htmlFor="email"
                                >
                                    {t("auth.email")}
                                </label>

                                <input
                                    className="auth-input"
                                    id="email"
                                    type="email"
                                    value={email}
                                    placeholder={t(
                                        "auth.emailPlaceholder",
                                    )}
                                    autoComplete="email"
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                />
                            </div>

                            {/* Şifre alanı */}
                            <div className="auth-field">
                                <label
                                    className="auth-label"
                                    htmlFor="password"
                                >
                                    {t("auth.password")}
                                </label>

                                <input
                                    className="auth-input"
                                    id="password"
                                    type="password"
                                    value={password}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                />
                            </div>

                            {/* Hata mesajı varsa gösterilir. */}
                            {error && (
                                <p
                                    className="auth-error"
                                    role="alert"
                                >
                                    {error}
                                </p>
                            )}

                            {/* Giriş butonu */}
                            <button
                                className="auth-submit-button"
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? t("auth.loggingIn")
                                    : t("auth.loginButton")}
                            </button>
                        </form>

                        {/* Kayıt sayfasına yönlendirme */}
                        <p className="auth-footer">
                            {t("auth.noAccount")}{" "}
                            <Link
                                className="auth-link"
                                to="/register"
                            >
                                {t("auth.goToRegister")}
                            </Link>
                        </p>

                        {/* Backend'deki varsayılan admin hesabı bilgisi */}
                        <p className="auth-demo-info">
                            {t("auth.demoAdmin")}
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}