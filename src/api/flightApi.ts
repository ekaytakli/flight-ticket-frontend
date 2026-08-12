// Backend'e HTTP isteği göndermek için Axios kullanılır.
import axios from "axios";

// Backend'den gelecek uçuş verisinin tipini alır.
import type { Flight } from "../types/flight";

/*
 * FlightController endpointlerinde kullanılacak
 * ortak Axios yapısını oluşturur.
 */
const flightApi = axios.create({
    // Backend'deki FlightController'ın temel adresidir.
    baseURL: "/rest/api/flight",

    // JSON formatında veri kullanılacağını belirtir.
    headers: {
        "Content-Type": "application/json",
    },
});

/*
 * Backend'deki bütün uçuşları getirir.
 */
export async function getAllFlights(): Promise<Flight[]> {
    // GET /rest/api/flight/list-all-flights isteği gönderir.
    const response = await flightApi.get<Flight[]>(
        "/list-all-flights",
    );

    // Backend'den gelen uçuş listesini döndürür.
    return response.data;
}

/*
 * ID'si verilen tek bir uçuşu backend'den getirir.
 */
export async function getFlightById(
    id: number,
): Promise<Flight> {
    // GET /rest/api/flight/flights-{id} isteği gönderir.
    const response = await flightApi.get<Flight>(
        `/flights-${id}`,
    );

    // Backend'den gelen uçuş bilgisini döndürür.
    return response.data;
}