import { createFileRoute } from "@tanstack/react-router";
import WorkspaceLogs from "@/features/workspace/components/WorkspaceLogs/WorkspaceLogs";

export const Route = createFileRoute("/_dashboardLayout/workspace-logs/")({
  component: WorkspaceLogsPage,
});

function WorkspaceLogsPage() {
  return <WorkspaceLogs />;
}
