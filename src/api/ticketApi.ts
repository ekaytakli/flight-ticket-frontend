// Backend'e HTTP isteği göndermek için Axios kullanılır.
import axios from "axios";

// Ticket işlemlerinde kullanılacak veri tiplerini alır.
import type {
    CreateTicketRequest,
    TicketResponse,
} from "../types/ticket";

/*
 * TicketController endpointlerinde kullanılacak
 * ortak Axios yapısını oluşturur.
 */
const ticketApi = axios.create({
    // Backend'deki TicketController'ın temel adresidir.
    baseURL: "/api/v1/tickets",

    // JSON formatında veri kullanılacağını belirtir.
    headers: {
        "Content-Type": "application/json",
    },
});

/*
 * Seçilen uçuş ve koltuk için
 * backend'de gerçek bilet oluşturur.
 */
export async function createTicket(
    data: CreateTicketRequest,
): Promise<TicketResponse> {
    // POST /api/v1/tickets isteğini backend'e gönderir.
    const response =
        await ticketApi.post<TicketResponse>(
            "",
            data,
        );

    // Backend'in oluşturduğu bilet bilgisini döndürür.
    return response.data;
}