import { createFileRoute } from "@tanstack/react-router";
import CustomerTable from "@/features/customer/components/CustomerTable";

export const Route = createFileRoute("/_dashboardLayout/customer/")({
  component: CustomerPage,
});

function CustomerPage() {
  return <CustomerTable />;
}
