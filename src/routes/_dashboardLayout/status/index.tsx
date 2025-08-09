import { createFileRoute } from "@tanstack/react-router";
import StatusCard from "@/features/status/components/StatusCard";

export const Route = createFileRoute("/_dashboardLayout/status/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <StatusCard />;
}
