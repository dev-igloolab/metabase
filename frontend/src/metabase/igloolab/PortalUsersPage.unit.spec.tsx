import fetchMock from "fetch-mock";

import { setupUsersEndpoints } from "__support__/server-mocks";
import { renderWithProviders, screen } from "__support__/ui";
import { createMockUser } from "metabase-types/api/mocks";

import { PortalUsersPage } from "./PortalUsersPage";

const portalUser = createMockUser({
  id: 10,
  first_name: "Usuario",
  last_name: "asignado",
  email: "portal@example.com",
  is_superuser: false,
});

const regularUser = createMockUser({
  id: 11,
  first_name: "Usuario",
  last_name: "Normal",
  email: "usuario@example.com",
  is_superuser: false,
});

const adminUser = createMockUser({
  id: 12,
  first_name: "Administrador",
  email: "admin@example.com",
  is_superuser: true,
});

function setup() {
  setupUsersEndpoints([portalUser, regularUser, adminUser]);
  fetchMock.get("path:/api/igloolab/portal/assignments", [
    { user_id: portalUser.id, interface_type: "portal" },
  ]);

  renderWithProviders(<PortalUsersPage />, { withUndos: true });
}

describe("PortalUsersPage", () => {
  it("shows non-admin users and their assigned interface", async () => {
    setup();

    expect(
      await screen.findByRole("heading", {
        name: "Portal de usuarios",
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(await screen.findByText("portal@example.com")).toBeInTheDocument();
    expect(screen.getByText("usuario@example.com")).toBeInTheDocument();
    expect(screen.queryByText("admin@example.com")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Interfaz para Usuario asignado")).toHaveValue(
      "Portal de dashboards",
    );
    expect(screen.getByLabelText("Interfaz para Usuario Normal")).toHaveValue(
      "Aplicación completa",
    );
  });
});
