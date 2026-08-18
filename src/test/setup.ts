import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import {
    afterEach,
    beforeEach,
} from "vitest";

import i18n from "../i18n";

/*
 * Vitest ortamında localStorage her zaman
 * tarayıcıdaki gibi hazır olmayabilir.
 *
 * Bu nedenle testlerde kullanılmak üzere
 * basit bir localStorage taklidi oluşturulur.
 */
const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        /*
         * Verilen anahtara ait değeri döndürür.
         */
        getItem(key: string) {
            return store[key] ?? null;
        },

        /*
         * Anahtar ve değeri localStorage'a kaydeder.
         */
        setItem(
            key: string,
            value: string,
        ) {
            store[key] = String(value);
        },

        /*
         * Belirtilen anahtarı siler.
         */
        removeItem(key: string) {
            delete store[key];
        },

        /*
         * Bütün localStorage verilerini temizler.
         */
        clear() {
            store = {};
        },

        /*
         * localStorage içindeki kayıt sayısını döndürür.
         */
        get length() {
            return Object.keys(store).length;
        },

        /*
         * Verilen sıradaki anahtarın adını döndürür.
         */
        key(index: number) {
            return (
                Object.keys(store)[index] ??
                null
            );
        },
    };
})();

/*
 * Oluşturduğumuz localStorage mock'unu
 * test ortamındaki window nesnesine ekler.
 */
Object.defineProperty(
    window,
    "localStorage",
    {
        value: localStorageMock,
        writable: true,
        configurable: true,
    },
);

/*
 * globalThis.localStorage kullanan kodların da
 * aynı mock'a erişmesini sağlar.
 */
Object.defineProperty(
    globalThis,
    "localStorage",
    {
        value: localStorageMock,
        writable: true,
        configurable: true,
    },
);

/*
 * Her test tamamlandıktan sonra
 * render edilen React bileşenlerini temizler.
 */
afterEach(() => {
    cleanup();
});

/*
 * Her test başlamadan önce:
 *
 * 1. localStorage temizlenir.
 * 2. Uygulamanın dili tekrar Türkçe yapılır.
 *
 * Böylece bir test diğer testi etkilemez.
 */
beforeEach(async () => {
    localStorage.clear();

    await i18n.changeLanguage(
        "tr",
    );
});