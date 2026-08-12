// Yetkisiz kullanıcıyı yönlendirmek ve alt route'u göstermek için gerekli araçları alır.
import { Navigate, Outlet } from "react-router-dom";

// Giriş yapan kullanıcının bilgilerine AuthContext üzerinden ulaşmak için kullanılır.
import { useAuth } from "../hooks/useAuth";

// Kullanıcı rollerinin TypeScript tipini alır.
import type { UserRole } from "../types/auth";

/*
 * Bu route'a hangi kullanıcı rollerinin
 * erişebileceğini belirleyen prop yapısıdır.
 */
interface RoleRouteProps {
    // Örneğin ["ROLE_ADMIN"] gibi izin verilen rolleri tutar.
    allowedRoles: UserRole[];
}

/*
 * Giriş yapan kullanıcının rolünü kontrol eder.
 * Rolü uygun değilse sayfaya erişmesini engeller.
 */
export default function RoleRoute({
                                      allowedRoles,
                                  }: RoleRouteProps) {

    // Giriş yapan kullanıcının bilgilerini AuthContext'ten alır.
    const { user } = useAuth();

    // Kullanıcı bilgisi yoksa giriş yapması için login sayfasına yönlendirir.
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Kullanıcının rolü izin verilen roller arasında değilse erişimi engeller.
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Kullanıcının rolü uygunsa RoleRoute altındaki ilgili sayfayı gösterir.
    return <Outlet />;
}