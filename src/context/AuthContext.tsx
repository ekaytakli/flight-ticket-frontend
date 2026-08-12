// Authentication bilgilerini uygulama genelinde yönetmek için React araçlarını alır.
import {
    createContext,
    useCallback,
    useMemo,
    useState,
    type ReactNode,
} from "react";

// Backend'e login ve register isteği gönderen fonksiyonları alır.
import {
    loginRequest,
    registerRequest,
} from "../api/authApi";

// Authentication işlemlerinde kullanılan TypeScript tiplerini alır.
import type {
    JwtPayload,
    LoginRequest,
    RegisterRequest,
    User,
    UserRole,
} from "../types/auth";

/*
 * AuthContext üzerinden bütün uygulamayla
 * paylaşılacak oturum bilgilerinin yapısını tanımlar.
 */
interface AuthContextType {
    // Giriş yapan kullanıcıyı tutar.
    user: User | null;

    // Backend'den alınan JWT token'ı tutar.
    token: string | null;

    // Kullanıcının giriş yapıp yapmadığını belirtir.
    isAuthenticated: boolean;

    // Login işlemini gerçekleştirir.
    login: (data: LoginRequest) => Promise<User>;

    // Register işlemini gerçekleştirir.
    register: (data: RegisterRequest) => Promise<void>;

    // Kullanıcının oturumunu kapatır.
    logout: () => void;
}

/*
 * Authentication bilgilerini componentler arasında
 * paylaşmak için ortak Context oluşturur.
 */
export const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined,
    );

/*
 * AuthProvider içinde gösterilecek
 * React componentlerini temsil eder.
 */
interface AuthProviderProps {
    children: ReactNode;
}

/*
 * JWT token'ın payload bölümünü okuyarak
 * backend'in token içine koyduğu bilgileri elde eder.
 */
function decodeJwtPayload(
    token: string,
): JwtPayload | null {
    try {
        // JWT'nin payload kısmını alır.
        const payload = token.split(".")[1];

        if (!payload) {
            return null;
        }

        /*
         * JWT Base64Url formatında olduğu için
         * normal Base64 formatına dönüştürür.
         */
        const base64 = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        // Eksik Base64 karakterlerini tamamlar.
        const paddedBase64 =
            base64.padEnd(
                base64.length +
                ((4 - (base64.length % 4)) % 4),
                "=",
            );

        // Payload içeriğini çözüp JavaScript nesnesine dönüştürür.
        const decodedPayload = decodeURIComponent(
            Array.from(atob(paddedBase64))
                .map(
                    (character) =>
                        `%${character
                            .charCodeAt(0)
                            .toString(16)
                            .padStart(2, "0")}`,
                )
                .join(""),
        );

        return JSON.parse(
            decodedPayload,
        ) as JwtPayload;
    } catch {
        // Token geçersizse null döndürür.
        return null;
    }
}

/*
 * JWT içindeki role bilgisinden frontend
 * User nesnesini oluşturur.
 */
function createUserFromToken(
    token: string,
): User | null {
    // JWT içindeki bilgileri okur.
    const payload = decodeJwtPayload(token);

    if (!payload?.sub || !payload.roles?.length) {
        return null;
    }

    /*
     * Backend'den gelen roller arasından
     * frontend'in desteklediği rolü bulur.
     */
    const role = payload.roles.find(
        (item) =>
            item === "ROLE_ADMIN" ||
            item === "ROLE_CUSTOMER",
    ) as UserRole | undefined;

    // Geçerli bir rol yoksa kullanıcı oluşturulmaz.
    if (!role) {
        return null;
    }

    // Token içindeki email ve role ile kullanıcı oluşturur.
    return {
        email: payload.sub,
        role,
    };
}

/*
 * localStorage içindeki kullanıcı bilgisini okur.
 * Veri geçersizse oturum bilgilerini temizler.
 */
function readStoredUser(): User | null {
    const storedUser =
        localStorage.getItem("user");

    if (!storedUser) {
        return null;
    }

    try {
        // JSON olarak kayıtlı kullanıcıyı tekrar nesneye çevirir.
        return JSON.parse(storedUser) as User;
    } catch {
        // Bozuk oturum bilgilerini temizler.
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        return null;
    }
}

/*
 * Kullanıcı ve oturum bilgilerini
 * bütün uygulamaya sağlayan ana Provider'dır.
 */
export function AuthProvider({
                                 children,
                             }: AuthProviderProps) {
    // Daha önce giriş yapılmışsa token'ı tarayıcıdan yükler.
    const [token, setToken] = useState<
        string | null
    >(() => localStorage.getItem("token"));

    // Daha önce giriş yapan kullanıcıyı geri yükler.
    const [user, setUser] =
        useState<User | null>(readStoredUser);

    /*
     * Kullanıcının email ve şifresini backend'e gönderir.
     * Başarılı girişte backend gerçek JWT token döndürür.
     */
    const login = useCallback(
        async (
            data: LoginRequest,
        ): Promise<User> => {
            // authApi üzerinden backend login endpointini çağırır.
            const response =
                await loginRequest(data);

            /*
             * Backend'in oluşturduğu JWT içinden
             * gerçek kullanıcı ve rol bilgisini çıkarır.
             */
            const loggedInUser =
                createUserFromToken(
                    response.token,
                );

            // Token içinde geçerli kullanıcı bilgisi yoksa işlemi durdurur.
            if (!loggedInUser) {
                throw new Error(
                    "Token içindeki kullanıcı bilgisi geçersiz.",
                );
            }

            // Token ve kullanıcıyı React state'e kaydeder.
            setToken(response.token);
            setUser(loggedInUser);

            // Sayfa yenilendiğinde oturum kaybolmasın diye token'ı saklar.
            localStorage.setItem(
                "token",
                response.token,
            );

            // Kullanıcı bilgisini JSON olarak tarayıcıya kaydeder.
            localStorage.setItem(
                "user",
                JSON.stringify(
                    loggedInUser,
                ),
            );

            // LoginPage rol bilgisine göre yönlendirme yapabilsin diye kullanıcıyı döndürür.
            return loggedInUser;
        },
        [],
    );

    /*
     * Yeni kullanıcı bilgilerini backend'e
     * göndererek kayıt işlemini gerçekleştirir.
     */
    const register = useCallback(
        async (
            data: RegisterRequest,
        ): Promise<void> => {
            // authApi üzerinden backend register endpointini çağırır.
            await registerRequest(data);
        },
        [],
    );

    /*
     * Kullanıcı çıkış yaptığında hem state'i
     * hem de localStorage bilgilerini temizler.
     */
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);

        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }, []);

    /*
     * Context üzerinden paylaşılacak
     * authentication bilgilerini tek nesnede toplar.
     */
    const value = useMemo(
        () => ({
            user,
            token,

            // Kullanıcı ve token varsa giriş yapılmış kabul edilir.
            isAuthenticated: Boolean(
                user && token,
            ),

            login,
            register,
            logout,
        }),
        [
            user,
            token,
            login,
            register,
            logout,
        ],
    );

    /*
     * Authentication bilgilerini Provider
     * altındaki bütün componentlere aktarır.
     */
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}