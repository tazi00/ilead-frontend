import { ApiClient } from "@/services/ApiClient.service";

export interface Lables {
  _id: string;
  description: string;
  title: string;
  meta: { is_active: boolean };
}

interface LableResponse {
  map(arg0: (label: any) => { _id: any; title: any }): unknown;
  labels: never[];
  message: string;
  status: string;
  data: Lables[];
}

export interface CreateLabelResponse {
  message: string;
  status: string;
  data: Lables;
}

export interface LabelPayload {
  title: string;
  description: string;
}

export class LabelService extends ApiClient {
  constructor() {
    super("label");
  }

  async labels() {
    return this.get<LableResponse>("all");
  }

  async createLabel(payload: LabelPayload): Promise<CreateLabelResponse> {
    const res = await this.post<CreateLabelResponse>("/create", payload);
    return res.data;
  }
}

export const labelService = new LabelService();
