const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class StoreService {
  /**
   * Creates a new store for a user. Prevents duplicate stores per user.
   * @returns {{ store }}
   */
  async createStore(userId, { name, description }) {
    const existingStore = await prisma.store.findUnique({ where: { userId } });

    if (existingStore) {
      const error = new Error("User already has a store");
      error.statusCode = 400;
      throw error;
    }

    const store = await prisma.store.create({
      data: { name, description, userId },
    });

    return { store };
  }

  /**
   * Finds a store by its ID, including all its products.
   * @returns {{ store }}
   */
  async getStore(id) {
    const store = await prisma.store.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!store) {
      const error = new Error("Store not found");
      error.statusCode = 404;
      throw error;
    }

    return { store };
  }

  /**
   * Finds the store belonging to the authenticated user.
   * @returns {{ store }}
   */
  async getStoreByOwner(userId) {
    const store = await prisma.store.findUnique({
      where: { userId },
      include: { products: true },
    });

    if (!store) {
      const error = new Error("Store not found");
      error.statusCode = 404;
      throw error;
    }

    return { store };
  }

  /**
   * Updates a store's name and description.
   * @returns {{ store }}
   */
  async updateStore(id, { name, description }) {
    const updatedStore = await prisma.store.update({
      where: { id },
      data: { name, description },
    });

    return { store: updatedStore };
  }

  /**
   * Deletes a store by ID.
   */
  async deleteStore(id) {
    await prisma.store.delete({ where: { id } });
  }
}

module.exports = StoreService;
