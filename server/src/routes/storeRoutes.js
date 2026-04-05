const express = require("express");
const StoreController = require("../controllers/storeController");
const {
  authenticateToken,
  authorizeRoles,
  checkStoreOwnership,
} = require("../middleware/authMiddleware");

const router = express.Router();
const storeController = new StoreController();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("SELLER", "ADMIN"),
  storeController.createStore,
);

router.get(
  "/me",
  authenticateToken,
  authorizeRoles("SELLER", "ADMIN"),
  storeController.getStoreByOwner,
);

router.get("/:id", authenticateToken, storeController.getStore);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("SELLER", "ADMIN"),
  checkStoreOwnership,
  storeController.updateStore,
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("SELLER", "ADMIN"),
  checkStoreOwnership,
  storeController.deleteStore,
);

module.exports = router;
