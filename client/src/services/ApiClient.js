import api from "../lib/axios";

/**
 * Base API client class that wraps the pre-configured axios instance.
 * Domain-specific API service classes extend this to inherit the `api` instance.
 */
class ApiClient {
  constructor() {
    this.api = api;
  }

  async get(url, config = {}) {
    const response = await this.api.get(url, config);
    return response.data;
  }

  async post(url, data = {}, config = {}) {
    const response = await this.api.post(url, data, config);
    return response.data;
  }

  async put(url, data = {}, config = {}) {
    const response = await this.api.put(url, data, config);
    return response.data;
  }

  async delete(url, config = {}) {
    const response = await this.api.delete(url, config);
    return response.data;
  }
}

export default ApiClient;
