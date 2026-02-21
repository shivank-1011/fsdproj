import { create } from "zustand";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  isLoading: false,
  error: null,

  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      // productData is expected to be FormData so we can handle image uploads properly
      const response = await axios.post("/products", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ isLoading: false });
      return response.data.product;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to create product",
      });
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null });
    try {
      // Note: Backend PUT /products/:id doesn't handle multipart uploads right now,
      // so this expects standard JSON payload.
      const response = await axios.put(`/products/${id}`, productData);
      set({ isLoading: false });
      return response.data.product;
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
      await axios.delete(`/products/${id}`);
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
