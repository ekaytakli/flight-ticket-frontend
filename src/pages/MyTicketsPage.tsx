import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import { previewTickets } from "../data/dashboardPreviewData";
import "./MyTicketsPage.css";

export default function MyTicketsPage() {
    const { t, i18n } = useTranslation();

    /* Tarihleri seçili dile uygun biçimde gösterir. */
    const formatDate = (value: string) =>
        new Intl.DateTimeFormat(
            i18n.language.startsWith("en") ? "en-US" : "tr-TR",
            { dateStyle: "medium" },
        ).format(new Date(value));

    return (
        <div className="tickets-page">
            <Navbar />

            <main className="tickets-main">
                <header className="tickets-heading">
                    <div>
                        <p className="tickets-eyebrow">{t("myTickets.eyebrow")}</p>
                        <h1>{t("myTickets.title")}</h1>
                        <p>{t("myTickets.description")}</p>
                    </div>

                    {/* Mevcut public uçuş arama ekranına geri götürür. */}
                    <Link className="tickets-search-link" to="/">
                        {t("myTickets.searchFlight")}
                    </Link>
                </header>

                <section className="tickets-grid" aria-label={t("myTickets.title")}>
                    {previewTickets.map((ticket) => (
                        <article className="ticket-card" key={ticket.id}>
                            <div className="ticket-card__top">
                                <div>
                                    <span>{t("myTickets.pnr")}</span>
                                    <strong>{ticket.pnrKodu}</strong>
                                </div>
                                <span className="ticket-card__badge">
                                    {t("myTickets.active")}
                                </span>
                            </div>

                            <div className="ticket-card__route">
                                <div>
                                    <span>{t("myTickets.departure")}</span>
                                    <strong>{ticket.flight.departurePoint}</strong>
                                </div>
                                <span className="ticket-card__plane" aria-hidden="true">✈</span>
                                <div>
                                    <span>{t("myTickets.destination")}</span>
                                    <strong>{ticket.flight.destinationPoint}</strong>
                                </div>
                            </div>

                            <dl className="ticket-card__details">
                                <div>
                                    <dt>{t("myTickets.flightNo")}</dt>
                                    <dd>{ticket.flight.flightNo}</dd>
                                </div>
                                <div>
                                    <dt>{t("myTickets.date")}</dt>
                                    <dd>{formatDate(ticket.flight.departureTime)}</dd>
                                </div>
                                <div>
                                    <dt>{t("myTickets.seat")}</dt>
                                    <dd>{ticket.seat.seatNumber}</dd>
                                </div>
                            </dl>
                        </article>
                    ))}
                </section>

                <p className="tickets-preview-note">{t("myTickets.previewNote")}</p>
            </main>
        </div>
    );
}
