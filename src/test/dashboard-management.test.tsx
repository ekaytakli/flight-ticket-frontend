import {
    fireEvent,
    screen,
    waitFor,
} from "@testing-library/react";
import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import { renderApp } from "./renderApp";
import {
    createFlight,
    deleteFlight,
    getAllFlights,
    getFlightById,
} from "../api/flightApi";
import {
    deleteSeat,
    getSeatsByFlightId,
} from "../api/seatApi";

vi.mock("../api/flightApi", () => ({
    getAllFlights: vi.fn(),
    getFlightById: vi.fn(),
    createFlight: vi.fn(),
    updateFlight: vi.fn(),
    deleteFlight: vi.fn(),
}));

vi.mock("../api/seatApi", () => ({
    getSeatsByFlightId: vi.fn(),
    getAvailableSeatsByFlightId: vi.fn(),
    createSeat: vi.fn(),
    updateSeat: vi.fn(),
    deleteSeat: vi.fn(),
}));

const flight = {
    id: 1,
    flightNo: "SR101",
    departurePoint: "Istanbul",
    destinationPoint: "Ankara",
    departureTime: "2026-08-12T09:30",
    destinationTime: "2026-08-12T10:35",
};

const seat = {
    id: 13,
    seatNumber: "12A",
    seatType: "economy",
    isAvailable: true,
    price: 1450,
    flightId: 1,
};

/* Testte giriş yapmış kullanıcı oluşturmak için localStorage hazırlar. */
function storeUser(
    role: "ROLE_ADMIN" | "ROLE_CUSTOMER",
    email = "test@flight.com",
) {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("user", JSON.stringify({ email, role }));
}

describe("dashboard management pages", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getAllFlights).mockResolvedValue([flight]);
        vi.mocked(getFlightById).mockResolvedValue(flight);
        vi.mocked(getSeatsByFlightId).mockResolvedValue([seat]);
        vi.mocked(createFlight).mockResolvedValue(flight);
    });

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

    it("loads the admin flight list from the API", async () => {
        storeUser("ROLE_ADMIN", "admin@flight.com");
        renderApp("/admin/flights");

        expect(
            screen.getByRole("heading", { name: "Uçuş Yönetimi" }),
        ).toBeInTheDocument();

        expect(await screen.findByText("SR101")).toBeInTheDocument();
        expect(getAllFlights).toHaveBeenCalledOnce();

        expect(
            screen.getByRole("link", { name: "Yeni Uçuş Ekle" }),
        ).toHaveAttribute("href", "/admin/flights/new");
    });


    it("deletes empty seats before deleting a flight", async () => {
        storeUser("ROLE_ADMIN", "admin@flight.com");
        vi.spyOn(window, "confirm").mockReturnValue(true);
        vi.mocked(deleteSeat).mockResolvedValue(undefined);
        vi.mocked(deleteFlight).mockResolvedValue(undefined);

        renderApp("/admin/flights");

        expect(await screen.findByText("SR101")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Sil" }));

        await waitFor(() => {
            expect(getSeatsByFlightId).toHaveBeenCalledWith(1);
            expect(deleteSeat).toHaveBeenCalledWith(13);
            expect(deleteFlight).toHaveBeenCalledWith(1);
        });

        expect(screen.queryByText("SR101")).not.toBeInTheDocument();
    });

    it("does not delete a flight that has an occupied seat", async () => {
        storeUser("ROLE_ADMIN", "admin@flight.com");
        vi.spyOn(window, "confirm").mockReturnValue(true);
        vi.mocked(getSeatsByFlightId).mockResolvedValue([
            { ...seat, isAvailable: false },
        ]);

        renderApp("/admin/flights");

        expect(await screen.findByText("SR101")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Sil" }));

        expect(
            await screen.findByRole("alert"),
        ).toHaveTextContent(
            "Bu uçuşta dolu veya satılmış koltuk bulunduğu için uçuş silinmedi.",
        );
        expect(deleteSeat).not.toHaveBeenCalled();
        expect(deleteFlight).not.toHaveBeenCalled();
    });

    it("opens the new flight form", () => {
        storeUser("ROLE_ADMIN");
        renderApp("/admin/flights/new");

        expect(
            screen.getByRole("heading", { name: "Yeni Uçuş Ekle" }),
        ).toBeInTheDocument();
        expect(screen.getByLabelText("Uçuş No")).toHaveValue("");
    });

    it("creates a flight through the API", async () => {
        storeUser("ROLE_ADMIN");
        renderApp("/admin/flights/new");

        fireEvent.change(screen.getByLabelText("Uçuş No"), {
            target: { value: "SR999" },
        });
        fireEvent.change(screen.getByLabelText("Kalkış Noktası"), {
            target: { value: "Istanbul" },
        });
        fireEvent.change(screen.getByLabelText("Varış Noktası"), {
            target: { value: "Izmir" },
        });
        fireEvent.change(screen.getByLabelText("Kalkış Zamanı"), {
            target: { value: "2026-08-20T10:00" },
        });
        fireEvent.change(screen.getByLabelText("Varış Zamanı"), {
            target: { value: "2026-08-20T11:00" },
        });

        fireEvent.click(
            screen.getByRole("button", { name: "Uçuş Oluştur" }),
        );

        await waitFor(() => {
            expect(createFlight).toHaveBeenCalledWith({
                flightNo: "SR999",
                departurePoint: "Istanbul",
                destinationPoint: "Izmir",
                departureTime: "2026-08-20T10:00",
                destinationTime: "2026-08-20T11:00",
            });
        });
    });

    it("loads the edit flight form from the API", async () => {
        storeUser("ROLE_ADMIN");
        renderApp("/admin/flights/1/edit");

        expect(
            screen.getByRole("heading", { name: "Uçuşu Düzenle" }),
        ).toBeInTheDocument();

        expect(await screen.findByDisplayValue("SR101")).toBeInTheDocument();
        expect(getFlightById).toHaveBeenCalledWith(1);
    });

    it("loads seats for the selected flight from the API", async () => {
        storeUser("ROLE_ADMIN");
        renderApp("/admin/flights/1/seats");

        expect(
            screen.getByRole("heading", { name: "Uçuş Koltukları" }),
        ).toBeInTheDocument();

        expect(await screen.findByText("12A")).toBeInTheDocument();
        expect(getFlightById).toHaveBeenCalledWith(1);
        expect(getSeatsByFlightId).toHaveBeenCalledWith(1);
    });
});
