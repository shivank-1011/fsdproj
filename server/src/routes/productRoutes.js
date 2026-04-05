const express = require("express");
const ProductController = require("../controllers/productController");
const {
  authenticateToken,
  authorizeRoles,
  checkProductOwnership,
} = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validate = require("../middleware/validate");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validations/productValidation");

const router = express.Router();
const productController = new ProductController();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("SELLER", "ADMIN"),
  upload.array("images", 5),
  validate(createProductSchema),
  productController.createProduct,
);

router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("SELLER", "ADMIN"),
  checkProductOwnership,
  validate(updateProductSchema),
  productController.updateProduct,
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("SELLER", "ADMIN"),
  checkProductOwnership,
  productController.deleteProduct,
);

module.exports = router;
