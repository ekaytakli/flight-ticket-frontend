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
 * Gerçek backend yerine auth API fonksiyonlarını test ortamında taklit eder.
 */
vi.mock("../api/authApi", () => ({
    loginRequest: vi.fn(),
    registerRequest: vi.fn(),
}));

describe("authentication flow", () => {
    /*
     * Her testten önce mock ve localStorage temizlenir.
     * Böylece testler birbirini etkilemez.
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

            /*
             * Form boş olduğu için backend isteği yapılmamalıdır.
             */
            expect(loginRequest).not.toHaveBeenCalled();
        },
    );

    it(
        "logs the admin in and opens the admin dashboard",
        async () => {
            const user = userEvent.setup();

            /*
             * Backend başarılı login yapmış gibi gerçek token benzeri
             * bir test cevabı döndürüyoruz.
             */
            vi.mocked(loginRequest).mockResolvedValue({
                token: "test-admin-jwt",
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

            /*
             * Backend'e doğru veriler gönderilmiş mi?
             */
            expect(loginRequest).toHaveBeenCalledWith({
                email: "admin@flight.com",
                password: "admin123",
            });

            /*
             * Admin dashboard açılmış mı?
             */
            expect(
                await screen.findByRole("heading", {
                    name: "Yönetim Merkezine Hoş Geldin",
                }),
            ).toBeInTheDocument();

            /*
             * Backend'den gelen token saklanmış mı?
             */
            expect(
                localStorage.getItem("token"),
            ).toBe("test-admin-jwt");
        },
    );

    it(
        "logs a customer in and opens the customer dashboard",
        async () => {
            const user = userEvent.setup();

            vi.mocked(loginRequest).mockResolvedValue({
                token: "test-customer-jwt",
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

            expect(loginRequest).toHaveBeenCalledWith({
                email: "customer@test.com",
                password: "123456",
            });

            expect(
                await screen.findByRole("heading", {
                    name: "Yeni Bir Yolculuk Planla",
                }),
            ).toBeInTheDocument();

            expect(
                localStorage.getItem("token"),
            ).toBe("test-customer-jwt");
        },
    );

    it(
        "registers a user through the API and returns to login",
        async () => {
            const user = userEvent.setup();

            /*
             * Backend başarılı kayıt yapmış gibi cevap döndürür.
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

            /*
             * Register API'sine doğru veri gönderildi mi?
             */
            expect(registerRequest).toHaveBeenCalledWith({
                firstName: "Umut",
                lastName: "Hata",
                email: "umut@test.com",
                password: "123456",
            });

            /*
             * Başarılı kayıt sonrası login sayfası açılmalı.
             */
            expect(
                await screen.findByRole("heading", {
                    name: "Giriş Yap",
                }),
            ).toBeInTheDocument();

            /*
             * Eski registeredUsers localStorage sistemi artık yok.
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