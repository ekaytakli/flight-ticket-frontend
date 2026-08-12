import { Route, Routes } from "react-router-dom";
import FlightResultsPage from "./pages/FlightResultsPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import PassengerInfoPage from "./pages/PassengerInfoPage";
import BookingSummaryPage from "./pages/BookingSummaryPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";

/* Giriş kontrolü yapan route bileşeni. */
import ProtectedRoute from "./components/ProtectedRoute";

/* Kullanıcının rolünü kontrol eden route bileşeni. */
import RoleRoute from "./components/RoleRoute";

/* Uygulamada gösterilecek sayfalar. */
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

/*
 * Uygulamadaki bütün sayfa yollarını tanımlar.
 *
 * Ana sayfa, giriş ve kayıt sayfaları public olarak kullanılabilir.
 * Admin ve Customer panelleri ise authentication ve rol kontrolünden geçer.
 */
export default function App() {
    return (
        <Routes>

            {/*
             * PUBLIC ANA SAYFA
             *
             * Kullanıcının giriş yapması gerekmez.
             * Uygulama açıldığında artık doğrudan login sayfasına
             * yönlendirme yapılmaz.
             */}
            <Route
                path="/"
                element={<HomePage />}
            />
            <Route
                path="/booking-success"
                element={<BookingSuccessPage />}
            />
            <Route
                path="/booking-summary"
                element={<BookingSummaryPage />}
            />
            <Route
                path="/passenger-info"
                element={<PassengerInfoPage />}
            />
            <Route
                path="/flights/:flightId/seats"
                element={<SeatSelectionPage />}
            />
            <Route
                path="/flights"
                element={<FlightResultsPage />}
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

            {/*
             * Bu grubun altındaki sayfalara erişebilmek için
             * kullanıcının giriş yapmış olması gerekir.
             */}
            <Route element={<ProtectedRoute />}>

                {/*
                 * ADMIN ROUTE
                 *
                 * Admin paneline yalnızca ROLE_ADMIN
                 * rolündeki kullanıcı erişebilir.
                 */}
                <Route
                    element={
                        <RoleRoute
                            allowedRoles={[
                                "ROLE_ADMIN",
                            ]}
                        />
                    }
                >
                    <Route
                        path="/admin"
                        element={<AdminDashboard />}
                    />
                </Route>

                {/*
                 * CUSTOMER ROUTE
                 *
                 * Customer paneline hem Customer
                 * hem de Admin erişebilir.
                 */}
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

            {/*
             * Yukarıdaki route'lardan hiçbirine uymayan
             * adreslerde 404 sayfası gösterilir.
             */}
            <Route
                path="*"
                element={<NotFoundPage />}
            />

        </Routes>
    );
}