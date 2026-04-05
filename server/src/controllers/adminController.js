const AdminService = require("../services/AdminService");

class AdminController {
  constructor() {
    this.adminService = new AdminService();
  }

  getAllUsers = async (req, res) => {
    try {
      const data = await this.adminService.getAllUsers(req.query);
      res.json(data);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  banUser = async (req, res) => {
    try {
      await this.adminService.banUser(req.body.userId);
      res.json({ message: "User banned successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  unbanUser = async (req, res) => {
    try {
      await this.adminService.unbanUser(req.body.userId);
      res.json({ message: "User unbanned successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  approveStore = async (req, res) => {
    try {
      await this.adminService.approveStore(req.body.storeId);
      res.json({ message: "Store approved successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  getAllStores = async (req, res) => {
    try {
      const data = await this.adminService.getAllStores(req.query);
      res.json(data);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  getDashboardStats = async (req, res) => {
    try {
      const data = await this.adminService.getDashboardStats();
      res.json(data);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };
}

module.exports = AdminController;
