import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

/*
 * AuthContext'e kolay erişmek için oluşturulan custom hook'tur.
 */
export function useAuth() {

    /* AuthContext içindeki authentication bilgilerini alır. */
    const context = useContext(AuthContext);

    /*
     * Hook'un yalnızca AuthProvider içinde kullanılmasını sağlar.
     * Aksi durumda geliştiriciye hata mesajı gösterilir.
     */
    if (!context) {
        throw new Error("useAuth, AuthProvider içinde kullanılmalıdır.");
    }

    /* Context verilerini kullanıma hazır olarak döndürür. */
    return context;
}