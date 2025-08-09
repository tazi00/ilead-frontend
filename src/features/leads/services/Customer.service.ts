import type { Lead } from "./HomePage.service";
import { ApiClient } from "@/services/ApiClient.service";

export type ConvertToCustomerPayload = {
  leadId: string;
};

interface CustomerResponse {
  message: string;
  status: string;
  data: Lead;
}

export class CustomerModule extends ApiClient {
  constructor() {
    super("customer");
  }

  async convertToCustomer(payload: ConvertToCustomerPayload) {
    const response = await this.post<CustomerResponse>("/create", payload);
    return response.data;
  }
}

export const customerService = new CustomerModule();
