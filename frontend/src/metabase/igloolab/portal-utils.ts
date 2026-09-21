import type { User } from "metabase-types/api";

import type { UserInterface } from "./types";

export function usesUserPortal(
  user: Pick<User, "is_superuser"> | null | undefined,
  interfaceType: UserInterface | undefined,
) {
  return Boolean(user && !user.is_superuser && interfaceType === "portal");
}

export function isPortalPath(path: string) {
  return path === "/portal" || /^\/dashboard\/[^/]+\/?$/.test(path);
}
