import { ApiClient } from "@/services/ApiClient.service";
import type { RoleDto, UserDto } from "./User.service";

interface Log {
  title: string;
  description: string;
  status: "INFO" | "WARNING" | "ERROR" | "ACTION" | "SYSTEM";
  createdAt: Date;

  meta?: Record<string, any>;
}

interface KeyAccess {
  key: string;
  name?: string;
  usage_limit: number;
  usage_count: number;
  allowed_users: string[];
  created_at: Date;
  expires_at?: Date;
  status: "ACTIVE" | "INACTIVE";
  meta?: Record<string, any>;
}

export type Property = {
  meta?: {
    [key: string]: any;
  };
  _id: string;
  name: string;
  description: string;
  usage_limits: number;
  usage_count: number;
  logs: Log[];
  role: {
    _id: string;
    name: string;
  };
  email_verification_otp: string;
  otp_expiration: Date | null;
  is_verified: boolean;
  reported: boolean;
  is_banned: boolean;
  status: "ACTIVE" | "INACTIVE" | "USAGE_LIMIT_EXCEEDED";
  keys: KeyAccess[];
};

export interface PropertyResponse {
  message: string;
  status: string;
  data: Property;
}

interface UpdateProperty {
  propId: string;
  name: string;
  description: string;
}

export interface UpdatePropertyResponse {
  message: string;
  status: string;
  data: Property;
}

interface RegistrationPayload {
  roleName: string;
  name: string;
  email: string;
  phone_number: string;
  password: string;
  orgName: string;
  orgDescription: string;
}

interface ResgistrationResponse {
  message: string;
  status: string;
  data: {
    user: UserDto;
    property: Property;
    role: RoleDto;
  };
}


interface UpdateLogPayload {
  logId: string;
}

interface UpdateLogResponse {  
    message: string,
    status: string,
    data: {
        title: string,
        description: string,
        status: string,
        meta: {
            leadId: string,
            readStatus: string,
            readAt: string
        },
        _id: string,
        createdAt: string,
        updatedAt: string
    }

}


export class PropertyModule extends ApiClient {
  constructor() {
    super("property");
  }

  async getProperty() {
    return this.get<PropertyResponse>("/workspace-details");
  }

  async updateProperty(payload: UpdateProperty) {
    return this.patch<UpdatePropertyResponse>("/update", payload);
  }

  async register(payload: RegistrationPayload) {
    const res = await this.post<ResgistrationResponse>("/onboarding", payload);
    return res.data;
  }

  async updateLogInProperty(payload: UpdateLogPayload) {
    const res = await this.put<UpdateLogResponse>("/read", payload);
    return res.data;
  }
}

export const workspaceService = new PropertyModule();
