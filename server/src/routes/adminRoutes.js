const express = require("express");
const AdminController = require("../controllers/adminController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();
const adminController = new AdminController();

router.use(authenticateToken, authorizeRoles("ADMIN"));

router.get("/dashboard", adminController.getDashboardStats);
router.get("/users", adminController.getAllUsers);
router.post("/users/ban", adminController.banUser);
router.post("/users/unban", adminController.unbanUser);

router.get("/stores", adminController.getAllStores);
router.post("/stores/approve", adminController.approveStore);

module.exports = router;
