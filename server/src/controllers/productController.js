const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, images } = req.body;
    const userId = req.user.userId;

    const store = await prisma.store.findUnique({
      where: { userId },
    });

    if (!store) {
      return res
        .status(404)
        .json({ error: "Store not found. Create a store first." });
    }

    if (!store.isVerified) {
      return res.status(403).json({
        error: "Store is not verified. Please wait for admin approval.",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        images,
        storeId: store.id,
      },
    });

    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      minPrice,
      maxPrice,
      sortBy,
      order = "asc",
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const orderBy = {};
    if (sortBy) {
      orderBy[sortBy] = order === "desc" ? "desc" : "asc";
    } else {
      orderBy.createdAt = "desc";
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: { store: { select: { name: true } } },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { store: true },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, images } = req.body;
    const productId = req.params.id;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
        stock,
        images,
      },
    });

    res.json({ product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    await prisma.product.delete({
      where: { id: productId },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
