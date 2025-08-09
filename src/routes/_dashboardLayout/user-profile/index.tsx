import { createFileRoute } from "@tanstack/react-router";
import UserProfileDetailsCard from "@/features/user/components/UserProfileDetailsCard";

export const Route = createFileRoute("/_dashboardLayout/user-profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UserProfileDetailsCard />;
}
