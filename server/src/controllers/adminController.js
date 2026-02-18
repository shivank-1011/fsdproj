const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
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
          store: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.user.count(),
    ]);

    res.json({
      users,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const banUser = async (req, res) => {
  const { userId } = req.body;
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isBanned: true },
    });
    res.json({ message: "User banned successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unbanUser = async (req, res) => {
  const { userId } = req.body;
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isBanned: false },
    });
    res.json({ message: "User unbanned successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveStore = async (req, res) => {
  const { storeId } = req.body;
  try {
    await prisma.store.update({
      where: { id: storeId },
      data: { isVerified: true },
    });
    res.json({ message: "Store approved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllStores = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        skip,
        take: Number(limit),
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.store.count(),
    ]);

    res.json({
      stores,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
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
          _sum: {
            quantity: true,
          },
          orderBy: {
            _sum: {
              quantity: "desc",
            },
          },
          take: 5,
        }),
      ]);

    const enrichedTopProducts = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, price: true, images: true },
        });
        return {
          ...product,
          totalSold: item._sum.quantity,
        };
      }),
    );

    res.json({
      totalUsers,
      totalSellers,
      totalSales: totalSales._sum.total || 0,
      totalOrders,
      topProducts: enrichedTopProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  banUser,
  unbanUser,
  approveStore,
  getAllStores,
  getDashboardStats,
};
