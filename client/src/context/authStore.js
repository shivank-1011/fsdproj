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
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Error registering",
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
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Error logging in",
      });
      throw error;
    }
  },

  googleAuth: async (idToken, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/auth/google", {
        idToken,
        role,
      });
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Error during Google authentication",
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await axios.post("/auth/logout", { refreshToken });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Error logging out",
      });
    }
  },

  checkAuth: async () => {
    set({ checkAuthLoading: true, error: null });
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No token found");
      }
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
