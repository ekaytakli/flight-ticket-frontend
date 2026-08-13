import axios from "axios";
import type { Flight } from "../types/flight";

/* Uçuş ekleme ve güncellemede backend'e gönderilen alanlar. */
export type FlightPayload = Omit<Flight, "id">;

const flightApi = axios.create({
    baseURL: "/rest/api/flight",
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

/* Bütün uçuşları backend'den getirir. */
export async function getAllFlights(): Promise<Flight[]> {
    const response = await flightApi.get<Flight[]>("/list-all-flights");
    return response.data;
}

/* ID ile tek uçuş getirir. */
export async function getFlightById(id: number): Promise<Flight> {
    const response = await flightApi.get<Flight>(`/flights-${id}`);
    return response.data;
}

/* datetime-local değerini backend'in beklediği yyyy-MM-dd HH:mm formatına çevirir. */
function toBackendFlightPayload(data: FlightPayload): FlightPayload {
    return {
        ...data,
        departureTime: data.departureTime.replace("T", " "),
        destinationTime: data.destinationTime.replace("T", " "),
    };
}

/* Yeni uçuş oluşturur. */
export async function createFlight(data: FlightPayload): Promise<Flight> {
    const response = await flightApi.post<Flight>(
        "/add-flight",
        toBackendFlightPayload(data),
        { headers: getRequestHeaders() },
    );

    return response.data;
}

/* Var olan uçuşu günceller. */
export async function updateFlight(
    id: number,
    data: FlightPayload,
): Promise<Flight> {
    const response = await flightApi.put<Flight>(
        `/save-flight-${id}`,
        toBackendFlightPayload(data),
        { headers: getRequestHeaders() },
    );

    return response.data;
}

/* Uçuşu backend'den siler. */
export async function deleteFlight(id: number): Promise<void> {
    await flightApi.delete(`/delete-flight-${id}`, {
        headers: getRequestHeaders(),
    });
}
