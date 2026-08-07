import { Navigate, Route, Routes } from "react-router-dom";

/* Giriş kontrolü yapan route bileşeni. */
import ProtectedRoute from "./components/ProtectedRoute";

/* Kullanıcının rolünü kontrol eden route bileşeni. */
import RoleRoute from "./components/RoleRoute";

/* Uygulamada gösterilecek sayfalar. */
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

/*
 * Uygulamadaki bütün sayfa yollarını tanımlar.
 * Public, korumalı ve rol bazlı route'lar burada yönetilir.
 */
export default function App() {
    return (
        <Routes>
            {/* Ana adrese gelen kullanıcı login sayfasına gönderilir. */}
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            {/* Giriş gerektirmeyen public sayfalar. */}
            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
                path="/register"
                element={<RegisterPage />}
            />

            <Route
                path="/unauthorized"
                element={<UnauthorizedPage />}
            />

            {/* Bu grubun altındaki sayfalar giriş gerektirir. */}
            <Route element={<ProtectedRoute />}>
                {/* Admin paneline sadece ROLE_ADMIN erişebilir. */}
                <Route
                    element={
                        <RoleRoute
                            allowedRoles={["ROLE_ADMIN"]}
                        />
                    }
                >
                    <Route
                        path="/admin"
                        element={<AdminDashboard />}
                    />
                </Route>

                {/* Customer paneline Customer ve Admin erişebilir. */}
                <Route
                    element={
                        <RoleRoute
                            allowedRoles={[
                                "ROLE_CUSTOMER",
                                "ROLE_ADMIN",
                            ]}
                        />
                    }
                >
                    <Route
                        path="/customer"
                        element={<CustomerDashboard />}
                    />
                </Route>
            </Route>

            {/* Tanımlanmayan adreslerde 404 sayfası gösterilir. */}
            <Route
                path="*"
                element={<NotFoundPage />}
            />
        </Routes>
    );
}