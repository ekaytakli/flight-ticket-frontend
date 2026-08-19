// Backend'e HTTP isteği göndermek için Axios kullanılır.
import axios from "axios";

// Frontend'de kullanılacak koltuk tipini alır.
import type { Seat } from "../types/seat";

/*
 * Admin koltuk ekleme ve güncelleme işlemlerinde
 * backend'e gönderilecek alanları tanımlar.
 *
 * id backend tarafından oluşturulduğu için gönderilmez.
 */
export type SeatPayload = Omit<Seat, "id">;

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
     * Backend boolean alanını bazı cevaplarda
     * "available" adıyla gönderebilir.
     */
    available?: boolean;

    /*
     * Bazı cevaplarda "isAvailable"
     * adıyla gelme ihtimalini de destekler.
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

    headers: {
        "Content-Type": "application/json",
    },
});

/*
 * Admin işlemlerinde kullanılacak JWT token ve
 * seçili dil bilgisini header olarak hazırlar.
 */
function getRequestHeaders() {
    const token = localStorage.getItem("token");
    const language =
        localStorage.getItem("language") ?? "tr";

    return {
        "Accept-Language": language,

        ...(token
            ? {
                Authorization: `Bearer ${token}`,
            }
            : {}),
    };
}

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

        price: Number(seat.price),
        flightId: seat.flightId,
    };
}

/*
 * Seçilen uçuşa ait bütün koltukları backend'den getirir.
 */
export async function getSeatsByFlightId(
    flightId: number,
): Promise<Seat[]> {
    const response =
        await seatApi.get<SeatApiResponse[]>(
            `/flight/${flightId}`,
        );

    return response.data.map(mapSeat);
}

/*
 * Seçilen uçuşa ait sadece müsait
 * koltukları backend'den getirir.
 */
export async function getAvailableSeatsByFlightId(
    flightId: number,
): Promise<Seat[]> {
    const response =
        await seatApi.get<SeatApiResponse[]>(
            `/available/${flightId}`,
        );

    return response.data.map(mapSeat);
}

/*
 * Admin tarafından yeni koltuk oluşturur.
 */
export async function createSeat(
    data: SeatPayload,
): Promise<Seat> {
    /*
     * Backend tarafındaki boolean alan Jackson tarafından
     * "available" adıyla okunabildiği için burada
     * frontend'deki isAvailable değeri available olarak gönderilir.
     */
    const requestBody = {
        seatNumber: data.seatNumber,
        seatType: data.seatType,
        available: data.isAvailable,
        price: data.price,
        flightId: data.flightId,
    };

    // POST /api/v1/seats/add/seats
    const response =
        await seatApi.post<SeatApiResponse>(
            "/add/seats",
            requestBody,
            {
                headers: getRequestHeaders(),
            },
        );

    return mapSeat(response.data);
}

/*
 * Admin tarafından var olan koltuğu günceller.
 */
export async function updateSeat(
    id: number,
    data: SeatPayload,
): Promise<Seat> {
    /*
     * Güncellemede de boolean değer
     * backend'e available adıyla gönderilir.
     */
    const requestBody = {
        seatNumber: data.seatNumber,
        seatType: data.seatType,
        available: data.isAvailable,
        price: data.price,
        flightId: data.flightId,
    };

    // PUT /api/v1/seats/update/seats/{id}
    const response =
        await seatApi.put<SeatApiResponse>(
            `/update/seats/${id}`,
            requestBody,
            {
                headers: getRequestHeaders(),
            },
        );

    return mapSeat(response.data);
}

/*
 * Admin tarafından koltuğu backend'den siler.
 */
export async function deleteSeat(
    id: number,
): Promise<void> {
    await seatApi.delete(
        `/${id}`,
        {
            headers: getRequestHeaders(),
        },
    );
}