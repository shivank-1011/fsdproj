const CartService = require("../services/CartService");

class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  getCart = async (req, res) => {
    try {
      const cart = await this.cartService.getOrCreateCart(req.user.userId);
      res.json(cart);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  addToCart = async (req, res) => {
    try {
      const cart = await this.cartService.addToCart(req.user.userId, req.body);
      res.json(cart);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  updateCartItem = async (req, res) => {
    try {
      const cart = await this.cartService.updateCartItem(
        req.params.id,
        req.body.quantity,
        req.user.userId,
      );
      res.json(cart);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  removeFromCart = async (req, res) => {
    try {
      const cart = await this.cartService.removeFromCart(
        req.params.id,
        req.user.userId,
      );
      res.json(cart);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  clearCart = async (req, res) => {
    try {
      await this.cartService.clearCart(req.user.userId);
      res.json({ message: "Cart cleared successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };
}

module.exports = CartController;
