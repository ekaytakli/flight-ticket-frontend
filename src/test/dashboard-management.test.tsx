import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderApp } from "./renderApp";

/* Testte giriş yapmış kullanıcı oluşturmak için localStorage hazırlar. */
function storeUser(
    role: "ROLE_ADMIN" | "ROLE_CUSTOMER",
    email = "test@flight.com",
) {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("user", JSON.stringify({ email, role }));
}

describe("dashboard management pages", () => {
    it("connects customer dashboard cards to search and tickets pages", () => {
        storeUser("ROLE_CUSTOMER", "customer@test.com");
        renderApp("/customer");

        expect(
            screen.getByRole("link", { name: /Uçuş Ara/ }),
        ).toHaveAttribute("href", "/");

        expect(
            screen.getByRole("link", { name: /Biletlerim/ }),
        ).toHaveAttribute("href", "/my-tickets");
    });

    it("shows the customer ticket page", () => {
        storeUser("ROLE_CUSTOMER");
        renderApp("/my-tickets");

        expect(
            screen.getByRole("heading", { name: "Biletlerim" }),
        ).toBeInTheDocument();
        expect(screen.getByText("SKY7F2")).toBeInTheDocument();
    });

    it("blocks a customer from the admin flight list", () => {
        storeUser("ROLE_CUSTOMER");
        renderApp("/admin/flights");

        expect(
            screen.getByRole("heading", { name: "Yetkisiz Erişim" }),
        ).toBeInTheDocument();
    });

    it("shows the admin flight management list", () => {
        storeUser("ROLE_ADMIN", "admin@flight.com");
        renderApp("/admin/flights");

        expect(
            screen.getByRole("heading", { name: "Uçuş Yönetimi" }),
        ).toBeInTheDocument();
        expect(screen.getByText("SR101")).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: "Yeni Uçuş Ekle" }),
        ).toHaveAttribute("href", "/admin/flights/new");
    });

    it("opens the new flight form", () => {
        storeUser("ROLE_ADMIN");
        renderApp("/admin/flights/new");

        expect(
            screen.getByRole("heading", { name: "Yeni Uçuş Ekle" }),
        ).toBeInTheDocument();
        expect(screen.getByLabelText("Uçuş No")).toHaveValue("");
    });

    it("prefills the edit flight form from preview data", () => {
        storeUser("ROLE_ADMIN");
        renderApp("/admin/flights/1/edit");

        expect(
            screen.getByRole("heading", { name: "Uçuşu Düzenle" }),
        ).toBeInTheDocument();
        expect(screen.getByLabelText("Uçuş No")).toHaveValue("SR101");
    });

    it("shows seats for the selected flight", () => {
        storeUser("ROLE_ADMIN");
        renderApp("/admin/flights/1/seats");

        expect(
            screen.getByRole("heading", { name: "Uçuş Koltukları" }),
        ).toBeInTheDocument();
        expect(screen.getByText("12A")).toBeInTheDocument();
        expect(screen.getAllByText("Müsait").length).toBeGreaterThan(0);
    });
});
