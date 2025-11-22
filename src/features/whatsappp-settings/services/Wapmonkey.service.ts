import { ApiClient } from "@/services/ApiClient.service";

export interface WapMonkeyPayload {
  wapmonkey_key: string;
}

interface WapmonkeyResponse {
  message: string;
  status: string;
  data: string;
}

export class WapmonkeyService extends ApiClient {
  constructor() {
    super("wapmonkey");
  }

  async createWapmonkeyEntry(
    payload: WapMonkeyPayload
  ): Promise<WapmonkeyResponse> {
    const res = await this.post<WapmonkeyResponse>("/enter-api", payload);
    return res.data;
  }
}

export const wapmonkeyService = new WapmonkeyService();
