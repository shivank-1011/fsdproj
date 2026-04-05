const express = require("express");
const OrderController = require("../controllers/orderController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();
const orderController = new OrderController();

router.post("/", authenticateToken, orderController.createOrder);
router.get("/", authenticateToken, orderController.getUserOrders);

module.exports = router;
