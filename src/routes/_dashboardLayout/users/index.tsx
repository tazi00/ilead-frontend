import { createFileRoute } from "@tanstack/react-router";
import CreateUserCard from "@/features/user/components/ChatAgentTable";

export const Route = createFileRoute("/_dashboardLayout/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreateUserCard />;
}
