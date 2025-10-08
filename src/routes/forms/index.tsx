import Forms from "@/components/Forms";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/forms/")({
  component: Forms,
});
