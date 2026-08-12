// Form state'i tutmak ve form event tipini kullanmak için React araçlarını alır.
import { useState, type FormEvent } from "react";

// Sayfalar arası link ve programatik yönlendirme için kullanılır.
import { Link, useNavigate } from "react-router-dom";

// Sayfadaki metinleri TR/EN göstermek için çeviri fonksiyonunu alır.
import { useTranslation } from "react-i18next";

// Sayfada TR / EN değişimini sağlayan bileşen.
import LanguageSwitcher from "../components/LanguageSwitcher";

// AuthContext içindeki login fonksiyonuna kolayca erişmek için kullanılır.
import { useAuth } from "../hooks/useAuth";

// Login/Register sayfalarının ortak stil dosyası.
import "./AuthPage.css";

/*
 * Kullanıcının sisteme giriş yaptığı sayfadır.
 * Başarılı girişte rolüne göre admin veya customer paneline yönlendirir.
 */
export default function LoginPage() {
    // Kod içinden başka bir route'a yönlendirme yapmak için kullanılır.
    const navigate = useNavigate();

    // AuthContext içindeki login fonksiyonunu alır.
    const { login } = useAuth();

    // Çeviri anahtarlarının karşılığını almak için kullanılır.
    const { t } = useTranslation();

    // Kullanıcının girdiği e-posta bilgisini tutar.
    const [email, setEmail] = useState("");

    // Kullanıcının girdiği şifreyi tutar.
    const [password, setPassword] = useState("");

    // Kullanıcıya gösterilecek hata mesajını tutar.
    const [error, setError] = useState("");

    // Login işleminin devam edip etmediğini tutar.
    const [loading, setLoading] = useState(false);

    /*
     * Kullanıcı formu gönderdiğinde çalışır.
     * Alanları kontrol eder ve login işlemini başlatır.
     */
    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        // Form gönderilince sayfanın otomatik yenilenmesini engeller.
        event.preventDefault();

        // Önceki hata mesajını temizler.
        setError("");

        // E-posta veya şifre boşsa backend'e istek göndermez.
        if (!email.trim() || !password.trim()) {
            setError(t("auth.errors.loginRequired"));
            return;
        }

        try {
            // Login isteği sürerken loading durumunu aktif eder.
            setLoading(true);

            // Kullanıcı bilgilerini AuthContext üzerinden backend'e gönderir.
            const user = await login({
                email: email.trim(),
                password,
            });

            // Kullanıcının rolüne göre uygun panele yönlendirir.
            navigate(
                user.role === "ROLE_ADMIN"
                    ? "/admin"
                    : "/customer",
                {
                    replace: true,
                },
            );
        } catch {
            // Login başarısız olursa kullanıcıya hata mesajı gösterir.
            setError(t("auth.errors.loginFailed"));
        } finally {
            // İşlem başarılı veya başarısız olsa da loading durumunu kapatır.
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            {/* Sayfanın sağ üstünde TR / EN dil seçimini gösterir. */}
            <LanguageSwitcher variant="floating" />

            <section className="auth-container">
                {/* Sol taraftaki uygulama tanıtım alanı. */}
                <div className="auth-brand-panel">
                    <div className="auth-brand-content">
                        {/* Dekoratif uçak ikonu. */}
                        <div
                            className="auth-plane-icon"
                            aria-hidden="true"
                        >
                            ✈
                        </div>

                        {/* Uygulamanın adını çeviri dosyasından getirir. */}
                        <p className="auth-brand-name">
                            {t("common.appName")}
                        </p>

                        {/* Hoş geldiniz başlığını gösterir. */}
                        <h2 className="auth-brand-title">
                            {t("auth.welcomeTitle")}
                        </h2>

                        {/* Uygulamanın kısa açıklamasını gösterir. */}
                        <p className="auth-brand-description">
                            {t("auth.welcomeDescription")}
                        </p>
                    </div>
                </div>

                {/* Sağ taraftaki giriş formu alanı. */}
                <div className="auth-form-panel">
                    <div className="auth-form-wrapper">
                        {/* Giriş sayfası başlığı. */}
                        <h1 className="auth-title">
                            {t("auth.loginTitle")}
                        </h1>

                        {/* Giriş sayfasının açıklama metni. */}
                        <p className="auth-subtitle">
                            {t("auth.loginSubtitle")}
                        </p>

                        {/* Form gönderildiğinde handleSubmit çalışır. */}
                        <form
                            className="auth-form"
                            onSubmit={handleSubmit}
                        >
                            {/* E-posta giriş alanı. */}
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

                                    // Input değerini email state'ine bağlar.
                                    value={email}

                                    placeholder={t(
                                        "auth.emailPlaceholder",
                                    )}

                                    // Tarayıcının e-posta otomatik doldurmasını destekler.
                                    autoComplete="email"

                                    // Kullanıcı yazdıkça email state'ini günceller.
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                />
                            </div>

                            {/* Şifre giriş alanı. */}
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

                                    // Input değerini password state'ine bağlar.
                                    value={password}

                                    placeholder="••••••••"

                                    // Tarayıcının kayıtlı şifreyi önermesini sağlar.
                                    autoComplete="current-password"

                                    // Kullanıcı yazdıkça password state'ini günceller.
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                />
                            </div>

                            {/* Hata varsa ekranda gösterir. */}
                            {error && (
                                <p
                                    className="auth-error"
                                    role="alert"
                                >
                                    {error}
                                </p>
                            )}

                            {/* Formu gönderen giriş butonu. */}
                            <button
                                className="auth-submit-button"
                                type="submit"

                                // Login işlemi sürerken tekrar tıklanmasını engeller.
                                disabled={loading}
                            >
                                {/* İşlem durumuna göre buton yazısını değiştirir. */}
                                {loading
                                    ? t("auth.loggingIn")
                                    : t("auth.loginButton")}
                            </button>
                        </form>

                        {/* Kullanıcıyı kayıt sayfasına yönlendirir. */}
                        <p className="auth-footer">
                            {t("auth.noAccount")}{" "}

                            <Link
                                className="auth-link"
                                to="/register"
                            >
                                {t("auth.goToRegister")}
                            </Link>
                        </p>

                        {/* Test/demo için tanımlı admin hesabını gösterir. */}
                        <p className="auth-demo-info">
                            {t("auth.demoAdmin")}
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}