import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

/*
 * Kullanıcının giriş yapıp yapmadığını kontrol eder.
 * Giriş yapılmamışsa login sayfasına yönlendirir.
 */
export default function ProtectedRoute() {
    /* AuthContext içindeki giriş bilgisini alır. */
    const { isAuthenticated } = useAuth();

    /* Kullanıcının gitmek istediği adresi alır. */
    const location = useLocation();

    /* Giriş yapılmamışsa login sayfasına yönlendir. */
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    /* Giriş yapılmışsa alt route'u göster. */
    return <Outlet />;
}