import ConditionBuilder from "@/components/form_builder/conditions/conditions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/forms/$form_id/_formLayout/conditions")({
  component: ConditionBuilder,
});
