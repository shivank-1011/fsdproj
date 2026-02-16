const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
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
    });
    res.json(users);
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
    const stores = await prisma.store.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    res.json(stores);
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
};
