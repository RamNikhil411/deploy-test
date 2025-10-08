import Users from "@/components/contacts/users";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_mainLayout/users/")({
  component: Users,
});
