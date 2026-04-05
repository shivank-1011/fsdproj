const express = require("express");
const CartController = require("../controllers/cartController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();
const cartController = new CartController();

router.use(authenticateToken);

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.put("/update/:id", cartController.updateCartItem);
router.delete("/remove/:id", cartController.removeFromCart);
router.delete("/clear", cartController.clearCart);

module.exports = router;
