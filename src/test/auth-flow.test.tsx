import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    loginRequest,
    registerRequest,
} from "../api/authApi";

import { renderApp } from "./renderApp";

/*
 * Test sırasında gerçek backend'e istek atmak yerine
 * authentication API fonksiyonlarını taklit eder.
 */
vi.mock("../api/authApi", () => ({
    loginRequest: vi.fn(),
    registerRequest: vi.fn(),
}));

/*
 * AuthContext artık JWT içindeki sub ve roles alanlarını okuduğu için
 * testlerde gerçek JWT yapısına benzeyen sahte token oluşturur.
 */
function createTestJwt(
    email: string,
    role: "ROLE_ADMIN" | "ROLE_CUSTOMER",
) {
    // JWT header bilgisini oluşturur.
    const header = {
        alg: "HS256",
        typ: "JWT",
    };

    // AuthContext'in ihtiyaç duyduğu kullanıcı bilgilerini oluşturur.
    const payload = {
        sub: email,
        roles: [role],
    };

    /*
     * JSON verilerini Base64 formatına dönüştürür.
     * Testte imza doğrulaması yapılmadığı için sahte signature yeterlidir.
     */
    const encodedHeader = btoa(
        JSON.stringify(header),
    );

    const encodedPayload = btoa(
        JSON.stringify(payload),
    );

    // JWT'nin header.payload.signature yapısını döndürür.
    return `${encodedHeader}.${encodedPayload}.test-signature`;
}

