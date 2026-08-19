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

// Kullanıcının gerçek biletlerini getiren API fonksiyonunu alır.
import {
    getMyTickets,
} from "../api/ticketApi";

/*
 * Test sırasında gerçek flight backend servisine
 * istek gönderilmesini engeller.
 */
vi.mock("../api/flightApi", () => ({
    getAllFlights: vi.fn(),
    getFlightById: vi.fn(),
    createFlight: vi.fn(),
    updateFlight: vi.fn(),
    deleteFlight: vi.fn(),
}));

/*
 * Test sırasında gerçek seat backend servisine
 * istek gönderilmesini engeller.
 */
vi.mock("../api/seatApi", () => ({
    getSeatsByFlightId: vi.fn(),
    getAvailableSeatsByFlightId: vi.fn(),
    createSeat: vi.fn(),
    updateSeat: vi.fn(),
    deleteSeat: vi.fn(),
}));

/*
 * MyTicketsPage artık previewTickets yerine
 * backend'deki gerçek bilet servisini kullandığı için
 * ticket API de test ortamında mocklanır.
 */
vi.mock("../api/ticketApi", () => ({
    getMyTickets: vi.fn(),
    createTicket: vi.fn(),
}));

/*
 * Testlerde kullanılacak örnek uçuş.
 */
const flight = {
    id: 1,
    flightNo: "SR101",
    departurePoint: "Istanbul",
    destinationPoint: "Ankara",
    departureTime: "2026-08-12T09:30",
    destinationTime: "2026-08-12T10:35",
};

/*
 * Testlerde kullanılacak örnek koltuk.
 */
const seat = {
    id: 13,
    seatNumber: "12A",
    seatType: "economy",
    isAvailable: true,
    price: 1450,
    flightId: 1,
};

/*
 * Backend'den giriş yapan kullanıcıya aitmiş gibi
 * döndürülecek örnek gerçek bilet.
 */
const ticket = {
    id: 1,
    pnrKodu: "PNR123",
    date: "2026-08-19T10:00:00",
    flightId: 1,
    seatId: 13,
    seatNumber: "12A",
};

/*
 * Testte giriş yapmış kullanıcı oluşturmak için
 * localStorage bilgilerini hazırlar.
 */
function storeUser(
    role: "ROLE_ADMIN" | "ROLE_CUSTOMER",
    email = "test@flight.com",
) {
    localStorage.setItem(
        "token",
        "test-token",
    );

    localStorage.setItem(
        "user",
        JSON.stringify({
            email,
            role,
        }),
    );
}

