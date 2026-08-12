/*
 * Backend'e yeni bilet oluştururken
 * gönderilecek bilgileri tanımlar.
 */
export interface CreateTicketRequest {
    // Seçilen uçuşun ID bilgisidir.
    flightId: number;

    // Seçilen koltuğun ID bilgisidir.
    seatId: number;
}

/*
 * Backend bilet oluşturduktan sonra
 * frontend'e dönen bilgileri tanımlar.
 */
export interface TicketResponse {
    // Oluşturulan biletin ID bilgisidir.
    id: number;

    // Backend tarafından üretilen PNR kodudur.
    pnrKodu: string;

    // Biletin oluşturulduğu tarih ve saattir.
    date: string;

    // Biletin ait olduğu uçuşun ID bilgisidir.
    flightId: number;

    // Seçilen koltuğun ID bilgisidir.
    seatId: number;

    // Seçilen koltuğun numarasıdır.
    seatNumber: string;
}