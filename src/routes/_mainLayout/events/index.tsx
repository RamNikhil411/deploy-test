import { Events } from "@/components/events";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_mainLayout/events/")({
  component: Events,
});
