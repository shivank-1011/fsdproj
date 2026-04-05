const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class OrderService {
  /**
   * Creates an order from the user's current cart using a DB transaction.
   * Validates stock, calculates total, decrements stock, and clears cart.
   * @returns {{ message, order }}
   */
  async createOrder(userId) {
    const order = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      let total = 0;
      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for product: ${item.product.name}. Available: ${item.product.stock}, Requested: ${item.quantity}`,
          );
        }
        total += Number(item.product.price) * item.quantity;
      }

      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: "PENDING",
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of cart.items) {
        const updatedProduct = await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });

        if (updatedProduct.stock < 0) {
          throw new Error(
            `Insufficient stock for product: ${updatedProduct.name}. Transaction rolled back.`,
          );
        }
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    return { message: "Order created successfully", order };
  }

  /**
   * Fetches a paginated list of orders for a specific user.
   * @returns {{ orders, total, page, totalPages }}
   */
  async getUserOrders(userId, { page = 1, limit = 10 }) {
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: true } } },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return {
      orders,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }
}

module.exports = OrderService;
