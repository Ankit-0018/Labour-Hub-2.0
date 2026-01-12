import { ROUTES } from "@/config/routes";
import type { UserState } from "./userState";

export function resolveRedirect(
  state: UserState,
  pathname: string
): string | null {
  switch (state) {
    case "UNAUTHENTICATED":
      if (!pathname.startsWith(ROUTES.AUTH.ROOT)) {
        return ROUTES.AUTH.LOGIN;
      }
      return null;

    case "NEEDS_ROLE":
      if (pathname !== ROUTES.ROLE.CHOOSE) {
        return ROUTES.ROLE.CHOOSE;
      }
      return null;

    case "READY":
      if (
        pathname.startsWith(ROUTES.AUTH.ROOT) ||
        pathname === ROUTES.ROLE.CHOOSE
      ) {
        return ROUTES.APP.HOME;
      }
      return null;

    default:
      return null;
  }
}