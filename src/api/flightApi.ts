// Backend'e HTTP isteği göndermek için Axios kullanılır.
import axios from "axios";

// Backend'den gelecek uçuş verisinin tipini alır.
import type { Flight } from "../types/flight";

/*
 * Admin uçuş ekleme ve güncelleme işlemlerinde
 * backend'e gönderilecek alanları tanımlar.
 *
 * id backend tarafından oluşturulduğu için gönderilmez.
 */
export type FlightPayload = Omit<Flight, "id">;

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
        // Backend hata/mesajlarının seçili dilde gelmesini sağlar.
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
 * Backend'deki bütün uçuşları getirir.
 */
export async function getAllFlights(): Promise<Flight[]> {
    // GET /rest/api/flight/list-all-flights isteği gönderir.
    const response =
        await flightApi.get<Flight[]>(
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
    const response =
        await flightApi.get<Flight>(
            `/flights-${id}`,
        );

    // Backend'den gelen uçuş bilgisini döndürür.
    return response.data;
}

/*
 * datetime-local alanından gelen "T" karakterini
 * backend'in beklediği boşluk formatına dönüştürür.
 */
function toBackendFlightPayload(
    data: FlightPayload,
): FlightPayload {
    return {
        ...data,

        // Örneğin 2026-08-18T10:30 değerini
        // 2026-08-18 10:30 formatına çevirir.
        departureTime:
            data.departureTime.replace(
                "T",
                " ",
            ),

        destinationTime:
            data.destinationTime.replace(
                "T",
                " ",
            ),
    };
}

/*
 * Admin tarafından yeni uçuş oluşturur.
 */
export async function createFlight(
    data: FlightPayload,
): Promise<Flight> {
    // POST /rest/api/flight/add-flight isteğini gönderir.
    const response =
        await flightApi.post<Flight>(
            "/add-flight",

            // Tarih formatını backend'e uygun hale getirir.
            toBackendFlightPayload(data),

            // Admin JWT token'ını request header'ına ekler.
            {
                headers:
                    getRequestHeaders(),
            },
        );

    // Backend'in oluşturduğu uçuşu döndürür.
    return response.data;
}

/*
 * Admin tarafından var olan uçuşu günceller.
 */
export async function updateFlight(
    id: number,
    data: FlightPayload,
): Promise<Flight> {
    // PUT /rest/api/flight/save-flight-{id} isteğini gönderir.
    const response =
        await flightApi.put<Flight>(
            `/save-flight-${id}`,

            // Tarih formatını backend'e uygun hale getirir.
            toBackendFlightPayload(data),

            // Admin JWT token'ını request header'ına ekler.
            {
                headers:
                    getRequestHeaders(),
            },
        );

    // Güncellenmiş uçuş bilgisini döndürür.
    return response.data;
}

/*
 * Admin tarafından uçuşu backend'den siler.
 */
export async function deleteFlight(
    id: number,
): Promise<void> {
    // DELETE /rest/api/flight/delete-flight-{id} isteğini gönderir.
    await flightApi.delete(
        `/delete-flight-${id}`,
        {
            // Silme işlemi admin yetkisi gerektirdiği için JWT gönderilir.
            headers:
                getRequestHeaders(),
        },
    );
}