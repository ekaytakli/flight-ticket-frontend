// Backend'e HTTP isteği göndermek için Axios kullanılır.
import axios from "axios";

// Aktif dili request header'ına eklemek için i18n kullanılır.
import i18n from "../i18n";

import type {
    PaymentRequest,
    PaymentResponse,
} from "../types/payment";

// Ödeme endpointi için ortak Axios istemcisidir.
const paymentApi = axios.create({
    baseURL: "/api/v1/payments",
    headers: {
        "Content-Type": "application/json",
    },
});

// Backend hata mesajlarının doğru dilde gelmesi için dili gönderir.
paymentApi.interceptors.request.use((config) => {
    const language = i18n.language.startsWith("en") ? "en" : "tr";
    config.headers.set("Accept-Language", language);
    return config;
});

// Ödeme bilgilerini backend'e gönderip sonucu döndürür.
export async function createPayment(
    data: PaymentRequest,
): Promise<PaymentResponse> {
    const response = await paymentApi.post<PaymentResponse>("", data);
    return response.data;
}
