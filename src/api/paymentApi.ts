// Backend'e HTTP isteği göndermek için Axios kullanılır.
import axios from "axios";

// Ödeme isteği ve cevabında kullanılacak TypeScript tiplerini alır.
import type {
    PaymentRequest,
    PaymentResponse,
} from "../types/payment";

/*
 * Ödeme endpointlerinde kullanılacak
 * ortak Axios yapısını oluşturur.
 */
const paymentApi = axios.create({
    // Backend ödeme servisinin temel adresidir.
    baseURL: "/api/v1/payments",

    // JSON formatında veri gönderileceğini belirtir.
    headers: {
        "Content-Type": "application/json",
    },
});

/*
 * Kullanıcı giriş yapmışsa JWT token'ını,
 * ayrıca seçili dil bilgisini request header'ına ekler.
 *
 * Kullanıcı giriş yapmamışsa Authorization header'ı
 * gönderilmez ve public ödeme akışı çalışmaya devam eder.
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
 * Ödeme işlemini backend'e gönderir.
 *
 * Kullanıcı giriş yaptıysa JWT de ödeme isteğiyle
 * birlikte backend'e gönderilir.
 */
export async function createPayment(
    data: PaymentRequest,
): Promise<PaymentResponse> {
    // POST /api/v1/payments isteğini gönderir.
    const response =
        await paymentApi.post<PaymentResponse>(
            "",
            data,
            {
                headers: getRequestHeaders(),
            },
        );

    // Backend'in ödeme sonucunu döndürür.
    return response.data;
}