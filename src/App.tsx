import { Route, Routes } from "react-router-dom";

import FlightResultsPage from "./pages/FlightResultsPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import PassengerInfoPage from "./pages/PassengerInfoPage";
import BookingSummaryPage from "./pages/BookingSummaryPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";

// Ödeme akışında kullanılan sayfalar.
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentFailedPage from "./pages/PaymentFailedPage";

/* Giriş kontrolü yapan route bileşeni. */
import ProtectedRoute from "./components/ProtectedRoute";

/* Kullanıcının rolünü kontrol eden route bileşeni. */
import RoleRoute from "./components/RoleRoute";

/* Uygulamada gösterilecek sayfalar. */
import AdminDashboard from "./pages/AdminDashboard";
import AdminFlightFormPage from "./pages/AdminFlightFormPage";
import AdminFlightsPage from "./pages/AdminFlightsPage";
import AdminSeatManagementPage from "./pages/AdminSeatManagementPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

/*
 * Uygulamadaki bütün sayfa yollarını tanımlar.
 *
 * Ana sayfa, rezervasyon ve ödeme sayfaları public olarak kullanılabilir.
 * Admin ve Customer panelleri ise authentication ve rol kontrolünden geçer.
 */
export default function App() {
    return (
        <Routes>

            {/*
             * PUBLIC ANA SAYFA
             *
             * Kullanıcının giriş yapması gerekmez.
             * Uygulama açıldığında ana sayfa gösterilir.
             */}
            <Route
                path="/"
                element={<HomePage />}
            />

            {/*
             * Uçuş arama sonucunu gösterir.
             */}
            <Route
                path="/flights"
                element={<FlightResultsPage />}
            />

            {/*
             * Seçilen uçuşun koltuklarını gösterir.
             */}
            <Route
                path="/flights/:flightId/seats"
                element={<SeatSelectionPage />}
            />

            {/*
             * Yolcu bilgilerinin girildiği sayfadır.
             */}
            <Route
                path="/passenger-info"
                element={<PassengerInfoPage />}
            />

            {/*
             * Uçuş, koltuk ve yolcu bilgilerinin
             * son kez kontrol edildiği rezervasyon özetidir.
             */}
            <Route
                path="/booking-summary"
                element={<BookingSummaryPage />}
            />

            {/*
             * Eski rezervasyon başarı ekranıdır.
             * Mevcut sistemde kullanıldığı için şimdilik korunur.
             */}
            <Route
                path="/booking-success"
                element={<BookingSuccessPage />}
            />

            {/*
             * Kullanıcının ödeme bilgilerini girdiği sayfadır.
             */}
            <Route
                path="/payment"
                element={<PaymentPage />}
            />

            {/*
             * Ödeme başarılı olduğunda gösterilen sonuç sayfasıdır.
             */}
            <Route
                path="/payment-success"
                element={<PaymentSuccessPage />}
            />

            {/*
             * Ödeme başarısız olduğunda gösterilen sonuç sayfasıdır.
             */}
            <Route
                path="/payment-failed"
                element={<PaymentFailedPage />}
            />

            {/* Giriş gerektirmeyen authentication sayfaları. */}
            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
                path="/register"
                element={<RegisterPage />}
            />

            {/*
             * Kullanıcının rolü yeterli olmadığında
             * gösterilen yetkisiz erişim sayfasıdır.
             */}
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

                    {/* Uçuş ve koltuk yönetimi sadece admin tarafından açılabilir. */}
                    <Route
                        path="/admin/flights"
                        element={<AdminFlightsPage />}
                    />
                    <Route
                        path="/admin/flights/new"
                        element={<AdminFlightFormPage />}
                    />
                    <Route
                        path="/admin/flights/:id/edit"
                        element={<AdminFlightFormPage />}
                    />
                    <Route
                        path="/admin/flights/:flightId/seats"
                        element={<AdminSeatManagementPage />}
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

                    {/* Müşterinin satın aldığı biletleri gösterecek sayfa. */}
                    <Route
                        path="/my-tickets"
                        element={<MyTicketsPage />}
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