const ProductService = require("../services/ProductService");

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  createProduct = async (req, res) => {
    try {
      const data = await this.productService.createProduct(
        req.body,
        req.files,
        req.user.userId,
      );
      res.status(201).json(data);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  getProducts = async (req, res) => {
    try {
      const data = await this.productService.getProducts(req.query);
      res.json(data);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  getProduct = async (req, res) => {
    try {
      const data = await this.productService.getProduct(req.params.id);
      res.json(data);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  updateProduct = async (req, res) => {
    try {
      const data = await this.productService.updateProduct(
        req.params.id,
        req.body,
      );
      res.json(data);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  deleteProduct = async (req, res) => {
    try {
      await this.productService.deleteProduct(req.params.id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };
}

module.exports = ProductController;
