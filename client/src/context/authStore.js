import { create } from "zustand";
import { authApiService } from "../services/AuthApiService";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  checkAuthLoading: true,

  register: async (email, password, name, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApiService.register(email, password, name, role);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response;
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
      const response = await authApiService.login(email, password);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response;
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
      const response = await authApiService.googleAuth(idToken, role);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response;
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
      await authApiService.logout(refreshToken);
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
      const response = await authApiService.getMe();
      set({
        user: response.user,
        isAuthenticated: true,
        checkAuthLoading: false,
      });
    } catch (error) {
      console.error(error);
      set({
        user: null,
        isAuthenticated: false,
        checkAuthLoading: false,
      });
    }
  },
}));
