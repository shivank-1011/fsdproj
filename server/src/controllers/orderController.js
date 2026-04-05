const OrderService = require("../services/OrderService");

class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  createOrder = async (req, res) => {
    try {
      const data = await this.orderService.createOrder(req.user.userId);
      res.status(201).json(data);
    } catch (error) {
      if (
        error.message.includes("Insufficient stock") ||
        error.message.includes("Cart is empty")
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  getUserOrders = async (req, res) => {
    try {
      const data = await this.orderService.getUserOrders(
        req.user.userId,
        req.query,
      );
      res.json(data);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };
}

module.exports = OrderController;
