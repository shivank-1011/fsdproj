const express = require("express");
const {
  register,
  login,
  refreshToken,
  logout,
  me,
} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/me", authenticateToken, me);

module.exports = router;
