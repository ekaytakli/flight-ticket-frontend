// Backend'e HTTP istekleri göndermek için Axios'u kullanıyoruz.
import axios from "axios";

// Login, register ve backend cevaplarının veri tiplerini alıyoruz.
import type {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
} from "../types/auth";

// Login ve register isteklerinde kullanılacak ortak Axios yapısını oluşturuyoruz.
// /api ile başlayan istekler Vite proxy üzerinden backend'e yönlendirilir.
const authApi = axios.create({
    baseURL: "/api/v1/auth",

    // Backend'e JSON formatında veri gönderdiğimizi belirtir.
    headers: {
        "Content-Type": "application/json",
    },
});

// Kullanıcının email ve şifresini backend'e göndererek giriş yapmasını sağlar.
export async function loginRequest(
    data: LoginRequest,
): Promise<AuthResponse> {

    // POST isteği ile verileri /api/v1/auth/login adresine gönderir.
    // Backend'den AuthResponse tipinde, yani token içeren cevap beklenir.
    const response = await authApi.post<AuthResponse>(
        "/login",
        data,
    );

    // Axios cevabının içindeki asıl backend verisini döndürür.
    return response.data;
}

// Yeni kullanıcının kayıt bilgilerini backend'e gönderir.
export async function registerRequest(
    data: RegisterRequest,
): Promise<AuthResponse> {

    // POST isteği ile kayıt bilgilerini /api/v1/auth/register adresine gönderir.
    const response = await authApi.post<AuthResponse>(
        "/register",
        data,
    );

    // Backend'in gönderdiği asıl cevabı döndürür.
    return response.data;
}