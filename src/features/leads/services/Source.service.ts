import { ApiClient } from "@/services/ApiClient.service";

export interface Source {
  _id: string;
  description: string;
  title: string;
  meta: { is_active: boolean };
}

interface SourceResponse {
  message: string;
  status: string;
  data: {
    sources: Source[];
  };
}

interface PaginatedSourceResponse {
  message: string;
  status: string;
  data: {
    sources: Source[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

interface SourcePayload {
  title: string;
  description: string;
}

interface CreateSourceResponse {
  message: string;
  status: string;
  data: Source;
}

interface EditSourcePayload {
  title: string;
  description: string;
  data: Source;
}

interface EditSourceResponse {
  message: string;
  status: string;
  data: Source;
}

interface DeleteSourceParams {
  sourceId: string;
}
export class SourceService extends ApiClient {
  constructor() {
    super("source");
  }

  async sources() {
    return this.get<SourceResponse>("fetch");
  }

  async getPaginatedSources(page = 1, limit = 10) {
    return this.get<PaginatedSourceResponse>(`/fetch`, {
      params: { page, limit },
    });
  }

  async createSource(payload: SourcePayload) {
    return this.post<CreateSourceResponse>("create", payload);
  }

  async editSource(
    sourceId: string,
    payload: EditSourcePayload
  ): Promise<EditSourceResponse> {
    const res = await this.put<EditSourceResponse>(
      `/update/${sourceId}`,
      payload
    );
    return res.data;
  }

  async deleteSource({ sourceId }: DeleteSourceParams) {
    const res = await this.delete<{ message: string; status: string }>(
      `/delete/${sourceId}`
    );
    return res.data;
  }
}

export const sourceService = new SourceService();
