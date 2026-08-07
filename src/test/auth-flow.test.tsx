import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { renderApp } from "./renderApp";

describe("authentication flow", () => {
    it("shows a validation message when the login form is empty", async () => {
        const user = userEvent.setup();
        renderApp("/login");

        await user.click(
            screen.getByRole("button", { name: "Giriş Yap" }),
        );

        expect(screen.getByRole("alert")).toHaveTextContent(
            "E-posta ve şifre zorunludur.",
        );
    });

    it("logs the mock admin in and opens the admin dashboard", async () => {
        const user = userEvent.setup();
        renderApp("/login");

        await user.type(screen.getByLabelText("E-posta"), "admin@test.com");
        await user.type(screen.getByLabelText("Şifre"), "123456");
        await user.click(
            screen.getByRole("button", { name: "Giriş Yap" }),
        );

        expect(
            await screen.findByRole("heading", {
                name: "Yönetim Merkezine Hoş Geldin",
            }),
        ).toBeInTheDocument();
        expect(localStorage.getItem("token")).toBe("mock-admin-token");
    });

    it("logs another email in as a customer", async () => {
        const user = userEvent.setup();
        renderApp("/login");

        await user.type(screen.getByLabelText("E-posta"), "umut@test.com");
        await user.type(screen.getByLabelText("Şifre"), "123456");
        await user.click(
            screen.getByRole("button", { name: "Giriş Yap" }),
        );

        expect(
            await screen.findByRole("heading", {
                name: "Yeni Bir Yolculuk Planla",
            }),
        ).toBeInTheDocument();
        expect(localStorage.getItem("token")).toBe("mock-customer-token");
    });

    it("registers a mock user and returns to the login page", async () => {
        const user = userEvent.setup();
        renderApp("/register");

        await user.type(screen.getByLabelText("Ad"), "Umut");
        await user.type(screen.getByLabelText("Soyad"), "Hata");
        await user.type(screen.getByLabelText("E-posta"), "umut@test.com");
        await user.type(
            screen.getByLabelText("Şifre", { selector: "#password" }),
            "123456",
        );
        await user.type(screen.getByLabelText("Şifre Tekrar"), "123456");
        await user.click(screen.getByRole("button", { name: "Kayıt Ol" }));

        expect(
            await screen.findByRole("heading", { name: "Giriş Yap" }),
        ).toBeInTheDocument();

        const registeredUsers = JSON.parse(
            localStorage.getItem("registeredUsers") ?? "[]",
        ) as Array<{ email: string }>;
        expect(registeredUsers[0]?.email).toBe("umut@test.com");
    });

    it("requires every register field", async () => {
        const user = userEvent.setup();
        renderApp("/register");

        await user.click(screen.getByRole("button", { name: "Kayıt Ol" }));

        expect(screen.getByRole("alert")).toHaveTextContent(
            "Tüm alanları doldurmalısınız.",
        );
    });

    it("requires a password of at least six characters", async () => {
        const user = userEvent.setup();
        renderApp("/register");

        await user.type(screen.getByLabelText("Ad"), "Umut");
        await user.type(screen.getByLabelText("Soyad"), "Hata");
        await user.type(screen.getByLabelText("E-posta"), "umut@test.com");
        await user.type(
            screen.getByLabelText("Şifre", { selector: "#password" }),
            "12345",
        );
        await user.type(screen.getByLabelText("Şifre Tekrar"), "12345");
        await user.click(screen.getByRole("button", { name: "Kayıt Ol" }));

        expect(screen.getByRole("alert")).toHaveTextContent(
            "Şifre en az 6 karakter olmalıdır.",
        );
    });

    it("shows an error when register passwords do not match", async () => {
        const user = userEvent.setup();
        renderApp("/register");

        await user.type(screen.getByLabelText("Ad"), "Umut");
        await user.type(screen.getByLabelText("Soyad"), "Hata");
        await user.type(screen.getByLabelText("E-posta"), "umut@test.com");
        await user.type(
            screen.getByLabelText("Şifre", { selector: "#password" }),
            "123456",
        );
        await user.type(screen.getByLabelText("Şifre Tekrar"), "654321");
        await user.click(screen.getByRole("button", { name: "Kayıt Ol" }));

        expect(screen.getByRole("alert")).toHaveTextContent(
            "Şifreler eşleşmiyor.",
        );
    });
});
