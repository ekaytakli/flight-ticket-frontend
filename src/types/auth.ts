/*
 * Sistemde kullanılabilecek kullanıcı rollerini tanımlar.
 * Bu alan yalnızca Admin veya Customer olabilir.
 */
export type UserRole = "ROLE_ADMIN" | "ROLE_CUSTOMER";

/*
 * Giriş yapan kullanıcının temel bilgilerini tutar.
 */
export interface User {
    // Kullanıcının e-posta adresi.
    email: string;

    // Kullanıcının sistemdeki rolü.
    role: UserRole;
}

/*
 * Login işleminde gönderilecek verileri tanımlar.
 */
export interface LoginRequest {
    // Kullanıcının e-posta adresi.
    email: string;

    // Kullanıcının şifresi.
    password: string;
}

/*
 * Kayıt işleminde gönderilecek verileri tanımlar.
 */
export interface RegisterRequest {
    // Kullanıcının adı.
    firstName: string;

    // Kullanıcının soyadı.
    lastName: string;

    // Kullanıcının e-posta adresi.
    email: string;

    // Kullanıcının şifresi.
    password: string;
}

/*
 * Başarılı girişten sonra backend'den dönecek cevabı tanımlar.
 */
export interface AuthResponse {
    // Kullanıcıya verilen JWT token.
    token: string;
}