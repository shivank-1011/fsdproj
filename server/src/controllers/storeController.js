const StoreService = require("../services/StoreService");

class StoreController {
  constructor() {
    this.storeService = new StoreService();
  }

  createStore = async (req, res) => {
    try {
      const data = await this.storeService.createStore(
        req.user.userId,
        req.body,
      );
      res.status(201).json(data);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  getStore = async (req, res) => {
    try {
      const data = await this.storeService.getStore(req.params.id);
      res.json(data);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  getStoreByOwner = async (req, res) => {
    try {
      const data = await this.storeService.getStoreByOwner(req.user.userId);
      res.json(data);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  updateStore = async (req, res) => {
    try {
      const data = await this.storeService.updateStore(req.params.id, req.body);
      res.json(data);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  deleteStore = async (req, res) => {
    try {
      await this.storeService.deleteStore(req.params.id);
      res.json({ message: "Store deleted successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };
}

module.exports = StoreController;
