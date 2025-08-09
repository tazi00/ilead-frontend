import { ApiClient } from "@/services/ApiClient.service";

export interface FacebookAuthResponse {
  login_url: string;
}

class FacebookIntegrationService extends ApiClient {
  constructor() {
    super("facebook");
  }

  async getFacebookAuthUrl(): Promise<string> {
    const response = await this.get<FacebookAuthResponse>("/login");
    return response.data.login_url;
  }

  async connectToFacebook() {
    const loginUrl = await this.getFacebookAuthUrl();
    window.location.href = loginUrl; // Redirects to Facebook login
  }

  async connectWithFacebookPage(): Promise<any> {
    const response = await this.get("/connect");
    return response.data;
  }
}

export const facebookIntegrationService = new FacebookIntegrationService();
