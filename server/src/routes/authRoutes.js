const express = require("express");
const {
  register,
  login,
  googleLogin,
  refreshToken,
  logout,
  me,
} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  registerSchema,
  loginSchema,
  googleAuthSchema,
} = require("../validations/authValidation");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/google", validate(googleAuthSchema), googleLogin);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/me", authenticateToken, me);

module.exports = router;
