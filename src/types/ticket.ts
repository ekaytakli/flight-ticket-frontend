import type { Flight } from "./flight";
import type { Seat } from "./seat";

/*
 * Backend'deki Ticket entity'sinin frontend tarafındaki
 * temel karşılığını temsil eder.
 */
export interface Ticket {
    /* Biletin benzersiz kimliği. */
    id: number;

    /* Bilete ait PNR kodu. */
    pnrKodu: string;

    /* Biletin oluşturulma tarihi. */
    date: string;

    /* Biletin ait olduğu uçuş. */
    flight: Flight;

    /* Bilet için seçilen koltuk. */
    seat: Seat;
}