/*
 * Backend'deki Flight entity'sinden frontend'e
 * gelecek uçuş bilgilerini temsil eder.
 */
export interface Flight {
    /* Uçuşun benzersiz kimliği. */
    id: number;

    /* Uçuş numarası. Örneğin: TK101 */
    flightNo: string;

    /* Uçağın kalkacağı şehir/havalimanı. */
    departurePoint: string;

    /* Uçağın gideceği şehir/havalimanı. */
    destinationPoint: string;

    /* Uçağın kalkış tarih ve saati. */
    departureTime: string;

    /* Uçağın varış tarih ve saati. */
    destinationTime: string;
}

/*
 * Ana sayfadaki uçuş arama formunda kullanılan
 * arama kriterlerini temsil eder.
 */
export interface FlightSearchParams {
    departurePoint: string;
    destinationPoint: string;
    date: string;
}