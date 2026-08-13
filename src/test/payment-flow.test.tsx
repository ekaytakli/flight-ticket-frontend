import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import { createPayment } from "../api/paymentApi";
import { renderApp } from "./renderApp";

// Testlerde gerçek ödeme servisine istek atılmasını engeller.
vi.mock("../api/paymentApi", () => ({
    createPayment: vi.fn(),
}));

const paymentPath =
    "/payment?" +
    new URLSearchParams({
        flightId: "12",
        flightNo: "SR101",
        from: "Istanbul",
        to: "Ankara",
        date: "2026-08-20",
        seatId: "45",
        seatNumber: "12A",
        seatPrice: "1450",
        firstName: "Umut",
        lastName: "Hata",
        email: "umut@test.com",
        phone: "5551112233",
    }).toString();

// Kart alanlarını ortak şekilde doldurur.
async function fillCardForm() {
    const user = userEvent.setup();

    await user.type(
        screen.getByLabelText("Kart Üzerindeki İsim"),
        "Umut Hata",
    );
    await user.type(
        screen.getByLabelText("Kart Numarası"),
        "5528 7920 0000 0008",
    );
    await user.type(screen.getByLabelText("Ay"), "12");
    await user.type(screen.getByLabelText("Yıl"), "30");
    await user.type(screen.getByLabelText("CVC"), "123");

    return user;
}

describe("payment frontend flow", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the payment form and reservation summary", () => {
        renderApp(paymentPath);

        expect(
            screen.getByRole("heading", {
                name: "Ödeme Bilgileri",
            }),
        ).toBeInTheDocument();

        expect(screen.getByText("SR101")).toBeInTheDocument();
        expect(screen.getByText("12A")).toBeInTheDocument();
        expect(screen.getByText("1450 TL")).toBeInTheDocument();
    });

    it("blocks an empty card form before calling the API", async () => {
        const user = userEvent.setup();
        renderApp(paymentPath);

        await user.click(
            screen.getByRole("button", {
                name: "Ödemeyi Tamamla",
            }),
        );

        expect(screen.getByRole("alert")).toHaveTextContent(
            "Ödeme bilgilerini eksiksiz doldurmalısınız.",
        );
        expect(createPayment).not.toHaveBeenCalled();
    });

    it("sends payment data and opens the success page", async () => {
        vi.mocked(createPayment).mockResolvedValue({
            status: "SUCCESS",
            paymentId: "PAY-101",
            pnrKodu: "PNR123",
        });

        renderApp(paymentPath);
        const user = await fillCardForm();

        await user.click(
            screen.getByRole("button", {
                name: "Ödemeyi Tamamla",
            }),
        );

        expect(createPayment).toHaveBeenCalledWith({
            flightId: 12,
            seatId: 45,
            amount: 1450,
            firstName: "Umut",
            lastName: "Hata",
            email: "umut@test.com",
            phone: "5551112233",
            cardHolderName: "Umut Hata",
            cardNumber: "5528792000000008",
            expireMonth: "12",
            expireYear: "30",
            cvc: "123",
        });

        expect(
            await screen.findByRole("heading", {
                name: "Biletiniz Başarıyla Oluşturuldu",
            }),
        ).toBeInTheDocument();
        expect(screen.getByText("PNR123")).toBeInTheDocument();
        expect(screen.getByText("PAY-101")).toBeInTheDocument();
    });

    it("shows the backend message when payment returns FAILED", async () => {
        vi.mocked(createPayment).mockResolvedValue({
            status: "FAILED",
            message: "Kart işlemi reddedildi.",
        });

        renderApp(paymentPath);
        const user = await fillCardForm();

        await user.click(
            screen.getByRole("button", {
                name: "Ödemeyi Tamamla",
            }),
        );

        expect(
            await screen.findByRole("heading", {
                name: "Ödeme İşlemi Tamamlanamadı",
            }),
        ).toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent(
            "Kart işlemi reddedildi.",
        );
        expect(
            screen.getByRole("link", {
                name: "Tekrar Dene",
            }),
        ).toHaveAttribute("href", expect.stringContaining("/payment?"));
    });

    it("shows a special message when the payment API returns 429", async () => {
        vi.mocked(createPayment).mockRejectedValue({
            isAxiosError: true,
            response: {
                status: 429,
            },
        });

        renderApp(paymentPath);
        const user = await fillCardForm();

        await user.click(
            screen.getByRole("button", {
                name: "Ödemeyi Tamamla",
            }),
        );

        expect(
            await screen.findByRole("alert"),
        ).toHaveTextContent(
            "Çok fazla ödeme denemesi yaptınız. Lütfen kısa bir süre sonra tekrar deneyin.",
        );
    });

    it("changes the payment page to English", async () => {
        const user = userEvent.setup();
        renderApp(paymentPath);

        await user.click(
            screen.getByRole("button", {
                name: "English",
            }),
        );

        expect(
            screen.getByRole("heading", {
                name: "Payment Information",
            }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", {
                name: "Complete Payment",
            }),
        ).toBeInTheDocument();
        expect(screen.getByText("Reservation Summary")).toBeInTheDocument();
    });

    it("translates the payment success page", async () => {
        const user = userEvent.setup();
        renderApp(
            "/payment-success?paymentId=PAY-1&pnrKodu=PNR-1&flightNo=SR101&seatNumber=12A&amount=1450",
        );

        await user.click(
            screen.getByRole("button", {
                name: "English",
            }),
        );

        expect(
            screen.getByRole("heading", {
                name: "Your Ticket Was Created Successfully",
            }),
        ).toBeInTheDocument();
        expect(screen.getByText("Payment ID")).toBeInTheDocument();
    });

    it("translates frontend-generated failed messages", async () => {
        const user = userEvent.setup();
        renderApp(
            "/payment-failed?messageKey=payment.errors.tooManyRequests",
        );

        expect(screen.getByRole("alert")).toHaveTextContent(
            "Çok fazla ödeme denemesi yaptınız.",
        );

        await user.click(
            screen.getByRole("button", {
                name: "English",
            }),
        );

        expect(
            screen.getByRole("heading", {
                name: "Payment Could Not Be Completed",
            }),
        ).toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent(
            "Too many payment attempts.",
        );
    });
});
