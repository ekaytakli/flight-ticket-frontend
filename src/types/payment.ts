/*
 * Ödeme işleminin sonucunda kullanılabilecek
 * durumları tanımlar.
 */
export type PaymentStatus =
    | "SUCCESS"
    | "FAILED";

/*
 * Frontend'in backend ödeme servisine
 * göndereceği bilgileri tanımlar.
 */
export interface PaymentRequest {
    // Satın alınacak uçuşun ID bilgisidir.
    flightId: number;

    // Satın alınacak koltuğun ID bilgisidir.
    seatId: number;

    // Ödenecek toplam tutardır.
    amount: number;

    // Yolcu bilgileri.
    firstName: string;
    lastName: string;
    email: string;
    phone: string;

    // Sandbox ödeme için kart bilgileri.
    cardHolderName: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
}

/*
 * Backend ödeme işlemini tamamladıktan sonra
 * frontend'e dönecek cevabı tanımlar.
 */
export interface PaymentResponse {
    // Ödeme işleminin sonucunu belirtir.
    status: PaymentStatus;

    // Ödeme sisteminin oluşturduğu işlem ID'sidir.
    paymentId?: string;

    // Başarılı ödeme sonrasında oluşabilecek PNR kodudur.
    pnrKodu?: string;

    // Başarı veya hata mesajıdır.
    message?: string;
}