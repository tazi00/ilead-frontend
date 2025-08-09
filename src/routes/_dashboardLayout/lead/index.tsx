import { createFileRoute } from "@tanstack/react-router";
import { useLeads } from "@/features/leads/hooks/useLeads";
import { useLeadFilters } from "@/features/leads/hooks/useLeadFilters";
import LeadsBoard from "@/features/leads/components/LeadsBoard";
import LoadingState from "@/features/leads/components/LeadsLoading";

import LeadsTable from "@/features/leads/components/LeadsTable/LeadsTable";
import { useViewContext } from "./route";
import { useState } from "react";

export const Route = createFileRoute("/_dashboardLayout/lead/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isTableView, setIsTableView } = useViewContext();
  const [page, setPage] = useState(1);
  const baseFilters = useLeadFilters();
  const filters = { ...baseFilters, is_table_view: isTableView, page };
  const { leads, isLoading, statuses, error, pagination } = useLeads(filters);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600">
            Error loading leads
          </h3>
          <p className="text-sm text-gray-500">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No leads found</p>
      </div>
    );
  }

  const normalizedLeads = leads.map((lead) => ({
    ...lead,
    address: lead.address ?? "",
    email: lead.email ?? "",
    company_name: lead.company_name ?? "",
    meta: lead.meta ?? {},
    assigned_to: {
      ...(typeof lead.assigned_to === "object" && lead.assigned_to !== null
        ? {
            ...lead.assigned_to,
            name:
              typeof lead.assigned_to.name === "string"
                ? lead.assigned_to.name
                : "",
          }
        : {
            name: typeof lead.assigned_to === "string" ? lead.assigned_to : "",
          }),
    },
    assigned_by: {
      name:
        typeof lead.assigned_by === "object" && lead.assigned_by !== null
          ? typeof lead.assigned_by.name === "string"
            ? lead.assigned_by.name
            : ""
          : typeof lead.assigned_by === "string"
            ? lead.assigned_by
            : "",
    },
  }));

  return isTableView ? (
    <LeadsTable
      leads={normalizedLeads}
      pagination={pagination}
      onPageChange={handlePageChange}
      setIsTableView={function (): void {
        throw new Error("Function not implemented.");
      }}
    />
  ) : (
    <LeadsBoard
      leads={normalizedLeads}
      statuses={statuses}
      setIsTableView={setIsTableView}
    />
  );
}
