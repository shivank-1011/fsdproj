const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access token required" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied: insufficient permissions" });
    }
    next();
  };
};

const checkStoreOwnership = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const storeId = req.params.id; 

    // Admins can bypass ownership check
    if (req.user.role === "ADMIN") return next();

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    if (store.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Access denied: You do not own this store" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkProductOwnership = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const productId = req.params.id;

    if (req.user.role === "ADMIN") return next();

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { store: true },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.store.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Access denied: You do not own this product" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  checkStoreOwnership,
  checkProductOwnership,
};
