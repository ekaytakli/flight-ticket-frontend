// Sayfalar arası yönlendirme ve alt route'ları göstermek için gerekli araçları alır.
import { Navigate, Outlet, useLocation } from "react-router-dom";

// Kullanıcının giriş durumuna AuthContext üzerinden ulaşmak için kullanılır.
import { useAuth } from "../hooks/useAuth";

/*
 * Korumalı sayfalara erişimi kontrol eder.
 * Kullanıcı giriş yapmamışsa login sayfasına yönlendirir.
 */
export default function ProtectedRoute() {

    // Kullanıcının giriş yapıp yapmadığı bilgisini AuthContext'ten alır.
    const { isAuthenticated } = useAuth();

    // Kullanıcının şu anda erişmeye çalıştığı adresi alır.
    const location = useLocation();

    // Kullanıcı giriş yapmamışsa korumalı sayfanın açılmasını engeller.
    if (!isAuthenticated) {
        return (
            <Navigate
                // Kullanıcıyı giriş sayfasına yönlendirir.
                to="/login"

                // Mevcut adresi tarayıcı geçmişinde login adresiyle değiştirir.
                replace

                // Kullanıcının gitmek istediği adresi yönlendirme sırasında saklar.
                state={{ from: location.pathname }}
            />
        );
    }

    // Kullanıcı giriş yapmışsa ProtectedRoute altındaki ilgili sayfanın açılmasını sağlar.
    return <Outlet />;
}