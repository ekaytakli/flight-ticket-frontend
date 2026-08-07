import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "../App";
import { AuthProvider } from "../context/AuthContext";

export function renderApp(initialPath = "/") {
    return render(
        <MemoryRouter initialEntries={[initialPath]}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </MemoryRouter>,
    );
}
