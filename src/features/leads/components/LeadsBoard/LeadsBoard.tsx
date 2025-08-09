"use client";

import { memo, useMemo } from "react";
import StatusColumn from "../StatusColumn";
import type { Lead, Status } from "@/features/leads/types";

interface LeadsBoardProps {
  leads: Lead[];
  statuses: Status[];
  setIsTableView: (val: boolean) => void;
}

export const LeadsBoard = memo(({ leads, statuses }: LeadsBoardProps) => {
  const leadCountsByStatus = useMemo(() => {
    return statuses.reduce(
      (acc, status) => {
        acc[status._id] = leads.filter(
          (lead) => lead.status._id === status._id
        ).length;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [leads, statuses]);

  if (!statuses.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No statuses available</p>
      </div>
    );
  }

  return (
    <div className="w-[1000px] mx-auto">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 pb-3">
        <div className="mt-10 inline-flex gap-4">
          {statuses.map((status) => (
            <StatusColumn
              key={status._id}
              status={status}
              leads={leads}
              leadCount={leadCountsByStatus[status._id] || 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

LeadsBoard.displayName = "LeadsBoard";
