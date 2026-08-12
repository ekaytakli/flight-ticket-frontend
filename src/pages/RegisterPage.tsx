// Form verilerini state'te tutmak ve form gönderme event tipini kullanmak için alınır.
import { useState, type FormEvent } from "react";

// Sayfalar arası bağlantı ve kod ile yönlendirme yapmak için kullanılır.
import { Link, useNavigate } from "react-router-dom";

// Sayfadaki metinlerin Türkçe/İngilizce gösterilmesini sağlar.
import { useTranslation } from "react-i18next";

// Dil değiştirme bileşenini kullanır.
import LanguageSwitcher from "../components/LanguageSwitcher";

// AuthContext içindeki register fonksiyonuna erişmek için kullanılır.
import { useAuth } from "../hooks/useAuth";

// Login ve Register sayfalarının stil dosyasıdır.
import "./AuthPage.css";

/*
 * Yeni kullanıcının kayıt olduğu sayfadır.
 * Form kontrollerinden sonra bilgileri backend'e gönderir.
 */
export default function RegisterPage() {
    // Kayıt başarılı olduğunda login sayfasına yönlendirmek için kullanılır.
    const navigate = useNavigate();

    // AuthContext içindeki register fonksiyonunu alır.
    const { register } = useAuth();

    // Çeviri dosyalarındaki metinlere ulaşmayı sağlar.
    const { t } = useTranslation();

    // Form alanlarındaki kullanıcı bilgilerini state içinde tutar.
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");

    // Hata mesajını ve kayıt işleminin devam edip etmediğini tutar.
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /*
     * Kullanıcı kayıt formunu gönderdiğinde çalışır.
     * Önce formu kontrol eder, ardından register işlemini başlatır.
     */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        // Form gönderildiğinde sayfanın yenilenmesini engeller.
        event.preventDefault();

        // Önceden oluşmuş hata mesajını temizler.
        setError("");

        // Alanlardan herhangi biri boşsa kayıt işlemini durdurur.
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

        // Şifrenin en az 6 karakter olmasını kontrol eder.
        if (password.length < 6) {
            setError(t("auth.errors.passwordTooShort"));
            return;
        }

        // Girilen iki şifrenin aynı olup olmadığını kontrol eder.
        if (password !== passwordAgain) {
            setError(t("auth.errors.passwordMismatch"));
            return;
        }

        try {
            // Backend işlemi devam ederken loading durumunu açar.
            setLoading(true);

            // Kullanıcı bilgilerini AuthContext üzerinden backend'e gönderir.
            await register({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                password,
            });

            // Kayıt başarılı olduğunda kullanıcıyı login sayfasına gönderir.
            navigate("/login", { replace: true });

        } catch {
            // Backend kayıt işlemini reddederse hata mesajı gösterir.
            setError(t("auth.errors.registerFailed"));

        } finally {
            // İşlem başarılı veya başarısız olsa da loading durumunu kapatır.
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">

            {/* Kullanıcının Türkçe ve İngilizce arasında geçiş yapmasını sağlar. */}
            <LanguageSwitcher variant="floating" />

            <section className="auth-container">

                {/* Sol tarafta uygulamanın tanıtım bilgilerini gösterir. */}
                <div className="auth-brand-panel">
                    <div className="auth-brand-content">

                        {/* Dekoratif uçak simgesi. */}
                        <div
                            className="auth-plane-icon"
                            aria-hidden="true"
                        >
                            ✈
                        </div>

                        {/* Uygulama adını gösterir. */}
                        <p className="auth-brand-name">
                            {t("common.appName")}
                        </p>

                        {/* Karşılama başlığını gösterir. */}
                        <h2 className="auth-brand-title">
                            {t("auth.welcomeTitle")}
                        </h2>

                        {/* Uygulamanın kısa açıklamasını gösterir. */}
                        <p className="auth-brand-description">
                            {t("auth.welcomeDescription")}
                        </p>
                    </div>
                </div>

                {/* Sağ tarafta kayıt formunu gösterir. */}
                <div className="auth-form-panel">
                    <div className="auth-form-wrapper">

                        <h1 className="auth-title">
                            {t("auth.registerTitle")}
                        </h1>

                        <p className="auth-subtitle">
                            {t("auth.registerSubtitle")}
                        </p>

                        {/* Form gönderildiğinde handleSubmit fonksiyonu çalışır. */}
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

                                        // Input değerini firstName state'ine bağlar.
                                        value={firstName}

                                        autoComplete="given-name"

                                        // Kullanıcı yazdıkça firstName state'ini günceller.
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

                                        // Kullanıcı yazdıkça lastName state'ini günceller.
                                        onChange={(event) =>
                                            setLastName(event.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Kullanıcının e-posta bilgisini alır. */}
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

                                    // Kullanıcı yazdıkça email state'ini günceller.
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                />
                            </div>

                            {/* Şifre ve şifre tekrar alanlarını gösterir. */}
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

                                        // Girilen şifreyi password state'ine kaydeder.
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

                                        // Tekrar girilen şifreyi ayrı state'te tutar.
                                        onChange={(event) =>
                                            setPasswordAgain(
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {/* Bir hata oluşmuşsa kullanıcıya gösterir. */}
                            {error && (
                                <p
                                    className="auth-error"
                                    role="alert"
                                >
                                    {error}
                                </p>
                            )}

                            {/* Kayıt isteği devam ederken buton tekrar kullanılamaz. */}
                            <button
                                className="auth-submit-button"
                                type="submit"
                                disabled={loading}
                            >
                                {/* İşlem durumuna göre buton yazısını değiştirir. */}
                                {loading
                                    ? t("auth.registering")
                                    : t("auth.registerButton")}
                            </button>
                        </form>

                        {/* Zaten hesabı olan kullanıcıyı LoginPage'e yönlendirir. */}
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