import EventCalendar from "@/components/events/event-calendar";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_mainLayout/events/calendar/"
)({
  component: EventCalendar,
});
