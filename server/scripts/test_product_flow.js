const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const API_URL = "http://localhost:3000/api";

const testProductFlow = async () => {
  try {
    console.log("Starting Product Flow Test...");

    // 1. Cleanup (Optional, but good for idempotency)
    const email = `seller_${Date.now()}@example.com`;
    const password = "password123";

    // 2. Register User (Seller)
    console.log("Registering Seller...");
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      name: "Test Seller",
      role: "SELLER",
    });
    const { accessToken, user } = registerRes.data;
    console.log("Seller Registered:", user.email);

    const headers = { Authorization: `Bearer ${accessToken}` };

    // 3. Create Store
    console.log("Creating Store...");
    const storeRes = await axios.post(
      `${API_URL}/stores`,
      {
        name: `Test Store ${Date.now()}`,
        description: "A test store for products",
      },
      { headers },
    );
    const store = storeRes.data.store;
    console.log("Store Created:", store.name);

    // 4. Verify Store (Manually via Prisma)
    console.log("Verifying Store manually...");
    await prisma.store.update({
      where: { id: store.id },
      data: { isVerified: true },
    });
    console.log("Store Verified.");

    // 5. Create Product
    console.log("Creating Product...");
    const productData = {
      name: "Test Product",
      description: "This is a test product",
      price: 100.5,
      stock: 50,
      images: ["image1.jpg", "image2.jpg"],
    };
    const createProductRes = await axios.post(
      `${API_URL}/products`,
      productData,
      { headers },
    );
    const product = createProductRes.data.product;
    console.log("Product Created:", product.name);

    // 6. List Products (Public)
    console.log("Listing Products...");
    const listRes = await axios.get(`${API_URL}/products?search=Test&limit=5`);
    const { products, total } = listRes.data;
    console.log(`Found ${products.length} products (Total: ${total})`);

    const foundProduct = products.find((p) => p.id === product.id);
    if (!foundProduct) throw new Error("Created product not found in listing!");
    console.log("Product found in listing.");

    // 7. Update Product
    console.log("Updating Product...");
    const updateRes = await axios.put(
      `${API_URL}/products/${product.id}`,
      { price: 150.0, stock: 40 },
      { headers },
    );
    console.log(
      "Product Updated. New Price:",
      updateRes.data.product.price,
      "Stock:",
      updateRes.data.product.stock,
    );

    // 8. Delete Product
    console.log("Deleting Product...");
    await axios.delete(`${API_URL}/products/${product.id}`, { headers });
    console.log("Product Deleted.");

    // 9. Verify Deletion
    try {
      await axios.get(`${API_URL}/products/${product.id}`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("Product successfully verified as deleted (404).");
      } else {
        throw error;
      }
    }

    console.log("Product CRUD Test Passed Successfully!");
  } catch (error) {
    console.error(
      "Test Failed:",
      error.response ? error.response.data : error.message,
    );
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

testProductFlow();
