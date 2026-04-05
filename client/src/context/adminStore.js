import { create } from "zustand";
import { adminApiService } from "../services/AdminApiService";

export const useAdminStore = create((set) => ({
  users: [],
  stores: [],
  dashboardStats: null,
  isLoading: false,
  error: null,
  totalPages: 1,

  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminApiService.getDashboardStats();
      set({ dashboardStats: response, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error fetching stats",
        isLoading: false,
      });
    }
  },

  fetchUsers: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminApiService.fetchUsers(page, limit);
      set({
        users: response.users,
        totalPages: response.totalPages,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error fetching users",
        isLoading: false,
      });
    }
  },

  banUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      await adminApiService.banUser(userId);
      set((state) => ({
        users: state.users.map((u) =>
          u.id === userId ? { ...u, isBanned: true } : u,
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error banning user",
        isLoading: false,
      });
    }
  },

  unbanUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      await adminApiService.unbanUser(userId);
      set((state) => ({
        users: state.users.map((u) =>
          u.id === userId ? { ...u, isBanned: false } : u,
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error unbanning user",
        isLoading: false,
      });
    }
  },

  fetchStores: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminApiService.fetchStores(page, limit);
      set({
        stores: response.stores,
        totalPages: response.totalPages,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error fetching stores",
        isLoading: false,
      });
    }
  },

  approveStore: async (storeId) => {
    set({ isLoading: true, error: null });
    try {
      await adminApiService.approveStore(storeId);
      set((state) => ({
        stores: state.stores.map((s) =>
          s.id === storeId ? { ...s, isVerified: true } : s,
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error approving store",
        isLoading: false,
      });
    }
  },
}));
