const { PrismaClient } = require("@prisma/client");
const cloudinary = require("../config/cloudinary");

const prisma = new PrismaClient();

class ProductService {
  /**
   * Creates a new product for a verified seller store.
   * Handles Cloudinary image uploads and URL image merging.
   * @returns {{ product }}
   */
  async createProduct({ name, description, price, stock, images }, files, userId) {
    const store = await prisma.store.findUnique({ where: { userId } });

    if (!store) {
      const error = new Error("Store not found. Create a store first.");
      error.statusCode = 404;
      throw error;
    }

    if (!store.isVerified) {
      const error = new Error("Store is not verified. Please wait for admin approval.");
      error.statusCode = 403;
      throw error;
    }

    let imageUrls = [];
    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "image",
              folder: "products",
              transformation: [
                { width: 1000, crop: "scale" },
                { quality: "auto" },
                { fetch_format: "auto" },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            },
          );
          uploadStream.end(file.buffer);
        }),
      );
      imageUrls = await Promise.all(uploadPromises);
    }

    if (images) {
      if (Array.isArray(images)) {
        imageUrls = [...imageUrls, ...images];
      } else {
        imageUrls.push(images);
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock: parseInt(stock),
        images: imageUrls,
        storeId: store.id,
      },
    });

    return { product };
  }

  /**
   * Returns a paginated, filtered, and sorted list of products.
   * @returns {{ products, total, page, totalPages }}
   */
  async getProducts({ page = 1, limit = 10, search, minPrice, maxPrice, sortBy, order = "asc" }) {
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

    const orderBy = sortBy
      ? { [sortBy]: order === "desc" ? "desc" : "asc" }
      : { createdAt: "desc" };

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

    return { products, total, page: pageNum, totalPages: Math.ceil(total / limitNum) };
  }

  /**
   * Finds a single product by ID, including its store.
   * @returns {{ product }}
   */
  async getProduct(id) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { store: true },
    });

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    return { product };
  }

  /**
   * Updates a product's details.
   * @returns {{ product }}
   */
  async updateProduct(id, { name, description, price, stock, images }) {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, description, price, stock, images },
    });
    return { product: updatedProduct };
  }

  /**
   * Deletes a product by ID.
   */
  async deleteProduct(id) {
    await prisma.product.delete({ where: { id } });
  }
}

module.exports = ProductService;
