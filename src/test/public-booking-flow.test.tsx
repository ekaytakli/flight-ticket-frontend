import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { renderApp } from "./renderApp";

function storeUser(
    role: "ROLE_ADMIN" | "ROLE_CUSTOMER",
    email: string,
) {
    localStorage.setItem(
        "token",
        role === "ROLE_ADMIN"
            ? "test-admin-token"
            : "test-customer-token",
    );

    localStorage.setItem(
        "user",
        JSON.stringify({
            email,
            role,
        }),
    );
}

describe("routing, roles and language", () => {
    /*
     * Admin sayfası korumalıdır.
     * Giriş yapmayan kullanıcı login sayfasına gönderilir.
     */
    it(
        "redirects an unauthenticated user from admin to login",
        () => {
            renderApp("/admin");

            expect(
                screen.getByRole("heading", {
                    name: "Giriş Yap",
                }),
            ).toBeInTheDocument();
        },
    );

    /*
     * Daha önce giriş yapan Customer kullanıcısının
     * localStorage oturumu geri yüklenir.
     */
    it(
        "restores a customer session from localStorage",
        () => {
            storeUser(
                "ROLE_CUSTOMER",
                "customer@test.com",
            );

            renderApp("/customer");

            expect(
                screen.getByRole("heading", {
                    name: "Yeni Bir Yolculuk Planla",
                }),
            ).toBeInTheDocument();

            expect(
                screen.getAllByText(
                    "customer@test.com",
                ).length,
            ).toBeGreaterThan(0);
        },
    );

    /*
     * Customer kullanıcısı Admin paneline erişemez.
     */
    it(
        "blocks a customer from the admin page",
        () => {
            storeUser(
                "ROLE_CUSTOMER",
                "customer@test.com",
            );

            renderApp("/admin");

            expect(
                screen.getByRole("heading", {
                    name: "Yetkisiz Erişim",
                }),
            ).toBeInTheDocument();

            expect(
                screen.getByRole("link", {
                    name: "Panele Dön",
                }),
            ).toHaveAttribute(
                "href",
                "/customer",
            );
        },
    );

    /*
     * Dil değiştirme sistemi kontrol edilir.
     */
    it(
        "changes the application language to English",
        async () => {
            const user = userEvent.setup();

            renderApp("/login");

            await user.click(
                screen.getByRole("button", {
                    name: "English",
                }),
            );

            expect(
                screen.getByRole("heading", {
                    name: "Sign In",
                }),
            ).toBeInTheDocument();

            expect(
                localStorage.getItem("language"),
            ).toBe("en");

            expect(
                document.documentElement.lang,
            ).toBe("en");
        },
    );

    /*
     * Tanımlanmayan bir route'ta 404 sayfası açılır.
     *
     * Eskiden Ana Sayfaya Dön butonu /login'e gidiyordu.
     * Artık public HomePage bulunduğu için "/" adresine gider.
     */
    it("shows the custom 404 page", () => {
        renderApp("/olmayan-sayfa");

        expect(
            screen.getByRole("heading", {
                name: "Sayfa Bulunamadı",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("link", {
                name: "Ana Sayfaya Dön",
            }),
        ).toHaveAttribute(
            "href",
            "/",
        );
    });

    /*
     * localStorage içindeki bozuk user verisi temizlenir.
     * Kullanıcı korumalı sayfaya erişemez.
     */
    it(
        "cleans an invalid stored user and returns to login",
        () => {
            localStorage.setItem(
                "token",
                "broken-token",
            );

            localStorage.setItem(
                "user",
                "{invalid-json",
            );

            renderApp("/admin");

            expect(
                screen.getByRole("heading", {
                    name: "Giriş Yap",
                }),
            ).toBeInTheDocument();

            expect(
                localStorage.getItem("token"),
            ).toBeNull();
        },
    );

    /*
     * Navbar üzerinden çıkış yapıldığında
     * kullanıcı ve token bilgileri temizlenir.
     */
    it(
        "logs out from the navbar",
        async () => {
            const user = userEvent.setup();

            storeUser(
                "ROLE_ADMIN",
                "admin@test.com",
            );

            renderApp("/admin");

            await user.click(
                screen.getByRole("button", {
                    name: "Çıkış Yap",
                }),
            );

            expect(
                screen.getByRole("heading", {
                    name: "Giriş Yap",
                }),
            ).toBeInTheDocument();

            expect(
                localStorage.getItem("token"),
            ).toBeNull();

            expect(
                localStorage.getItem("user"),
            ).toBeNull();
        },
    );
});