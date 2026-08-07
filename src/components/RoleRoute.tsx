import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types/auth";

/*
 * Bu route'a erişebilecek kullanıcı rollerini alır.
 */
interface RoleRouteProps {
    allowedRoles: UserRole[];
}

/*
 * Kullanıcının rolünü kontrol eder.
 * Yetkisi yoksa Unauthorized sayfasına yönlendirir.
 */
export default function RoleRoute({
                                      allowedRoles,
                                  }: RoleRouteProps) {

    /* Giriş yapan kullanıcı bilgisi alınır. */
    const { user } = useAuth();

    /* Kullanıcı yoksa login sayfasına yönlendirilir. */
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    /* Kullanıcının rolü izin verilen roller arasında değilse erişim engellenir. */
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    /* Yetkisi varsa istenilen sayfa gösterilir. */
    return <Outlet />;
}