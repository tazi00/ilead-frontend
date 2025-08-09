import { ApiClient } from "@/services/ApiClient.service";

export type Lead = {
  _id: string;
  name: string;
  company_name: string;
  phone_number: string;
  email: string;
  address: string;
  comment: string;
  reference: string;
  createdAt: string;
};

interface DashboardPageResponse {
  message: string;
  status: string;
  data: {
    date: string;
    leads_in_new: Lead[];
    leads_in_processing: Lead[];
  };
}

class DashboardPageService extends ApiClient {
  constructor() {
    super("home-page/leads");
  }

  async getTodayLeads() {
    return this.get<DashboardPageResponse>("/today");
  }
}

export const dashboardLeads = new DashboardPageService();
