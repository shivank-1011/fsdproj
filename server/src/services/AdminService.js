const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class AdminService {
  /**
   * Fetches a paginated list of all users with their store info.
   * @returns {{ users, total, page, totalPages }}
   */
  async getAllUsers({ page = 1, limit = 10 }) {
    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: Number(limit),
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isBanned: true,
          createdAt: true,
          store: { select: { id: true, name: true } },
        },
      }),
      prisma.user.count(),
    ]);

    return { users, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  /**
   * Bans a user by their ID.
   */
  async banUser(userId) {
    await prisma.user.update({ where: { id: userId }, data: { isBanned: true } });
  }

  /**
   * Lifts a ban from a user by their ID.
   */
  async unbanUser(userId) {
    await prisma.user.update({ where: { id: userId }, data: { isBanned: false } });
  }

  /**
   * Marks a store as verified/approved.
   */
  async approveStore(storeId) {
    await prisma.store.update({ where: { id: storeId }, data: { isVerified: true } });
  }

  /**
   * Fetches a paginated list of all stores.
   * @returns {{ stores, total, page, totalPages }}
   */
  async getAllStores({ page = 1, limit = 10 }) {
    const skip = (Number(page) - 1) * Number(limit);

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        skip,
        take: Number(limit),
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.store.count(),
    ]);

    return { stores, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  /**
   * Aggregates admin dashboard statistics including top products.
   * @returns {{ totalUsers, totalSellers, totalSales, totalOrders, topProducts }}
   */
  async getDashboardStats() {
    const [totalUsers, totalSellers, totalSales, totalOrders, topProducts] =
      await prisma.$transaction([
        prisma.user.count({ where: { role: "USER" } }),
        prisma.user.count({ where: { role: "SELLER" } }),
        prisma.order.aggregate({
          _sum: { total: true },
          where: { status: { not: "CANCELLED" } },
        }),
        prisma.order.count(),
        prisma.orderItem.groupBy({
          by: ["productId"],
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: "desc" } },
          take: 5,
        }),
      ]);

    const enrichedTopProducts = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, price: true, images: true },
        });
        return { ...product, totalSold: item._sum.quantity };
      }),
    );

    return {
      totalUsers,
      totalSellers,
      totalSales: totalSales._sum.total || 0,
      totalOrders,
      topProducts: enrichedTopProducts,
    };
  }
}

module.exports = AdminService;
