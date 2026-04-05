import ApiClient from "./ApiClient";

class CartApiService extends ApiClient {
  async getCart() {
    return this.get("/cart");
  }

  async addToCart(productId, quantity) {
    return this.post("/cart/add", { productId, quantity });
  }

  async updateQuantity(cartItemId, quantity) {
    return this.put(`/cart/update/${cartItemId}`, { quantity });
  }

  async removeFromCart(cartItemId) {
    return this.delete(`/cart/remove/${cartItemId}`);
  }

  async clearCart() {
    return this.delete("/cart/clear");
  }
}

export const cartApiService = new CartApiService();
