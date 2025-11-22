import { createFileRoute } from "@tanstack/react-router";
import WapMonkeyIntegration from "@/features/whatsappp-settings/components/WapMonkeyIntegration";
import { automationsQueryOptions } from "@/features/automations/hooks/useAutomation";

export const Route = createFileRoute("/_dashboardLayout/whatsapp-settings/")({
  component: RouteComponent,
  loader: (ctx) => {
    ctx.context.queryClient.ensureQueryData(automationsQueryOptions());
  },
});

function RouteComponent() {
  return (
    <div>
      <div className="mt-5 space-y-6">
        <WapMonkeyIntegration />
      </div>
    </div>
  );
}
