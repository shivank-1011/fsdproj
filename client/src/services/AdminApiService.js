import ApiClient from "./ApiClient";

class AdminApiService extends ApiClient {
  async getDashboardStats() {
    return this.get("/admin/dashboard");
  }

  async fetchUsers(page = 1, limit = 10) {
    return this.get(`/admin/users?page=${page}&limit=${limit}`);
  }

  async banUser(userId) {
    return this.post("/admin/users/ban", { userId });
  }

  async unbanUser(userId) {
    return this.post("/admin/users/unban", { userId });
  }

  async fetchStores(page = 1, limit = 10) {
    return this.get(`/admin/stores?page=${page}&limit=${limit}`);
  }

  async approveStore(storeId) {
    return this.post("/admin/stores/approve", { storeId });
  }
}

export const adminApiService = new AdminApiService();
