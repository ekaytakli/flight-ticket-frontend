import {
    useEffect,
    useState,
} from "react";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";

import { getMyTickets } from "../api/ticketApi";
import { getFlightById } from "../api/flightApi";

import type { TicketResponse } from "../types/ticket";
import type { Flight } from "../types/flight";

import "./MyTicketsPage.css";

/*
 * Backend'den gelen bilet ile
 * uçuş bilgisini birlikte tutar.
 */
interface TicketWithFlight {
    ticket: TicketResponse;
    flight: Flight;
}

/*
 * Giriş yapan kullanıcının
 * gerçek biletlerini gösterir.
 */
export default function MyTicketsPage() {
    const { t, i18n } = useTranslation();

    const [tickets, setTickets] =
        useState<TicketWithFlight[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    /*
     * Sayfa açıldığında giriş yapan
     * kullanıcının biletlerini backend'den getirir.
     */
    useEffect(() => {
        let active = true;

        const loadTickets = async () => {
            try {
                setLoading(true);
                setError("");

                /*
                 * Önce kullanıcının gerçek
                 * biletlerini backend'den getirir.
                 */
                const ticketData =
                    await getMyTickets();

                /*
                 * Her biletin flightId bilgisiyle
                 * ilgili uçuş bilgisini getirir.
                 */
                const ticketWithFlights =
                    await Promise.all(
                        ticketData.map(
                            async (ticket) => {
                                const flight =
                                    await getFlightById(
                                        ticket.flightId,
                                    );

                                return {
                                    ticket,
                                    flight,
                                };
                            },
                        ),
                    );

                if (active) {
                    setTickets(
                        ticketWithFlights,
                    );
                }
            } catch {
                if (active) {
                    setError(
                        "Biletler yüklenirken bir hata oluştu.",
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadTickets();

        return () => {
            active = false;
        };
    }, []);

    /*
     * Tarihleri seçili dile uygun
     * biçimde gösterir.
     */
    const formatDate = (
        value: string,
    ) =>
        new Intl.DateTimeFormat(
            i18n.language.startsWith("en")
                ? "en-US"
                : "tr-TR",
            {
                dateStyle: "medium",
            },
        ).format(
            new Date(value),
        );

    return (
        <div className="tickets-page">
            <Navbar />

            <main className="tickets-main">
                <header className="tickets-heading">
                    <div>
                        <p className="tickets-eyebrow">
                            {t(
                                "myTickets.eyebrow",
                            )}
                        </p>

                        <h1>
                            {t(
                                "myTickets.title",
                            )}
                        </h1>

                        <p>
                            {t(
                                "myTickets.description",
                            )}
                        </p>
                    </div>

                    <Link
                        className="tickets-search-link"
                        to="/"
                    >
                        {t(
                            "myTickets.searchFlight",
                        )}
                    </Link>
                </header>

                {loading && (
                    <p>
                        {t(
                            "common.loading",
                        )}
                    </p>
                )}

                {error && (
                    <p
                        className="tickets-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                {!loading &&
                    !error &&
                    tickets.length === 0 && (
                        <p className="tickets-empty">
                            Henüz satın alınmış bir biletiniz yok.
                        </p>
                    )}

                {!loading &&
                    !error &&
                    tickets.length > 0 && (
                        <section
                            className="tickets-grid"
                            aria-label={t(
                                "myTickets.title",
                            )}
                        >
                            {tickets.map(
                                ({
                                     ticket,
                                     flight,
                                 }) => (
                                    <article
                                        className="ticket-card"
                                        key={
                                            ticket.id
                                        }
                                    >
                                        <div className="ticket-card__top">
                                            <div>
                                                <span>
                                                    {t(
                                                        "myTickets.pnr",
                                                    )}
                                                </span>

                                                <strong>
                                                    {
                                                        ticket.pnrKodu
                                                    }
                                                </strong>
                                            </div>

                                            <span className="ticket-card__badge">
                                                {t(
                                                    "myTickets.active",
                                                )}
                                            </span>
                                        </div>

                                        <div className="ticket-card__route">
                                            <div>
                                                <span>
                                                    {t(
                                                        "myTickets.departure",
                                                    )}
                                                </span>

                                                <strong>
                                                    {
                                                        flight.departurePoint
                                                    }
                                                </strong>
                                            </div>

                                            <span
                                                className="ticket-card__plane"
                                                aria-hidden="true"
                                            >
                                                ✈
                                            </span>

                                            <div>
                                                <span>
                                                    {t(
                                                        "myTickets.destination",
                                                    )}
                                                </span>

                                                <strong>
                                                    {
                                                        flight.destinationPoint
                                                    }
                                                </strong>
                                            </div>
                                        </div>

                                        <dl className="ticket-card__details">
                                            <div>
                                                <dt>
                                                    {t(
                                                        "myTickets.flightNo",
                                                    )}
                                                </dt>

                                                <dd>
                                                    {
                                                        flight.flightNo
                                                    }
                                                </dd>
                                            </div>

                                            <div>
                                                <dt>
                                                    {t(
                                                        "myTickets.date",
                                                    )}
                                                </dt>

                                                <dd>
                                                    {formatDate(
                                                        flight.departureTime,
                                                    )}
                                                </dd>
                                            </div>

                                            <div>
                                                <dt>
                                                    {t(
                                                        "myTickets.seat",
                                                    )}
                                                </dt>

                                                <dd>
                                                    {
                                                        ticket.seatNumber
                                                    }
                                                </dd>
                                            </div>
                                        </dl>
                                    </article>
                                ),
                            )}
                        </section>
                    )}
            </main>
        </div>
    );
}