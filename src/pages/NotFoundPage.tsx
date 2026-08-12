// Kullanıcıyı başka bir sayfaya yönlendiren bağlantı oluşturmak için kullanılır.
import { Link } from "react-router-dom";

// Sayfadaki metinleri seçilen dile göre göstermek için kullanılır.
import { useTranslation } from "react-i18next";

// Kullanıcının Türkçe ve İngilizce arasında geçiş yapmasını sağlar.
import LanguageSwitcher from "../components/LanguageSwitcher";

// 404 ve diğer durum sayfalarının stil dosyasıdır.
import "./StatusPage.css";

/*
 * Kullanıcı uygulamada bulunmayan bir adrese girdiğinde
 * gösterilen 404 hata sayfasıdır.
 */
export default function NotFoundPage() {
    // Çeviri dosyalarındaki metinlere erişmek için kullanılır.
    const { t } = useTranslation();

    return (
        <main className="status-page">

            {/* Sayfada dil değiştirme seçeneğini gösterir. */}
            <LanguageSwitcher variant="floating" />

            {/* 404 hata bilgilerinin bulunduğu karttır. */}
            <section className="status-card">

                {/* Görsel amaçlı pusula ikonunu gösterir. */}
                <div
                    className="status-icon"
                    aria-hidden="true"
                >
                    🧭
                </div>

                {/* HTTP sayfa bulunamadı kodunu gösterir. */}
                <p className="status-code">
                    404
                </p>

                {/* 404 sayfasının başlığını çeviri dosyasından getirir. */}
                <h1 className="status-title">
                    {t("notFound.title")}
                </h1>

                {/* Sayfanın neden bulunamadığını açıklayan metni gösterir. */}
                <p className="status-description">
                    {t("notFound.description")}
                </p>

                <div className="status-actions">

                    {/* Kullanıcıyı uygulamanın ana sayfasına geri götürür. */}
                    <Link
                        className="status-button"
                        to="/"
                    >
                        {t("notFound.button")}
                    </Link>
                </div>
            </section>
        </main>
    );
}