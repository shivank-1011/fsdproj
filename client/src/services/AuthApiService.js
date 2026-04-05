import ApiClient from "./ApiClient";

class AuthApiService extends ApiClient {
  async register(email, password, name, role) {
    return this.post("/auth/register", { email, password, name, role });
  }

  async login(email, password) {
    return this.post("/auth/login", { email, password });
  }

  async googleAuth(idToken, role) {
    return this.post("/auth/google", { idToken, role });
  }

  async logout(refreshToken) {
    return this.post("/auth/logout", { refreshToken });
  }

  async getMe() {
    return this.get("/auth/me");
  }
}

// Export a singleton instance
export const authApiService = new AuthApiService();
