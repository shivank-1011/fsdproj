const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await prisma.$transaction(async (prisma) => {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
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

      const order = await prisma.order.create({
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
        include: {
          items: true,
        },
      });

      for (const item of cart.items) {
        const updatedProduct = await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (updatedProduct.stock < 0) {
          throw new Error(
            `Insufficient stock for product: ${updatedProduct.name}. Transaction rolled back.`,
          );
        }
      }

      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });

    res
      .status(201)
      .json({ message: "Order created successfully", order: result });
  } catch (error) {
    if (
      error.message.includes("Insufficient stock") ||
      error.message.includes("Cart is empty")
    ) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
};
