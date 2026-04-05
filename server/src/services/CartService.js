const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class CartService {
  /**
   * Gets or creates the cart for a user, including all items with products.
   * @returns {Cart}
   */
  async getOrCreateCart(userId) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } },
      });
    }

    return cart;
  }

  /**
   * Adds a product to the cart or increments its quantity.
   * Validates stock before adding.
   * @returns {Cart}
   */
  async addToCart(userId, { productId, quantity }) {
    if (!productId || !quantity || quantity <= 0) {
      const error = new Error("Invalid product or quantity");
      error.statusCode = 400;
      throw error;
    }

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        const error = new Error("Requested quantity exceeds stock");
        error.statusCode = 400;
        throw error;
      }
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      if (quantity > product.stock) {
        const error = new Error("Requested quantity exceeds stock");
        error.statusCode = 400;
        throw error;
      }
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    return prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } },
    });
  }

  /**
   * Updates the quantity of a cart item. Validates ownership and stock.
   * @returns {Cart}
   */
  async updateCartItem(cartItemId, quantity, userId) {
    if (!quantity || quantity <= 0) {
      const error = new Error("Invalid quantity");
      error.statusCode = 400;
      throw error;
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { product: true, cart: true },
    });

    if (!cartItem) {
      const error = new Error("Cart item not found");
      error.statusCode = 404;
      throw error;
    }

    if (cartItem.cart.userId !== userId) {
      const error = new Error("Unauthorized");
      error.statusCode = 403;
      throw error;
    }

    if (quantity > cartItem.product.stock) {
      const error = new Error("Requested quantity exceeds stock");
      error.statusCode = 400;
      throw error;
    }

    await prisma.cartItem.update({ where: { id: cartItemId }, data: { quantity } });

    return prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: { items: { include: { product: true } } },
    });
  }

  /**
   * Removes a single item from the cart. Validates ownership.
   * @returns {Cart}
   */
  async removeFromCart(cartItemId, userId) {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) {
      const error = new Error("Cart item not found");
      error.statusCode = 404;
      throw error;
    }

    if (cartItem.cart.userId !== userId) {
      const error = new Error("Unauthorized");
      error.statusCode = 403;
      throw error;
    }

    await prisma.cartItem.delete({ where: { id: cartItemId } });

    return prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: { items: { include: { product: true } } },
    });
  }

  /**
   * Clears all items from a user's cart.
   */
  async clearCart(userId) {
    const cart = await prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      const error = new Error("Cart not found");
      error.statusCode = 404;
      throw error;
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}

module.exports = CartService;
