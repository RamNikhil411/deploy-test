import VerifyPassword from "@/components/auth/forgot-password/VerifyPassword";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/forgot-password/verify")({
  component: VerifyPassword,
});
