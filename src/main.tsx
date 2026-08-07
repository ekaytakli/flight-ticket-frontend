/*
 * React geliştirme araçlarını içe aktarıyoruz.
 * StrictMode geliştirme sırasında olası hataları tespit etmeye yardımcı olur.
 */
import { StrictMode } from "react";

/* Çoklu dil (i18n) yapılandırmasını başlatır. */
import "./i18n";

/*
 * React uygulamasını tarayıcıya bağlamak için kullanılır.
 * React 18 ile birlikte createRoot kullanılmaktadır.
 */
import { createRoot } from "react-dom/client";

/*
 * React Router'ın temel bileşenidir.
 * Sayfalar arasında yönlendirme yapılmasını sağlar.
 */
import { BrowserRouter } from "react-router-dom";

/* Uygulamanın ana componenti. */
import App from "./App";

/*
 * Authentication işlemlerini yöneten Context Provider.
 * Kullanıcı bilgileri uygulamanın her yerinden erişilebilir.
 */
import { AuthProvider } from "./context/AuthContext";

/* Uygulamanın genel stil dosyası. */
import "./index.css";

/*
 * React uygulamasını index.html içindeki root elementine bağlar.
 */
createRoot(document.getElementById("root")!).render(

    /* Geliştirme sırasında olası hataları tespit etmeye yardımcı olur. */
    <StrictMode>

        {/* Uygulamada sayfa yönlendirmelerini aktif hale getirir. */}
        <BrowserRouter>

            {/* Authentication bilgisini tüm uygulamaya aktarır. */}
            <AuthProvider>

                {/* Ana uygulama componenti çalıştırılır. */}
                <App />

            </AuthProvider>

        </BrowserRouter>

    </StrictMode>
);