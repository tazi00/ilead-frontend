import { useQuery } from "@tanstack/react-query";
import {
  leadsService,
  type FilterPayload,
  type LeadsResponse,
} from "../services/Leads.service";

const DEFAULT_FILTERS: FilterPayload = {
  labelIds: [],
  assignedTo: [],
  sourceNames: [],
  createdByIds: [],
  search: "",
  sortBy: "",
  is_table_view: false,
  page: 1,
  limit: 10,
};

export function useLeads(filters: FilterPayload = DEFAULT_FILTERS) {
  const query = useQuery<LeadsResponse, Error>({
    queryKey: ["leads", { ...filters }],
    queryFn: () => leadsService.searchLeads(filters),
    staleTime: 5 * 60 * 1000,
  });

  return {
    leads: query.data?.data.leads ?? [],
    statuses: query.data?.data.statuses ?? [],
    pagination: query.data?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
