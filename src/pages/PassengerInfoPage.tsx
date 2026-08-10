import { useState, type FormEvent } from "react";
import {
    Link,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../components/LanguageSwitcher";
import "./PassengerInfoPage.css";

export default function PassengerInfoPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const flightId = searchParams.get("flightId") ?? "";
    const flightNo = searchParams.get("flightNo") ?? "";
    const departure = searchParams.get("from") ?? "";
    const destination = searchParams.get("to") ?? "";
    const date = searchParams.get("date") ?? "";
    const seatId = searchParams.get("seatId") ?? "";
    const seatNumber = searchParams.get("seatNumber") ?? "";

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();
        setError("");

        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !email.trim() ||
            !phone.trim()
        ) {
            setError(
                t("passengerInfo.errors.required"),
            );
            return;
        }

        const params = new URLSearchParams({
            flightId,
            flightNo,
            from: departure,
            to: destination,
            date,
            seatId,
            seatNumber,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
        });

        navigate(
            `/booking-summary?${params.toString()}`,
        );
    };

    return (
        <main className="passenger-page">
            <header className="passenger-header">
                <Link
                    to="/"
                    className="passenger-logo"
                >
                    ✈ SkyRoute
                </Link>

                <div className="passenger-header-actions">
                    <LanguageSwitcher />

                    <Link
                        to="/"
                        className="passenger-home-button"
                    >
                        {t("passengerInfo.home")}
                    </Link>
                </div>
            </header>

            <section className="passenger-container">
                <div className="passenger-heading">
                    <p className="passenger-eyebrow">
                        {t("passengerInfo.eyebrow")}
                    </p>

                    <h1>
                        {t("passengerInfo.title")}
                    </h1>

                    <p>
                        {t(
                            "passengerInfo.description",
                        )}
                    </p>
                </div>

                <section className="passenger-trip-summary">
                    <div>
                        <span>
                            {t("passengerInfo.flight")}
                        </span>

                        <strong>
                            {flightNo || "-"}
                        </strong>
                    </div>

                    <div>
                        <span>
                            {t("passengerInfo.route")}
                        </span>

                        <strong>
                            {departure || "-"} →{" "}
                            {destination || "-"}
                        </strong>
                    </div>

                    <div>
                        <span>
                            {t("passengerInfo.seat")}
                        </span>

                        <strong>
                            {seatNumber || "-"}
                        </strong>
                    </div>
                </section>

                <form
                    className="passenger-form"
                    onSubmit={handleSubmit}
                >
                    <h2>
                        {t(
                            "passengerInfo.formTitle",
                        )}
                    </h2>

                    <div className="passenger-form-grid">
                        <div className="passenger-field">
                            <label htmlFor="firstName">
                                {t(
                                    "passengerInfo.firstName",
                                )}
                            </label>

                            <input
                                id="firstName"
                                type="text"
                                value={firstName}
                                onChange={(event) =>
                                    setFirstName(
                                        event.target.value,
                                    )
                                }
                            />
                        </div>

                        <div className="passenger-field">
                            <label htmlFor="lastName">
                                {t(
                                    "passengerInfo.lastName",
                                )}
                            </label>

                            <input
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(event) =>
                                    setLastName(
                                        event.target.value,
                                    )
                                }
                            />
                        </div>

                        <div className="passenger-field">
                            <label htmlFor="email">
                                {t(
                                    "passengerInfo.email",
                                )}
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value,
                                    )
                                }
                            />
                        </div>

                        <div className="passenger-field">
                            <label htmlFor="phone">
                                {t(
                                    "passengerInfo.phone",
                                )}
                            </label>

                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(event) =>
                                    setPhone(
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </div>

                    {error && (
                        <p
                            className="passenger-error"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="passenger-continue-button"
                    >
                        {t("passengerInfo.continue")}
                    </button>
                </form>
            </section>
        </main>
    );
}