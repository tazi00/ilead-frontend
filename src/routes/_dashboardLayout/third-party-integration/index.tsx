import { createFileRoute } from "@tanstack/react-router";
import FacebookIntegration from "@/features/third-party-integrations/components/FacebookIntegration/FacebookIntegration";

export const Route = createFileRoute(
  "/_dashboardLayout/third-party-integration/"
)({
  component: ThirdPartyIntegrationPage,
});

function ThirdPartyIntegrationPage() {
  return <FacebookIntegration />;
}
