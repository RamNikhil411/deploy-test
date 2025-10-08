import LoginComponent from "@/components/auth/LoginComponent";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signin")({
  component: LoginComponent,
});

function RouteComponent() {
  return <div>Hello "/signin"!</div>;
}
