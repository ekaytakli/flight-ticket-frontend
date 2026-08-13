/*
 * Backend'deki Flight entity'sinden gelecek
 * uçuş verilerinin frontend tarafındaki yapısını tanımlar.
 */
export interface Flight {
    // Uçuşun benzersiz kimliği.
    id: number;

    // Uçuş numarası. Örnek: TK101
    flightNo: string;

    // Kalkış noktası.
    departurePoint: string;

    // Varış noktası.
    destinationPoint: string;

    // Kalkış tarih ve saati.
    departureTime: string;

    // Varış tarih ve saati.
    destinationTime: string;
}

/*
 * Ana sayfadaki uçuş arama formunda
 * kullanılan arama kriterlerini tanımlar.
 */
export interface FlightSearchParams {
    departurePoint: string;
    destinationPoint: string;
    date: string;
}