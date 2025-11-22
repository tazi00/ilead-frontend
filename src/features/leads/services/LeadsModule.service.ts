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
  follow_ups: {
    next_followup_date: Date;
    comment: string;
    _id: string;
    meta: { attachment_url: string; audio_attachment_url: string };
  }[];
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

interface MissedFollowUps {
  message: string;
  status: string;
  data: {
    leadId: string;
    name: string;
    phone_number: string;
    email: string;
    address: string;
    company_name: string;
    status: { _id: string; title: string };
    assigned_to: { _id: string; name: string; email: string };
    labels: { _id: string; title: string }[];
    next_followup_date: string;
    comment: string;
    meta: { source: { title: string } };
  }[];
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

export interface UpdateFollowupPayload {
  leadId: string;
  followUpId: string;
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

interface ExportLeads {
  message: string;
  status: string;
  data: {
    // download_url: string;
  };
}

export interface ArchivedLeadsPayload {
  page: number;
  limit: number;
}

export interface GetReports {
  sourceTitle: string;
}

export interface GetRepcortsResponse {
  message: string;
  status: string;
  data: {};
}

interface ArchivedLeads {
  leads: Lead[];
  pagination: {
    totalItems: 0;
    totalPages: 0;
    currentPage: 1;
    limit: 10;
    hasNextPage: false;
    hasPrevPage: false;
  };
}

export interface ArchivedLeadResponse {
  message: string;
  status: string;
  data: ArchivedLeads;
}
export interface OverdueFollowUpResponse {
  message: string;
  status: string;
  data: Lead[];
}

export interface TodaysFollowUpResponse {
  message: string;
  status: string;
  data: Lead[];
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

  async updateFollowup(
    payload: UpdateFollowupPayload
  ): Promise<FolllowUpResponse> {
    const response = await this.patch<FolllowUpResponse>(
      "/update/follow-up",
      payload
    );
    return response.data;
  }

  async createLeadFromPlatform(
    payload: Omit<Lead, "_id" | "createdAt" | "follow_ups">
  ): Promise<any> {
    const response = await this.post<any>("/create", payload);
    return response.data;
  }

  async importLead({
    file,
    status_id,
    source_id,
    assigned_to,
    label_ids,
  }: {
    file: File | null;
    status_id: string;
    source_id: string;
    assigned_to: string;
    label_ids: string;
  }) {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("status_id", status_id);
    formData.append("source_id", source_id);
    formData.append("assigned_to", assigned_to);
    formData.append("label_ids", label_ids);

    const response = await this.post("/import-leads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  }

  async missedFollowups() {
    return this.get<MissedFollowUps>("/missed-follow-ups");
  }

  async exportLeads() {
    return this.get<ExportLeads>("/export-leads");
  }

  async achivedLeads(payload: ArchivedLeadsPayload) {
    return this.post<ArchivedLeadResponse>("/archived-leads", payload);
  }
  async overdueFollowUps() {
    return this.get<OverdueFollowUpResponse>("/overdue-followups");
  }
  async todaysFollowupds() {
    return this.get<TodaysFollowUpResponse>("/todays-followups");
  }

  async getSourceReports(payload: GetReports) {
    return this.post<GetRepcortsResponse>(
      "/statistics-by-source-agent",
      payload
    );
  }

  async getLabelReports(payload: GetReports) {
    return this.post<GetRepcortsResponse>(
      "/statistics-by-label-agent",
      payload
    );
  }
  async getStatusReports(payload: GetReports) {
    return this.post<GetRepcortsResponse>(
      "/statistics-by-status-agent",
      payload
    );
  }
}
export const leadsServoceModule = new LeadsModule();
export const statsService = new LeadsModule();
export const sourceStatsService = new LeadsModule();
export const deleteLeadsService = new LeadsModule();
export const leadDetailsService = new LeadsModule();
export const assignLeadTo = new LeadsModule();
export const createNewFollowupService = new LeadsModule();
export const createLeadFromPlatform = new LeadsModule();
