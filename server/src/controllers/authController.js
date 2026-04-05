const AuthService = require("../services/AuthService");

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res) => {
    try {
      const data = await this.authService.register(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const data = await this.authService.login(req.body);
      res.json(data);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  googleLogin = async (req, res) => {
    try {
      const data = await this.authService.googleLogin(req.body);
      res.status(200).json(data);
    } catch (error) {
      console.error("Google Auth Error:", error);
      res
        .status(error.statusCode || 500)
        .json({ error: error.message || "Google authentication failed" });
    }
  };

  refreshToken = async (req, res) => {
    try {
      const { refreshToken } = req.body;
      const data = await this.authService.refreshAccessToken(refreshToken);
      res.json(data);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  logout = async (req, res) => {
    try {
      const { refreshToken } = req.body;
      await this.authService.logout(refreshToken);
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  me = async (req, res) => {
    try {
      const data = await this.authService.getMe(req.user.userId);
      res.json(data);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };
}

module.exports = AuthController;
