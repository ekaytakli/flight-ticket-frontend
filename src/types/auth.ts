/*
 * Sistemde kullanılabilecek kullanıcı rollerini tanımlar.
 */
export type UserRole =
    | "ROLE_ADMIN"
    | "ROLE_CUSTOMER";

/*
 * Frontend tarafında oturum açmış kullanıcıyı temsil eder.
 */
export interface User {
    // Kullanıcının e-posta adresi.
    email: string;

    // Kullanıcının sistemdeki rolü.
    role: UserRole;
}

/*
 * Login sırasında backend'e gönderilecek bilgileri tanımlar.
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/*
 * Register sırasında backend'e gönderilecek bilgileri tanımlar.
 */
export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

/*
 * Backend'in login ve register sonrasında
 * döndürdüğü cevabı temsil eder.
 */
export interface AuthResponse {
    // Backend tarafından oluşturulan JWT token.
    token: string;
}

/*
 * Backend JWT token'ı içinde bulunan
 * temel bilgilerin yapısını tanımlar.
 */
export interface JwtPayload {
    // Token'ın ait olduğu kullanıcı e-postasıdır.
    sub: string;

    // Kullanıcının backend tarafından verilen rolleridir.
    roles: string[];

    // Token'ın oluşturulma zamanı.
    iat?: number;

    // Token'ın geçerlilik bitiş zamanı.
    exp?: number;
}