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
     * Backend boolean alanını "available"
     * adıyla gönderebileceği için desteklenir.
     */
    available?: boolean;

    /*
     * Bazı backend cevaplarında "isAvailable"
     * olarak gelebileceği için bunu da destekler.
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
 * Admin işlemlerinde kullanılacak JWT token ve
 * seçili dil bilgisini header olarak hazırlar.
 */
function getRequestHeaders() {
    // Giriş yapan kullanıcının JWT token'ını alır.
    const token = localStorage.getItem("token");

    // Kullanıcının seçtiği dili alır.
    const language =
        localStorage.getItem("language") ?? "tr";

    return {
        // Backend mesajlarının seçili dilde gelmesini sağlar.
        "Accept-Language": language,

        // Token varsa Authorization header'ına ekler.
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

        // Fiyatı kesin olarak number tipine dönüştürür.
        price: Number(seat.price),

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
        await seatApi.get<
            SeatApiResponse[]
        >(
            `/flight/${flightId}`,
        );

    // Backend verisini frontend Seat yapısına dönüştürür.
    return response.data.map(
        mapSeat,
    );
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
        await seatApi.get<
            SeatApiResponse[]
        >(
            `/available/${flightId}`,
        );

    // Gelen koltukları frontend Seat yapısına dönüştürür.
    return response.data.map(
        mapSeat,
    );
}

/*
 * Admin tarafından yeni koltuk oluşturur.
 */
export async function createSeat(
    data: SeatPayload,
): Promise<Seat> {
    /*
     * Frontend'deki isAvailable alanını
     * backend'in beklediği available alanına dönüştürür.
     */
    const requestBody = {
        seatNumber:
        data.seatNumber,

        seatType:
        data.seatType,

        available:
        data.isAvailable,

        price:
        data.price,

        flightId:
        data.flightId,
    };

    // POST /api/v1/seats/add/seats isteğini gönderir.
    const response =
        await seatApi.post<
            SeatApiResponse
        >(
            "/add/seats",

            requestBody,

            // Admin JWT token'ını request header'ına ekler.
            {
                headers:
                    getRequestHeaders(),
            },
        );

    // Backend cevabını frontend Seat modeline dönüştürür.
    return mapSeat(
        response.data,
    );
}

/*
 * Admin tarafından var olan koltuğu günceller.
 */
export async function updateSeat(
    id: number,
    data: SeatPayload,
): Promise<Seat> {
    /*
     * Frontend'deki isAvailable alanını
     * backend'in beklediği available alanına dönüştürür.
     */
    const requestBody = {
        seatNumber:
        data.seatNumber,

        seatType:
        data.seatType,

        available:
        data.isAvailable,

        price:
        data.price,

        flightId:
        data.flightId,
    };

    // PUT /api/v1/seats/update/seats/{id} isteğini gönderir.
    const response =
        await seatApi.put<
            SeatApiResponse
        >(
            `/update/seats/${id}`,

            requestBody,

            // Admin JWT token'ını request header'ına ekler.
            {
                headers:
                    getRequestHeaders(),
            },
        );

    // Güncellenmiş koltuk bilgisini frontend modeline dönüştürür.
    return mapSeat(
        response.data,
    );
}

/*
 * Admin tarafından koltuğu backend'den siler.
 */
export async function deleteSeat(
    id: number,
): Promise<void> {
    // DELETE /api/v1/seats/{id} isteğini gönderir.
    await seatApi.delete(
        `/${id}`,
        {
            // Silme işlemi admin yetkisi gerektirdiği için JWT gönderilir.
            headers:
                getRequestHeaders(),
        },
    );
}