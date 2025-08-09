import { createFileRoute } from "@tanstack/react-router";
import SourceCard from "@/features/source/components/SourceCard";

export const Route = createFileRoute("/_dashboardLayout/source/")({
  component: SourcePage,
});

function SourcePage() {
  return <SourceCard />;
}