describe("dashboard management pages", () => {

    /*
     * Her testten önce mockları temizler
     * ve API'lerin döndüreceği varsayılan
     * test verilerini hazırlar.
     */
    beforeEach(() => {
        vi.clearAllMocks();

        // Uçuş listesi için örnek uçuş döndürür.
        vi.mocked(
            getAllFlights,
        ).mockResolvedValue([
            flight,
        ]);

        // ID ile uçuş istendiğinde örnek uçuşu döndürür.
        vi.mocked(
            getFlightById,
        ).mockResolvedValue(
            flight,
        );

        // Uçuşun koltukları istendiğinde örnek koltuğu döndürür.
        vi.mocked(
            getSeatsByFlightId,
        ).mockResolvedValue([
            seat,
        ]);

        // Yeni uçuş oluşturma işleminde örnek uçuş döndürür.
        vi.mocked(
            createFlight,
        ).mockResolvedValue(
            flight,
        );

        /*
         * Giriş yapan kullanıcının biletleri
         * istendiğinde örnek bilet döndürür.
         */
        vi.mocked(
            getMyTickets,
        ).mockResolvedValue([
            ticket,
        ]);
    });

    /*
     * Customer panelindeki Uçuş Ara ve
     * Biletlerim kartlarının doğru sayfalara
     * yönlendirdiğini kontrol eder.
     */
    it(
        "connects customer dashboard cards to search and tickets pages",
        () => {
            storeUser(
                "ROLE_CUSTOMER",
                "customer@test.com",
            );

            renderApp(
                "/customer",
            );

            expect(
                screen.getByRole(
                    "link",
                    {
                        name: /Uçuş Ara/,
                    },
                ),
            ).toHaveAttribute(
                "href",
                "/",
            );

            expect(
                screen.getByRole(
                    "link",
                    {
                        name: /Biletlerim/,
                    },
                ),
            ).toHaveAttribute(
                "href",
                "/my-tickets",
            );
        },
    );

    /*
     * Biletlerim sayfasının artık previewTickets
     * yerine backend API'den gelen gerçek bilet
     * verisini gösterdiğini kontrol eder.
     */
    it(
        "shows the customer ticket page",
        async () => {
            storeUser(
                "ROLE_CUSTOMER",
            );

            renderApp(
                "/my-tickets",
            );

            // Sayfa başlığının açıldığını kontrol eder.
            expect(
                screen.getByRole(
                    "heading",
                    {
                        name: "Biletlerim",
                    },
                ),
            ).toBeInTheDocument();

            /*
             * getMyTickets async çalıştığı için
             * PNR bilgisinin ekrana gelmesini bekler.
             */
            expect(
                await screen.findByText(
                    "PNR123",
                ),
            ).toBeInTheDocument();

            // Biletin koltuk numarasını kontrol eder.
            expect(
                screen.getByText(
                    "12A",
                ),
            ).toBeInTheDocument();

            // Biletin uçuş numarasını kontrol eder.
            expect(
                screen.getByText(
                    "SR101",
                ),
            ).toBeInTheDocument();

            /*
             * MyTicketsPage'in gerçekten
             * bilet API'sini çağırdığını kontrol eder.
             */
            expect(
                getMyTickets,
            ).toHaveBeenCalledOnce();

            /*
             * Biletteki flightId kullanılarak
             * uçuş bilgisinin getirildiğini kontrol eder.
             */
            expect(
                getFlightById,
            ).toHaveBeenCalledWith(
                1,
            );
        },
    );

    /*
     * Customer kullanıcının admin uçuş
     * yönetim ekranına girememesini kontrol eder.
     */
    it(
        "blocks a customer from the admin flight list",
        () => {
            storeUser(
                "ROLE_CUSTOMER",
            );

            renderApp(
                "/admin/flights",
            );

            expect(
                screen.getByRole(
                    "heading",
                    {
                        name: "Yetkisiz Erişim",
                    },
                ),
            ).toBeInTheDocument();
        },
    );

    /*
     * Admin uçuş yönetim sayfasının
     * uçuşları API'den yüklediğini kontrol eder.
     */
    it(
        "loads the admin flight list from the API",
        async () => {
            storeUser(
                "ROLE_ADMIN",
                "admin@flight.com",
            );

            renderApp(
                "/admin/flights",
            );

            expect(
                screen.getByRole(
                    "heading",
                    {
                        name: "Uçuş Yönetimi",
                    },
                ),
            ).toBeInTheDocument();

            expect(
                await screen.findByText(
                    "SR101",
                ),
            ).toBeInTheDocument();

            expect(
                getAllFlights,
            ).toHaveBeenCalledOnce();

            expect(
                screen.getByRole(
                    "link",
                    {
                        name: "Yeni Uçuş Ekle",
                    },
                ),
            ).toHaveAttribute(
                "href",
                "/admin/flights/new",
            );
        },
    );

    /*
     * Uçuşun bütün koltukları müsaitse
     * önce koltukların sonra uçuşun
     * silindiğini kontrol eder.
     */
    it(
        "deletes empty seats before deleting a flight",
        async () => {
            storeUser(
                "ROLE_ADMIN",
                "admin@flight.com",
            );

            vi.spyOn(
                window,
                "confirm",
            ).mockReturnValue(
                true,
            );

            vi.mocked(
                deleteSeat,
            ).mockResolvedValue(
                undefined,
            );

            vi.mocked(
                deleteFlight,
            ).mockResolvedValue(
                undefined,
            );

            renderApp(
                "/admin/flights",
            );

            expect(
                await screen.findByText(
                    "SR101",
                ),
            ).toBeInTheDocument();

            fireEvent.click(
                screen.getByRole(
                    "button",
                    {
                        name: "Sil",
                    },
                ),
            );

            await waitFor(
                () => {
                    expect(
                        getSeatsByFlightId,
                    ).toHaveBeenCalledWith(
                        1,
                    );

                    expect(
                        deleteSeat,
                    ).toHaveBeenCalledWith(
                        13,
                    );

                    expect(
                        deleteFlight,
                    ).toHaveBeenCalledWith(
                        1,
                    );
                },
            );

            expect(
                screen.queryByText(
                    "SR101",
                ),
            ).not.toBeInTheDocument();
        },
    );

    /*
     * Satılmış/dolu koltuğu bulunan
     * uçuşun silinmesini engeller.
     */
    it(
        "does not delete a flight that has an occupied seat",
        async () => {
            storeUser(
                "ROLE_ADMIN",
                "admin@flight.com",
            );

            vi.spyOn(
                window,
                "confirm",
            ).mockReturnValue(
                true,
            );

            vi.mocked(
                getSeatsByFlightId,
            ).mockResolvedValue([
                {
                    ...seat,
                    isAvailable: false,
                },
            ]);

            renderApp(
                "/admin/flights",
            );

            expect(
                await screen.findByText(
                    "SR101",
                ),
            ).toBeInTheDocument();

            fireEvent.click(
                screen.getByRole(
                    "button",
                    {
                        name: "Sil",
                    },
                ),
            );

            expect(
                await screen.findByRole(
                    "alert",
                ),
            ).toHaveTextContent(
                "Bu uçuşta dolu veya satılmış koltuk bulunduğu için uçuş silinmedi.",
            );

            expect(
                deleteSeat,
            ).not.toHaveBeenCalled();

            expect(
                deleteFlight,
            ).not.toHaveBeenCalled();
        },
    );

    /*
     * Yeni uçuş oluşturma formunun
     * açıldığını kontrol eder.
     */
    it(
        "opens the new flight form",
        () => {
            storeUser(
                "ROLE_ADMIN",
            );

            renderApp(
                "/admin/flights/new",
            );

            expect(
                screen.getByRole(
                    "heading",
                    {
                        name: "Yeni Uçuş Ekle",
                    },
                ),
            ).toBeInTheDocument();

            expect(
                screen.getByLabelText(
                    "Uçuş No",
                ),
            ).toHaveValue(
                "",
            );
        },
    );

    /*
     * Formdaki bilgilerle createFlight
     * API fonksiyonunun çağrıldığını kontrol eder.
     */
    it(
        "creates a flight through the API",
        async () => {
            storeUser(
                "ROLE_ADMIN",
            );

            renderApp(
                "/admin/flights/new",
            );

            fireEvent.change(
                screen.getByLabelText(
                    "Uçuş No",
                ),
                {
                    target: {
                        value: "SR999",
                    },
                },
            );

            fireEvent.change(
                screen.getByLabelText(
                    "Kalkış Noktası",
                ),
                {
                    target: {
                        value: "Istanbul",
                    },
                },
            );

            fireEvent.change(
                screen.getByLabelText(
                    "Varış Noktası",
                ),
                {
                    target: {
                        value: "Izmir",
                    },
                },
            );

            fireEvent.change(
                screen.getByLabelText(
                    "Kalkış Zamanı",
                ),
                {
                    target: {
                        value: "2026-08-20T10:00",
                    },
                },
            );

            fireEvent.change(
                screen.getByLabelText(
                    "Varış Zamanı",
                ),
                {
                    target: {
                        value: "2026-08-20T11:00",
                    },
                },
            );

            fireEvent.click(
                screen.getByRole(
                    "button",
                    {
                        name: "Uçuş Oluştur",
                    },
                ),
            );

            await waitFor(
                () => {
                    expect(
                        createFlight,
                    ).toHaveBeenCalledWith({
                        flightNo:
                            "SR999",

                        departurePoint:
                            "Istanbul",

                        destinationPoint:
                            "Izmir",

                        departureTime:
                            "2026-08-20T10:00",

                        destinationTime:
                            "2026-08-20T11:00",
                    });
                },
            );
        },
    );

    /*
     * Uçuş düzenleme ekranının
     * mevcut uçuş bilgisini API'den
     * yüklediğini kontrol eder.
     */
    it(
        "loads the edit flight form from the API",
        async () => {
            storeUser(
                "ROLE_ADMIN",
            );

            renderApp(
                "/admin/flights/1/edit",
            );

            expect(
                screen.getByRole(
                    "heading",
                    {
                        name: "Uçuşu Düzenle",
                    },
                ),
            ).toBeInTheDocument();

            expect(
                await screen.findByDisplayValue(
                    "SR101",
                ),
            ).toBeInTheDocument();

            expect(
                getFlightById,
            ).toHaveBeenCalledWith(
                1,
            );
        },
    );

    /*
     * Koltuk yönetim ekranının seçilen
     * uçuşun koltuklarını API'den
     * yüklediğini kontrol eder.
     */
    it(
        "loads seats for the selected flight from the API",
        async () => {
            storeUser(
                "ROLE_ADMIN",
            );

            renderApp(
                "/admin/flights/1/seats",
            );

            expect(
                screen.getByRole(
                    "heading",
                    {
                        name: "Uçuş Koltukları",
                    },
                ),
            ).toBeInTheDocument();

            expect(
                await screen.findByText(
                    "12A",
                ),
            ).toBeInTheDocument();

            expect(
                getFlightById,
            ).toHaveBeenCalledWith(
                1,
            );

            expect(
                getSeatsByFlightId,
            ).toHaveBeenCalledWith(
                1,
            );
        },
    );
});