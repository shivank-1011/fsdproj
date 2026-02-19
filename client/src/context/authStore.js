import { create } from "zustand";
import axios from "../lib/axios";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  checkAuthLoading: true,

  register: async (email, password, name, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/auth/register", {
        email,
        password,
        name,
        role,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error registering",
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error logging in",
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post("/auth/logout");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error logging out",
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ checkAuthLoading: true, error: null });
    try {
      const response = await axios.get("/auth/me");
      set({
        user: response.data.user,
        isAuthenticated: true,
        checkAuthLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        checkAuthLoading: false,
      });
    }
  },
}));
