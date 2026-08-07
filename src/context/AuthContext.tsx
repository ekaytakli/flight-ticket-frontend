import {
    createContext,
    useCallback,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import {
    loginRequest,
    registerRequest,
} from "../api/authApi";

import type {
    LoginRequest,
    RegisterRequest,
    User,
} from "../types/auth";

/*
 * Context üzerinden paylaşılacak kullanıcı ve oturum bilgilerini tanımlar.
 */
interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (data: LoginRequest) => Promise<User>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
}

/* Uygulamanın ortak authentication alanını oluşturur. */
export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

/* AuthProvider tarafından sarılacak React bileşenlerini temsil eder. */
interface AuthProviderProps {
    children: ReactNode;
}

/*
 * localStorage içindeki kullanıcı bilgisini okur.
 * Geçersiz veri varsa oturum bilgilerini temizler.
 */
function readStoredUser(): User | null {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser) as User;
    } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return null;
    }
}

/*
 * Kullanıcı ve oturum bilgilerini bütün uygulamaya sağlar.
 */
export function AuthProvider({
                                 children,
                             }: AuthProviderProps) {
    /*
     * Daha önce giriş yapılmışsa token localStorage'dan alınır.
     */
    const [token, setToken] = useState<string | null>(() =>
        localStorage.getItem("token"),
    );

    /*
     * Kayıtlı kullanıcı bilgisi uygulama açılışında geri yüklenir.
     */
    const [user, setUser] = useState<User | null>(
        readStoredUser,
    );

    /*
     * Kullanıcı bilgilerini gerçek backend'e göndererek giriş yapar.
     */
    const login = useCallback(
        async (data: LoginRequest): Promise<User> => {
            /*
             * Backend'e POST /api/v1/auth/login isteği gönderilir.
             * Başarılı olursa gerçek JWT token döner.
             */
            const response = await loginRequest(data);

            /*
             * Backend'in mevcut sürümünde JWT Role claim'i
             * herkese Admin olarak yazıldığı için rol geçici olarak
             * sistemdeki varsayılan admin e-postasına göre belirlenir.
             *
             * Şifre doğrulaması yine backend tarafından yapılmaktadır.
             */
            const loggedInUser: User =
                data.email.trim().toLowerCase() ===
                "admin@flight.com"
                    ? {
                        email: data.email.trim(),
                        role: "ROLE_ADMIN",
                    }
                    : {
                        email: data.email.trim(),
                        role: "ROLE_CUSTOMER",
                    };

            /*
             * Backend'den gelen gerçek token ve kullanıcı bilgisi
             * state'e kaydedilir.
             */
            setToken(response.token);
            setUser(loggedInUser);

            /*
             * Sayfa yenilendiğinde oturum kaybolmasın diye
             * localStorage'a da kaydedilir.
             */
            localStorage.setItem(
                "token",
                response.token,
            );

            localStorage.setItem(
                "user",
                JSON.stringify(loggedInUser),
            );

            return loggedInUser;
        },
        [],
    );

    /*
     * Yeni kullanıcı bilgilerini gerçek backend'e gönderir.
     */
    const register = useCallback(
        async (
            data: RegisterRequest,
        ): Promise<void> => {
            /*
             * Backend'e POST /api/v1/auth/register isteği gönderilir.
             *
             * Backend kullanıcıyı veritabanına kaydeder ve
             * varsayılan olarak Customer rolü verir.
             */
            await registerRequest(data);
        },
        [],
    );

    /*
     * Kullanıcı oturumunu kapatır.
     */
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);

        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }, []);

    /*
     * Context üzerinden paylaşılacak değerleri tek nesnede toplar.
     */
    const value = useMemo(
        () => ({
            user,
            token,
            isAuthenticated: Boolean(user && token),
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
     * Authentication verilerini alt componentlere aktarır.
     */
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}