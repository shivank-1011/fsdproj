const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createStore = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.userId;
    
    const existingStore = await prisma.store.findUnique({
      where: { userId },
    });

    if (existingStore) {
      return res.status(400).json({ error: "User already has a store" });
    }

    const store = await prisma.store.create({
      data: {
        name,
        description,
        userId,
      },
    });

    res.status(201).json({ store });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStore = async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: req.params.id },
      include: { products: true },
    });

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json({ store });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStore = async (req, res) => {
  try {
    const { name, description } = req.body;
    const storeId = req.params.id;

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: { name, description },
    });

    res.json({ store: updatedStore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStore = async (req, res) => {
  try {
    const storeId = req.params.id;

    await prisma.store.delete({
      where: { id: storeId },
    });

    res.json({ message: "Store deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createStore,
  getStore,
  updateStore,
  deleteStore,
};
