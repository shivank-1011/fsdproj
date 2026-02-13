const express = require("express");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const {
  authenticateToken,
  authorizeRoles,
  checkProductOwnership,
} = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();
router.post(
  "/",
  authenticateToken,
  authorizeRoles("SELLER", "ADMIN"),
  upload.array("images", 5),
  createProduct,
);

router.get("/", getProducts);
router.get("/:id", getProduct);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("SELLER", "ADMIN"),
  checkProductOwnership,
  updateProduct,
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("SELLER", "ADMIN"),
  checkProductOwnership,
  deleteProduct,
);

module.exports = router;
