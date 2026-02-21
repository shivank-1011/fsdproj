import { create } from "zustand";
import axios from "../lib/axios";

export const useStoreStore = create((set) => ({
  store: null,
  isLoading: false,
  error: null,

  fetchMyStore: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/store/me");
      set({ store: response.data.store, isLoading: false });
      return response.data.store;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to fetch store",
        store: null,
      });
      // Do not throw here if it's a 404, we might just not have a store yet
      if (error.response?.status !== 404) {
        throw error;
      }
      return null;
    }
  },

  createStore: async (storeData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/store", storeData);
      set({ store: response.data.store, isLoading: false });
      return response.data.store;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to create store",
      });
      throw error;
    }
  },

  updateStore: async (id, storeData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`/store/${id}`, storeData);
      set((state) => ({
        store: { ...state.store, ...response.data.store },
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to update store",
      });
      throw error;
    }
  },
}));
