import axios from "axios";

import type {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
} from "../types/auth";

/*
 * Backend authentication adresi.
 * Vite proxy kullanacağımız için doğrudan localhost:8080 yazmıyoruz.
 */
const authApi = axios.create({
    baseURL: "/api/v1/auth",
    headers: {
        "Content-Type": "application/json",
    },
});

/*
 * Kullanıcı giriş bilgilerini backend'e gönderir.
 * Backend başarılı olursa JWT token döndürür.
 */
export async function loginRequest(
    data: LoginRequest,
): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>(
        "/login",
        data,
    );

    return response.data;
}

/*
 * Yeni kullanıcı bilgilerini backend'e gönderir.
 * Backend kayıt sonrası JWT token döndürür.
 */
export async function registerRequest(
    data: RegisterRequest,
): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>(
        "/register",
        data,
    );

    return response.data;
}