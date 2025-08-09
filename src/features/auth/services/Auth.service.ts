import { ApiClient } from "@/services/ApiClient.service";

/* ---------- Payload Types ---------- */
interface LoginPayload {
  email: string;
  password: string;
}

interface ForgetPasswordPayload {
  emailOrPhone: string;
}

interface ResetPasswordPayload {
  otp: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  message: string;
  status: string;
}
interface ForgetPasswordResponse {
  message: string;
  status: string;
}
interface RegisterPayload {
  email: string;
  password: string;
}

/* ---------- Common User Type ---------- */
interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

/* ---------- Unified API Response ---------- */
interface AuthResponse {
  message: string;
  status: string;
  data: {
    user: User;
  };
}

/* ---------- /me Response Type ---------- */
// interface MeResponse {
//   id: string;
//   email: string;
// }

/**
 * 🔐 Auth API Service (auto-prefixes with `/auth`)
 */
class AuthService extends ApiClient {
  constructor() {
    super("auth"); // this.modulePath becomes /auth
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await this.post<AuthResponse>("/login", payload);
    return res.data;
  }

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await this.post<AuthResponse>("/register", payload);
    return res.data;
  }

  async loginForAll(payload: LoginPayload): Promise<AuthResponse> {
    const res = await this.post<AuthResponse>("/login/all", payload);
    return res.data;
  }

  async forgetPasswordForAll(
    payload: ForgetPasswordPayload
  ): Promise<ForgetPasswordResponse> {
    const res = await this.post<ForgetPasswordResponse>(
      "/forget-password",
      payload
    );
    return res.data;
  }

  async resetPasswordForAll(
    payload: ResetPasswordPayload
  ): Promise<ResetPasswordResponse> {
    const res = await this.post<ResetPasswordResponse>(
      "/reset-password",
      payload
    );
    return res.data;
  }

  //   me(): Promise<MeResponse> {
  //     return this.get<MeResponse>("/me");
  //   }
}

/** 🔄 Export singleton for reuse */
export const authService = new AuthService();
