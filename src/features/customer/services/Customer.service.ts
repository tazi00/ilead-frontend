import { ApiClient } from "@/services/ApiClient.service";

export interface Customer {
  _id: string;
  name: string;
  date_of_birth?: Date;
  company_name?: string;
  anniversary_date?: Date;
  email?: string;
  phone_number: string;
  gst_no?: string;
  address?: string;
  assign_tag?: any;
  created_by?: Record<string, any>;
  converted_by: Record<string, any>;
  converted_date: Date;
  meta?: Record<string, any>;
}

interface CustomerResponse {
  message: string;
  status: string;
  data: {
    customers: Customer[];
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

export class CustomerService extends ApiClient {
  constructor() {
    super("customer");
  }

  async getPaginatedCustomers(page = 1, limit = 10) {
    return this.get<CustomerResponse>(`/fetch`, {
      params: {
        page,
        limit,
      },
    });
  }
}

export const customerService = new CustomerService();
