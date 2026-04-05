const express = require("express");
const AuthController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  registerSchema,
  loginSchema,
  googleAuthSchema,
} = require("../validations/authValidation");

const router = express.Router();
const authController = new AuthController();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/google", validate(googleAuthSchema), authController.googleLogin);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.get("/me", authenticateToken, authController.me);

module.exports = router;
