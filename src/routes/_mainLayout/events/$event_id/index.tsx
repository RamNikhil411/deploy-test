import EventDetails from "@/components/events/view/EventDetails";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_mainLayout/events/$event_id/"
)({
  component: EventDetails,
});
