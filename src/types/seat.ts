/*
 * Backend'deki SeatResponseDto'dan gelen
 * koltuk verisinin frontend tarafındaki yapısını tanımlar.
 */
export interface Seat {
    // Koltuğun benzersiz kimliği.
    id: number;

    // Koltuk numarası. Örnek: 12A
    seatNumber: string;

    // Koltuk tipi. Örnek: Window, Middle, Aisle
    seatType: string;

    // Koltuğun müsait olup olmadığını belirtir.
    isAvailable: boolean;

    // Koltuğun fiyatını tutar.
    price: number;

    // Koltuğun bağlı olduğu uçuşun ID bilgisidir.
    flightId: number;
}