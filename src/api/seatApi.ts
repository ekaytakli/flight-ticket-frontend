// Backend'e HTTP isteği göndermek için Axios kullanılır.
import axios from "axios";

// Frontend'de kullanılacak koltuk tipini alır.
import type { Seat } from "../types/seat";

/*
 * Backend'in SeatResponseDto üzerinden gönderebileceği
 * ham koltuk verisinin yapısını tanımlar.
 */
interface SeatApiResponse {
    // Koltuğun benzersiz kimliği.
    id: number;

    // Koltuk numarası.
    seatNumber: string;

    // Koltuk tipi.
    seatType: string;

    /*
     * Backend boolean alanını "available"
     * adıyla gönderebileceği için bu alan tanımlanır.
     */
    available?: boolean;

    /*
     * Bazı backend cevaplarında "isAvailable"
     * olarak gelme ihtimali için bunu da destekleriz.
     */
    isAvailable?: boolean;

    // Koltuğun fiyatı.
    price: number;

    // Koltuğun bağlı olduğu uçuş ID'si.
    flightId: number;
}

/*
 * SeatController endpointlerinde kullanılacak
 * ortak Axios yapısını oluşturur.
 */
const seatApi = axios.create({
    // Backend'deki SeatController'ın temel adresidir.
    baseURL: "/api/v1/seats",

    // JSON formatında veri kullanılacağını belirtir.
    headers: {
        "Content-Type": "application/json",
    },
});

/*
 * Backend'den gelen koltuk verisini
 * frontend'in Seat yapısına dönüştürür.
 */
function mapSeat(
    seat: SeatApiResponse,
): Seat {
    return {
        id: seat.id,
        seatNumber: seat.seatNumber,
        seatType: seat.seatType,

        /*
         * Backend "isAvailable" gönderirse onu,
         * yoksa "available" alanını kullanır.
         */
        isAvailable:
            seat.isAvailable ??
            seat.available ??
            false,

        price: seat.price,
        flightId: seat.flightId,
    };
}

/*
 * Seçilen uçuşa ait bütün koltukları backend'den getirir.
 * Hem müsait hem de dolu koltuklar döner.
 */
export async function getSeatsByFlightId(
    flightId: number,
): Promise<Seat[]> {
    // GET /api/v1/seats/flight/{flightId} isteğini gönderir.
    const response =
        await seatApi.get<SeatApiResponse[]>(
            `/flight/${flightId}`,
        );

    // Backend verisini frontend Seat yapısına dönüştürür.
    return response.data.map(mapSeat);
}

/*
 * Seçilen uçuşa ait sadece müsait
 * koltukları backend'den getirir.
 */
export async function getAvailableSeatsByFlightId(
    flightId: number,
): Promise<Seat[]> {
    // GET /api/v1/seats/available/{flightId} isteğini gönderir.
    const response =
        await seatApi.get<SeatApiResponse[]>(
            `/available/${flightId}`,
        );

    // Gelen koltukları frontend Seat yapısına dönüştürür.
    return response.data.map(mapSeat);
}