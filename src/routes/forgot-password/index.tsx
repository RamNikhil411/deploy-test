import ForgotPassword from "@/components/auth/forgot-password";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/forgot-password/")({
  component: ForgotPassword,
});
