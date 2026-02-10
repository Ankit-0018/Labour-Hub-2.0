import { redirect } from "next/navigation";

export default function HomePage() {
  // Middleware will handle the redirect, but just in case
  redirect("/auth?mode=login");
}
