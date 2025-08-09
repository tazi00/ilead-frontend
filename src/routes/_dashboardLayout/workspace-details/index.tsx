import { createFileRoute } from "@tanstack/react-router";
import WorkspaceDetailsCard from "@/features/workspace/components/WorkspaceDetails/WorkspaceDetailsCard";
export const Route = createFileRoute("/_dashboardLayout/workspace-details/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <WorkspaceDetailsCard />;
}
