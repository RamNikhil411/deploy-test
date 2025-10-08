import JoinOrganization from "@/components/join-organization";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/join-organization/")({
  component: JoinOrganization,
});
