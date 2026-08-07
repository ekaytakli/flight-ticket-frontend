import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../components/LanguageSwitcher";
import { useAuth } from "../hooks/useAuth";
import "./AuthPage.css";

/*
 * Yeni kullanıcıların kayıt olmasını sağlar.
 * Form doğrulandıktan sonra register fonksiyonu çağrılır.
 */
export default function RegisterPage() {
    /* Kayıt sonrası login sayfasına yönlendirme yapmak için kullanılır. */
    const navigate = useNavigate();

    /* AuthContext içindeki kayıt fonksiyonuna erişir. */
    const { register } = useAuth();

    /* Metinleri seçili dile göre getirir. */
    const { t } = useTranslation();

    /* Form alanları ve ekran durumları state içinde tutulur. */
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /* Form gönderildiğinde doğrulama ve kayıt işlemini yönetir. */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        /* Formun sayfayı yenilemesini engeller. */
        event.preventDefault();
        setError("");

        /* Herhangi bir alan boşsa kayıt işlemi durdurulur. */
        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !email.trim() ||
            !password ||
            !passwordAgain
        ) {
            setError(t("auth.errors.allFieldsRequired"));
            return;
        }

        /* Şifrenin en az 6 karakter olması kontrol edilir. */
        if (password.length < 6) {
            setError(t("auth.errors.passwordTooShort"));
            return;
        }

        /* İki şifre alanının eşleşmesi kontrol edilir. */
        if (password !== passwordAgain) {
            setError(t("auth.errors.passwordMismatch"));
            return;
        }

        try {
            /* İşlem sırasında butonu devre dışı bırakır. */
            setLoading(true);

            /* AuthContext içindeki register fonksiyonunu çağırır. */
            await register({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                password,
            });

            /* Kayıt başarılıysa login sayfasına yönlendirir. */
            navigate("/login", { replace: true });
        } catch {
            /* Kayıt başarısız olursa hata mesajı gösterilir. */
            setError(t("auth.errors.registerFailed"));
        } finally {
            /* İşlem tamamlandığında loading kapatılır. */
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            {/* Türkçe ve İngilizce arasında geçiş sağlar. */}
            <LanguageSwitcher variant="floating" />

            <section className="auth-container">
                {/* Uygulama tanıtımının bulunduğu sol panel. */}
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

                {/* Kayıt formunun bulunduğu sağ panel. */}
                <div className="auth-form-panel">
                    <div className="auth-form-wrapper">
                        <h1 className="auth-title">
                            {t("auth.registerTitle")}
                        </h1>

                        <p className="auth-subtitle">
                            {t("auth.registerSubtitle")}
                        </p>

                        <form
                            className="auth-form"
                            onSubmit={handleSubmit}
                        >
                            {/* Ad ve soyad alanları. */}
                            <div className="auth-row">
                                <div className="auth-field">
                                    <label
                                        className="auth-label"
                                        htmlFor="firstName"
                                    >
                                        {t("auth.firstName")}
                                    </label>

                                    <input
                                        className="auth-input"
                                        id="firstName"
                                        type="text"
                                        value={firstName}
                                        autoComplete="given-name"
                                        onChange={(event) =>
                                            setFirstName(event.target.value)
                                        }
                                    />
                                </div>

                                <div className="auth-field">
                                    <label
                                        className="auth-label"
                                        htmlFor="lastName"
                                    >
                                        {t("auth.lastName")}
                                    </label>

                                    <input
                                        className="auth-input"
                                        id="lastName"
                                        type="text"
                                        value={lastName}
                                        autoComplete="family-name"
                                        onChange={(event) =>
                                            setLastName(event.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* E-posta alanı. */}
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

                            {/* Şifre ve şifre tekrar alanları. */}
                            <div className="auth-row">
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
                                        autoComplete="new-password"
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                    />
                                </div>

                                <div className="auth-field">
                                    <label
                                        className="auth-label"
                                        htmlFor="passwordAgain"
                                    >
                                        {t("auth.passwordAgain")}
                                    </label>

                                    <input
                                        className="auth-input"
                                        id="passwordAgain"
                                        type="password"
                                        value={passwordAgain}
                                        autoComplete="new-password"
                                        onChange={(event) =>
                                            setPasswordAgain(
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {/* Hata varsa kullanıcıya gösterilir. */}
                            {error && (
                                <p
                                    className="auth-error"
                                    role="alert"
                                >
                                    {error}
                                </p>
                            )}

                            {/* İşlem sırasında buton pasif olur. */}
                            <button
                                className="auth-submit-button"
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? t("auth.registering")
                                    : t("auth.registerButton")}
                            </button>
                        </form>

                        {/* Login sayfasına geçiş bağlantısı. */}
                        <p className="auth-footer">
                            {t("auth.hasAccount")}{" "}
                            <Link
                                className="auth-link"
                                to="/login"
                            >
                                {t("auth.goToLogin")}
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}