import { create } from "zustand";
import axios from "../lib/axios";

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
      const res = await axios.get("/admin/dashboard");
      set({ dashboardStats: res.data, isLoading: false });
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
      const res = await axios.get(`/admin/users?page=${page}&limit=${limit}`);
      set({
        users: res.data.users,
        totalPages: res.data.totalPages,
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
      await axios.post("/admin/users/ban", { userId });
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
      await axios.post("/admin/users/unban", { userId });
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
      const res = await axios.get(`/admin/stores?page=${page}&limit=${limit}`);
      set({
        stores: res.data.stores,
        totalPages: res.data.totalPages,
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
      await axios.post("/admin/stores/approve", { storeId });
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
