const express = require("express");
const {
  createStore,
  getStore,
  updateStore,
  deleteStore,
} = require("../controllers/storeController");
const {
  authenticateToken,
  authorizeRoles,
  checkStoreOwnership,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("SELLER", "ADMIN"),
  createStore,
);

router.get("/:id", authenticateToken, getStore);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("SELLER", "ADMIN"),
  checkStoreOwnership,
  updateStore,
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("SELLER", "ADMIN"),
  checkStoreOwnership,
  deleteStore,
);

module.exports = router;
