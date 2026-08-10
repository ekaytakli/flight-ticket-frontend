/*
 * Backend'deki Seat entity'sinin frontend tarafındaki
 * karşılığını temsil eder.
 */
export interface Seat {
    /* Koltuğun benzersiz kimliği. */
    id: number;

    /* Koltuk numarası. Örneğin: 12A */
    seatNumber: string;

    /* Koltuk tipi. */
    seatType: string;

    /* Koltuğun satın alınabilir durumda olup olmadığını belirtir. */
    isAvailable: boolean;
}