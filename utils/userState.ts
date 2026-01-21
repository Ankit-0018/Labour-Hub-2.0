export type UserState = "UNAUTHENTICATED" | "NEEDS_ROLE" | "READY" | "WORKER";

export function getUserState(
  user: any,
  userDoc?: { isChosenRole?: boolean }
): UserState {
  if (!user) return "UNAUTHENTICATED";
  if (!userDoc?.isChosenRole) return "NEEDS_ROLE";
  return "READY";
}