import AddEvent from "@/components/events/addEvent";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_mainLayout/events/add-event"
)({
  component: AddEvent,
});
