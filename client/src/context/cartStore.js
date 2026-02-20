import { create } from "zustand";
import api from "../lib/axios";

export const useCartStore = create((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/cart");
      set({ cart: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to fetch cart",
        isLoading: false,
      });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    const previousCart = get().cart;

    try {
      const response = await api.post("/cart/add", { productId, quantity });
      set({ cart: response.data });
    } catch (error) {
      set({
        cart: previousCart,
        error: error.response?.data?.error || "Failed to add to cart",
      });
      throw error;
    }
  },

  updateQuantity: async (cartItemId, newQuantity) => {
    const previousCart = get().cart;

    if (previousCart) {
      const updatedItems = previousCart.items.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item,
      );
      set({ cart: { ...previousCart, items: updatedItems } });
    }

    try {
      const response = await api.put(`/cart/update/${cartItemId}`, {
        quantity: newQuantity,
      });
      set({ cart: response.data });
    } catch (error) {
      set({
        cart: previousCart,
        error: error.response?.data?.error || "Failed to update quantity",
      });
      throw error;
    }
  },

  removeFromCart: async (cartItemId) => {
    const previousCart = get().cart;

    if (previousCart) {
      const updatedItems = previousCart.items.filter(
        (item) => item.id !== cartItemId,
      );
      set({ cart: { ...previousCart, items: updatedItems } });
    }

    try {
      const response = await api.delete(`/cart/remove/${cartItemId}`);
      set({ cart: response.data });
    } catch (error) {
      set({
        cart: previousCart,
        error: error.response?.data?.error || "Failed to remove item",
      });
      throw error;
    }
  },

  clearCart: async () => {
    const previousCart = get().cart;

    if (previousCart) {
      set({ cart: { ...previousCart, items: [] } });
    }

    try {
      await api.delete("/cart/clear");
      set({ cart: { ...previousCart, items: [] } });
    } catch (error) {
      set({
        cart: previousCart,
        error: error.response?.data?.error || "Failed to clear cart",
      });
      throw error;
    }
  },
}));
