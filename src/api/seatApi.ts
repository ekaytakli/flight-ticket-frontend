import axios from "axios";
import type { Seat } from "../types/seat";

/* Koltuk ekleme ve güncellemede backend'e gönderilen alanlar. */
export type SeatPayload = Omit<Seat, "id">;

interface SeatApiResponse {
    id: number;
    seatNumber: string;
    seatType: string;
    available?: boolean;
    isAvailable?: boolean;
    price: number;
    flightId: number;
}

const seatApi = axios.create({
    baseURL: "/api/v1/seats",
    headers: {
        "Content-Type": "application/json",
    },
});

/* Admin isteklerinde JWT ve seçili dili header'a ekler. */
function getRequestHeaders() {
    const token = localStorage.getItem("token");
    const language = localStorage.getItem("language") ?? "tr";

    return {
        "Accept-Language": language,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

/* Backend koltuk cevabını frontend Seat tipine çevirir. */
function mapSeat(seat: SeatApiResponse): Seat {
    return {
        id: seat.id,
        seatNumber: seat.seatNumber,
        seatType: seat.seatType,
        isAvailable: seat.isAvailable ?? seat.available ?? false,
        price: Number(seat.price),
        flightId: seat.flightId,
    };
}

/* Uçuşun bütün koltuklarını getirir. */
export async function getSeatsByFlightId(flightId: number): Promise<Seat[]> {
    const response = await seatApi.get<SeatApiResponse[]>(`/flight/${flightId}`);
    return response.data.map(mapSeat);
}

/* Uçuşun sadece müsait koltuklarını getirir. */
export async function getAvailableSeatsByFlightId(
    flightId: number,
): Promise<Seat[]> {
    const response = await seatApi.get<SeatApiResponse[]>(`/available/${flightId}`);
    return response.data.map(mapSeat);
}

/* Yeni koltuk oluşturur. */
export async function createSeat(data: SeatPayload): Promise<Seat> {
    /* Java boolean alanı Jackson tarafında "available" olarak okunur. */
    const requestBody = {
        seatNumber: data.seatNumber,
        seatType: data.seatType,
        available: data.isAvailable,
        price: data.price,
        flightId: data.flightId,
    };

    const response = await seatApi.post<SeatApiResponse>(
        "/add/seats",
        requestBody,
        { headers: getRequestHeaders() },
    );

    return mapSeat(response.data);
}

/* Var olan koltuğu günceller. */
export async function updateSeat(
    id: number,
    data: SeatPayload,
): Promise<Seat> {
    /* Java boolean alanı Jackson tarafında "available" olarak okunur. */
    const requestBody = {
        seatNumber: data.seatNumber,
        seatType: data.seatType,
        available: data.isAvailable,
        price: data.price,
        flightId: data.flightId,
    };

    const response = await seatApi.put<SeatApiResponse>(
        `/update/seats/${id}`,
        requestBody,
        { headers: getRequestHeaders() },
    );

    return mapSeat(response.data);
}

/* Koltuğu backend'den siler. */
export async function deleteSeat(id: number): Promise<void> {
    await seatApi.delete(`/${id}`, {
        headers: getRequestHeaders(),
    });
}
