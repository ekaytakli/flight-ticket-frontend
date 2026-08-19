import axios from "axios";

import type {
    CreateTicketRequest,
    TicketResponse,
} from "../types/ticket";

/*
 * TicketController endpointlerinde kullanılacak
 * ortak Axios yapısını oluşturur.
 */
const ticketApi = axios.create({
    baseURL: "/api/v1/tickets",

    headers: {
        "Content-Type": "application/json",
    },
});

/*
 * Giriş yapan kullanıcının JWT token'ını
 * request header'ına ekler.
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
 * Seçilen uçuş ve koltuk için
 * backend'de yeni bilet oluşturur.
 */
export async function createTicket(
    data: CreateTicketRequest,
): Promise<TicketResponse> {
    const response =
        await ticketApi.post<TicketResponse>(
            "",
            data,
            {
                headers: getRequestHeaders(),
            },
        );

    return response.data;
}

/*
 * Giriş yapan kullanıcının
 * kendi biletlerini backend'den getirir.
 */
export async function getMyTickets(): Promise<
    TicketResponse[]
> {
    const response =
        await ticketApi.get<TicketResponse[]>(
            "/my-tickets",
            {
                headers: getRequestHeaders(),
            },
        );

    return response.data;
}