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
    // Backend ödeme servisi hazır olduğunda bu adres kullanılacaktır.
    baseURL: "/api/v1/payments",

    // JSON formatında veri gönderileceğini belirtir.
    headers: {
        "Content-Type": "application/json",
    },
});

/*
 * Ödeme işlemini backend'e gönderir.
 *
 * Backend iyzico entegrasyonu hazır olduğunda
 * gerçek ödeme işlemi bu fonksiyon üzerinden yapılacaktır.
 */
export async function createPayment(
    data: PaymentRequest,
): Promise<PaymentResponse> {
    // POST /api/v1/payments isteğini gönderir.
    const response =
        await paymentApi.post<PaymentResponse>(
            "",
            data,
        );

    // Backend'in ödeme sonucunu döndürür.
    return response.data;
}