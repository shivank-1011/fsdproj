import ApiClient from "./ApiClient";

class ProductApiService extends ApiClient {
  async createProduct(productData) {
    return this.post("/products", productData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async updateProduct(id, productData) {
    return this.put(`/products/${id}`, productData);
  }

  async deleteProduct(id) {
    return this.delete(`/products/${id}`);
  }

  async getProducts(params = {}) {
    return this.get("/products", { params });
  }
}

export const productApiService = new ProductApiService();
