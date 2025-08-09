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
  follow_ups: [];
};

export type Status = {
  meta: any;
  _id: string;
  title: string;
  description: string;
};

export type Source = {
  _id: string;
  title: string;
};

export type DeleteLeadPayload = {
  rayId: string;
  deleteReason: string;
};

export type ChangeLeadStatusPayload = {
  leadId: string;
  statusId: string;
};

export interface AssignLeadToPayload {
  leadId: string;
  chatAgentId: string;
}
interface LeadsPerStatusResponse {
  message: string;
  status: string;
  data: {
    labels: Status[];
    data: number[];
  };
}

interface LeadsPerSourceResponse {
  message: string;
  status: string;
  data: {
    sources: Source[];
    data: number[];
  };
}

interface LeadDetailsResponse {
  message: string;
  status: string;
  data: Lead;
}

interface DeleteLeadsResponse {
  message: string;
  status: string;
}

interface AssignLabelResponse {
  message: string;
  status: string;
}

export type AssignLabelPayload = {
  leadId: string;
  labelIds: string[];
};

interface ChangeLeadStatusResponse {
  message: string;
  status: string;
}

export interface AssignLeadToResponse {
  message: string;
  status: string;
}

export interface CreateNewFollowupPayload {
  leadId: string;
  nextFollowUp: string;
  comment: string;
  attachmentUrl?: string;
  audioAttachmentUrl?: string;
}

interface FolllowUpResponse {
  message: string;
  status: string;
  data: {
    followUp: {
      comment: string;
      next_followup_date: string;
      meta: {
        created_by: string;
        attachment_url: string;
        audio_attachment_url: string;
      };
    };
  };
}
export class LeadsModule extends ApiClient {
  constructor() {
    super("lead");
  }

  async getLeadsAccordingToStatus(params: {
    startDate?: string;
    endDate?: string;
    agentId: string;
  }) {
    return this.get<LeadsPerStatusResponse>("/leads-per-status", { params });
  }
  async getLeadsAccordingToSource(params: {
    startDate?: string;
    endDate?: string;
    agentId: string;
  }) {
    return this.get<LeadsPerSourceResponse>("/leads-per-source", { params });
  }

  async deleteLeads(payload: DeleteLeadPayload) {
    const response = await this.patch<DeleteLeadsResponse>(
      "/delete-lead",
      payload
    );
    return response.data;
  }

  async getLeadInfo(params: { leadId: string }) {
    return this.get<LeadDetailsResponse>("/info", { params });
  }

  async assignLabelToLead(payload: AssignLabelPayload) {
    const response = await this.patch<AssignLabelResponse>("/update", payload);
    return response.data;
  }

  async updateLeadStatus(payload: ChangeLeadStatusPayload) {
    const response = await this.patch<ChangeLeadStatusResponse>(
      "/update-status",
      payload
    );
    return response.data;
  }

  async assignLeadTo(
    payload: AssignLeadToPayload
  ): Promise<AssignLeadToResponse> {
    const response = await this.patch<AssignLeadToResponse>(
      "/update-chat-agent",
      payload
    );
    return response.data;
  }

  async createNewFollowup(
    payload: CreateNewFollowupPayload
  ): Promise<FolllowUpResponse> {
    const response = await this.post<FolllowUpResponse>("/follow-up", payload);
    return response.data;
  }

  async createLeadFromPlatform(
    payload: Omit<Lead, "_id" | "createdAt" | "follow_ups">
  ): Promise<any> {
    const response = await this.post<any>("/create", payload);
    return response.data;
  }
}

export const statsService = new LeadsModule();
export const sourceStatsService = new LeadsModule();
export const deleteLeadsService = new LeadsModule();
export const leadDetailsService = new LeadsModule();
export const assignLeadTo = new LeadsModule();
export const createNewFollowupService = new LeadsModule();
export const createLeadFromPlatform = new LeadsModule();
