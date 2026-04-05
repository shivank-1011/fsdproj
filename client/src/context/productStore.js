import { create } from "zustand";
import { productApiService } from "../services/ProductApiService";

export const useProductStore = create((set) => ({
  products: [],
  total: 0,
  isLoading: false,
  error: null,

  fetchProducts: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productApiService.getProducts(filters);
      set({
        products: response.products,
        total: response.total,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to fetch products",
      });
      throw error;
    }
  },

  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      // productData is expected to be FormData so we can handle image uploads properly
      const response = await productApiService.createProduct(productData);
      set({ isLoading: false });
      return response.product;
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to create product",
      });
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null });
    try {
      // Note: Backend PUT /products/:id doesn't handle multipart uploads right now,
      // so this expects standard JSON payload.
      const response = await productApiService.updateProduct(id, productData);
      set({ isLoading: false });
      return response.product;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to update product",
      });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await productApiService.deleteProduct(id);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to delete product",
      });
      throw error;
    }
  },
}));
