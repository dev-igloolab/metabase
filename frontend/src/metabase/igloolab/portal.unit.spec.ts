import { isPortalPath, usesUserPortal } from "./portal-utils";

describe("user portal routing", () => {
  it("keeps existing accounts and administrators in Metabase", () => {
    expect(usesUserPortal(null, undefined)).toBe(false);
    expect(usesUserPortal({ is_superuser: false }, "metabase")).toBe(false);
    expect(usesUserPortal({ is_superuser: true }, "portal")).toBe(false);
  });

  it("uses only the administrator-assigned interface", () => {
    expect(usesUserPortal({ is_superuser: false }, "portal")).toBe(true);
    expect(usesUserPortal({ is_superuser: false }, "metabase")).toBe(false);
  });

  it("allows dashboards but excludes editing modals and application routes", () => {
    expect(isPortalPath("/portal")).toBe(true);
    expect(isPortalPath("/dashboard/2-congreso")).toBe(true);

    for (const path of [
      "/",
      "/admin",
      "/collection/5",
      "/question/1",
      "/dashboard/2/copy",
    ]) {
      expect(isPortalPath(path)).toBe(false);
    }
  });
});
