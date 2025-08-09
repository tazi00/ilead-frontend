import { createFileRoute } from "@tanstack/react-router";
import CreateLabelForm from "@/features/labels/components/CreateLabelForm";

export const Route = createFileRoute("/_dashboardLayout/label/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreateLabelForm />;
}
