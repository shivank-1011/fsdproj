import ApiClient from "./ApiClient";

class StoreApiService extends ApiClient {
  async getMyStore() {
    return this.get("/stores/me");
  }

  async createStore(storeData) {
    return this.post("/stores", storeData);
  }

  async updateStore(id, storeData) {
    return this.put(`/stores/${id}`, storeData);
  }
}

export const storeApiService = new StoreApiService();
