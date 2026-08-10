import type { Flight } from "../types/flight";
import type { Seat } from "../types/seat";
import type { Ticket } from "../types/ticket";

/* Backend hazır olana kadar yönetim ekranlarının görünümünü dolduran örnek uçuşlar. */
export const previewFlights: Flight[] = [
    {
        id: 1,
        flightNo: "SR101",
        departurePoint: "Istanbul",
        destinationPoint: "Ankara",
        departureTime: "2026-08-12T09:30",
        destinationTime: "2026-08-12T10:35",
    },
    {
        id: 2,
        flightNo: "SR205",
        departurePoint: "Izmir",
        destinationPoint: "Antalya",
        departureTime: "2026-08-12T13:15",
        destinationTime: "2026-08-12T14:25",
    },
    {
        id: 3,
        flightNo: "SR330",
        departurePoint: "Ankara",
        destinationPoint: "Trabzon",
        departureTime: "2026-08-13T16:00",
        destinationTime: "2026-08-13T17:20",
    },
];

/* Koltuk yönetimi sayfasında gösterilecek geçici koltuk verileri. */
export const previewSeatsByFlight: Record<number, Seat[]> = {
    1: [
        { id: 11, seatNumber: "1A", seatType: "business", isAvailable: true },
        { id: 12, seatNumber: "1B", seatType: "business", isAvailable: false },
        { id: 13, seatNumber: "12A", seatType: "economy", isAvailable: true },
        { id: 14, seatNumber: "12B", seatType: "economy", isAvailable: true },
    ],
    2: [
        { id: 21, seatNumber: "2A", seatType: "business", isAvailable: true },
        { id: 22, seatNumber: "8C", seatType: "economy", isAvailable: false },
        { id: 23, seatNumber: "9A", seatType: "economy", isAvailable: true },
    ],
    3: [
        { id: 31, seatNumber: "3A", seatType: "business", isAvailable: false },
        { id: 32, seatNumber: "15A", seatType: "economy", isAvailable: true },
        { id: 33, seatNumber: "15B", seatType: "economy", isAvailable: true },
    ],
};

/* Bilet servisi bağlanınca bu örnek kayıtların yerini backend verileri alacak. */
export const previewTickets: Ticket[] = [
    {
        id: 1,
        pnrKodu: "SKY7F2",
        date: "2026-08-10",
        flight: previewFlights[0],
        seat: previewSeatsByFlight[1][2],
    },
    {
        id: 2,
        pnrKodu: "SKY9K4",
        date: "2026-08-10",
        flight: previewFlights[1],
        seat: previewSeatsByFlight[2][0],
    },
];