describe("authentication flow", () => {
    /*
     * Her testten önce önceki testten kalan
     * mock ve localStorage bilgileri temizlenir.
     */
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it(
        "shows a validation message when the login form is empty",
        async () => {
            const user = userEvent.setup();

            renderApp("/login");

            await user.click(
                screen.getByRole("button", {
                    name: "Giriş Yap",
                }),
            );

            expect(
                screen.getByRole("alert"),
            ).toHaveTextContent(
                "E-posta ve şifre zorunludur.",
            );

            expect(
                loginRequest,
            ).not.toHaveBeenCalled();
        },
    );

    it(
        "logs the admin in and opens the admin dashboard",
        async () => {
            const user = userEvent.setup();

            // Admin rolü içeren sahte JWT oluşturur.
            const adminToken = createTestJwt(
                "admin@flight.com",
                "ROLE_ADMIN",
            );

            /*
             * Backend başarılı admin login yapmış
             * gibi JWT token döndürür.
             */
            vi.mocked(loginRequest).mockResolvedValue({
                token: adminToken,
            });

            renderApp("/login");

            await user.type(
                screen.getByLabelText("E-posta"),
                "admin@flight.com",
            );

            await user.type(
                screen.getByLabelText("Şifre"),
                "admin123",
            );

            await user.click(
                screen.getByRole("button", {
                    name: "Giriş Yap",
                }),
            );

            // Backend login fonksiyonunun doğru bilgilerle çağrıldığını kontrol eder.
            expect(
                loginRequest,
            ).toHaveBeenCalledWith({
                email: "admin@flight.com",
                password: "admin123",
            });

            // Admin rolü doğru okunursa AdminDashboard açılmalıdır.
            expect(
                await screen.findByRole("heading", {
                    name: "Yönetim Merkezine Hoş Geldin",
                }),
            ).toBeInTheDocument();

            // Backend'den gelen token'ın localStorage'a kaydedildiğini kontrol eder.
            expect(
                localStorage.getItem("token"),
            ).toBe(adminToken);
        },
    );

    it(
        "logs a customer in and opens the customer dashboard",
        async () => {
            const user = userEvent.setup();

            // Customer rolü içeren sahte JWT oluşturur.
            const customerToken = createTestJwt(
                "customer@test.com",
                "ROLE_CUSTOMER",
            );

            /*
             * Backend başarılı customer login yapmış
             * gibi JWT token döndürür.
             */
            vi.mocked(loginRequest).mockResolvedValue({
                token: customerToken,
            });

            renderApp("/login");

            await user.type(
                screen.getByLabelText("E-posta"),
                "customer@test.com",
            );

            await user.type(
                screen.getByLabelText("Şifre"),
                "123456",
            );

            await user.click(
                screen.getByRole("button", {
                    name: "Giriş Yap",
                }),
            );

            // Backend login fonksiyonunun doğru bilgilerle çağrıldığını kontrol eder.
            expect(
                loginRequest,
            ).toHaveBeenCalledWith({
                email: "customer@test.com",
                password: "123456",
            });

            // Customer rolü doğru okunursa CustomerDashboard açılmalıdır.
            expect(
                await screen.findByRole("heading", {
                    name: "Yeni Bir Yolculuk Planla",
                }),
            ).toBeInTheDocument();

            // Customer token'ının localStorage'a kaydedildiğini kontrol eder.
            expect(
                localStorage.getItem("token"),
            ).toBe(customerToken);
        },
    );

    it(
        "registers a user through the API and returns to login",
        async () => {
            const user = userEvent.setup();

            /*
             * Backend kayıt işlemini başarılı yapmış
             * gibi test cevabı döndürür.
             */
            vi.mocked(registerRequest).mockResolvedValue({
                token: "test-register-jwt",
            });

            renderApp("/register");

            await user.type(
                screen.getByLabelText("Ad"),
                "Umut",
            );

            await user.type(
                screen.getByLabelText("Soyad"),
                "Hata",
            );

            await user.type(
                screen.getByLabelText("E-posta"),
                "umut@test.com",
            );

            await user.type(
                screen.getByLabelText("Şifre", {
                    selector: "#password",
                }),
                "123456",
            );

            await user.type(
                screen.getByLabelText("Şifre Tekrar"),
                "123456",
            );

            await user.click(
                screen.getByRole("button", {
                    name: "Kayıt Ol",
                }),
            );

            expect(
                registerRequest,
            ).toHaveBeenCalledWith({
                firstName: "Umut",
                lastName: "Hata",
                email: "umut@test.com",
                password: "123456",
            });

            // Kayıt başarılı olunca tekrar LoginPage açılmalıdır.
            expect(
                await screen.findByRole("heading", {
                    name: "Giriş Yap",
                }),
            ).toBeInTheDocument();

            /*
             * Eski mock registeredUsers sistemi
             * artık kullanılmamalıdır.
             */
            expect(
                localStorage.getItem("registeredUsers"),
            ).toBeNull();
        },
    );

    it(
        "requires every register field",
        async () => {
            const user = userEvent.setup();

            renderApp("/register");

            await user.click(
                screen.getByRole("button", {
                    name: "Kayıt Ol",
                }),
            );

            expect(
                screen.getByRole("alert"),
            ).toHaveTextContent(
                "Tüm alanları doldurmalısınız.",
            );

            expect(
                registerRequest,
            ).not.toHaveBeenCalled();
        },
    );

    it(
        "requires a password of at least six characters",
        async () => {
            const user = userEvent.setup();

            renderApp("/register");

            await user.type(
                screen.getByLabelText("Ad"),
                "Umut",
            );

            await user.type(
                screen.getByLabelText("Soyad"),
                "Hata",
            );

            await user.type(
                screen.getByLabelText("E-posta"),
                "umut@test.com",
            );

            await user.type(
                screen.getByLabelText("Şifre", {
                    selector: "#password",
                }),
                "12345",
            );

            await user.type(
                screen.getByLabelText("Şifre Tekrar"),
                "12345",
            );

            await user.click(
                screen.getByRole("button", {
                    name: "Kayıt Ol",
                }),
            );

            expect(
                screen.getByRole("alert"),
            ).toHaveTextContent(
                "Şifre en az 6 karakter olmalıdır.",
            );

            expect(
                registerRequest,
            ).not.toHaveBeenCalled();
        },
    );

    it(
        "shows an error when register passwords do not match",
        async () => {
            const user = userEvent.setup();

            renderApp("/register");

            await user.type(
                screen.getByLabelText("Ad"),
                "Umut",
            );

            await user.type(
                screen.getByLabelText("Soyad"),
                "Hata",
            );

            await user.type(
                screen.getByLabelText("E-posta"),
                "umut@test.com",
            );

            await user.type(
                screen.getByLabelText("Şifre", {
                    selector: "#password",
                }),
                "123456",
            );

            await user.type(
                screen.getByLabelText("Şifre Tekrar"),
                "654321",
            );

            await user.click(
                screen.getByRole("button", {
                    name: "Kayıt Ol",
                }),
            );

            expect(
                screen.getByRole("alert"),
            ).toHaveTextContent(
                "Şifreler eşleşmiyor.",
            );

            expect(
                registerRequest,
            ).not.toHaveBeenCalled();
        },
    );
});