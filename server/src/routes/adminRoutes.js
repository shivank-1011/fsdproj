const express = require("express");
const {
  getAllUsers,
  banUser,
  unbanUser,
  approveStore,
  getAllStores,
  getDashboardStats,
} = require("../controllers/adminController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken, authorizeRoles("ADMIN"));

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.post("/users/ban", banUser);
router.post("/users/unban", unbanUser);

router.get("/stores", getAllStores);
router.post("/stores/approve", approveStore);

module.exports = router;
