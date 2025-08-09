import { ApiClient } from "@/services/ApiClient.service";

export interface Status {
  _id: string;
  description: string;
  title: string;
  property_id: string;
  meta: { is_active: boolean };
}

interface StatusResponse {
  message: string;
  status: string;
  data: Status[];
}

interface CreateStatusResponse {
  message: string;
  status: string;
  data: Status;
}

interface CreateStatusPayload {
  title: string;
  description: string;
}
interface PaginatedStatusResponse {
  message: string;
  status: string;
  data: {
    statuses: Status[];
    pagination: {
      total: number;
      currentPage: number;
      limit: number;
      totalPage: number;
    };
  };
}

interface DeleteStatusParams {
  id: string;
}

interface EditStatusPayload {
  statusId: string;
  title: string;
  description: string;
  meta?: {
    is_active: boolean;
  };
}

interface EditStatusResponse {
  message: string;
  status: string;
  data: Status;
}
export class StatusService extends ApiClient {
  constructor() {
    super("status");
  }

  async status() {
    return this.get<StatusResponse>("all");
  }

  async getPaginatedStatuses(page = 1, limit = 10) {
    return this.get<PaginatedStatusResponse>(`/paginated-statuses`, {
      params: { page, limit },
    });
  }

  async createStatus(
    payload: CreateStatusPayload
  ): Promise<CreateStatusResponse> {
    const res = await this.post<CreateStatusResponse>("/create", payload);
    return res.data;
  }

  async deleteStatus({ id }: DeleteStatusParams) {
    const res = await this.delete<{ message: string; status: string }>(
      `/delete/${id}`
    );
    return res.data;
  }

  async editStatus(payload: EditStatusPayload): Promise<EditStatusResponse> {
    const res = await this.patch<EditStatusResponse>(`/update`, payload);
    return res.data;
  }
}

export const statusService = new StatusService(); // singleton
