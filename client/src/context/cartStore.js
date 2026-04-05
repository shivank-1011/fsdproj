import { create } from "zustand";
import { cartApiService } from "../services/CartApiService";

export const useCartStore = create((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartApiService.getCart();
      set({ cart: response, isLoading: false });
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
      const response = await cartApiService.addToCart(productId, quantity);
      set({ cart: response });
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
      const response = await cartApiService.updateQuantity(cartItemId, newQuantity);
      set({ cart: response });
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
      const response = await cartApiService.removeFromCart(cartItemId);
      set({ cart: response });
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
      await cartApiService.clearCart();
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
