const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const API_URL = "http://localhost:3000/api";

async function verifyStoreModule() {
  try {
    console.log("Starting Store Module Verification...");

    // 1. Register a new Seller
    const email = `seller_${Date.now()}@example.com`;
    const password = "password123";
    console.log(`\n1. Registering seller: ${email}`);

    let response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      name: "Test Seller",
      role: "SELLER",
    });

    const token = response.data.accessToken;
    console.log("Seller registered successfully");

    // 2. Create Store
    console.log("\n2. Creating Store...");
    const storeName = `Test Store ${Date.now()}`;
    response = await axios.post(
      `${API_URL}/stores`,
      {
        name: storeName,
        description: "A test store description",
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const storeId = response.data.store.id;
    console.log("Store created successfully");

    // 3. Fetch Store (Verify isVerified = false)
    console.log(
      "\n3. Fetching Store (Checking default verification status)...",
    );
    response = await axios.get(`${API_URL}/stores/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.store.isVerified === false) {
      console.log("Store is correctly unverified by default");
    } else {
      console.error("Error: Store should be unverified by default");
      process.exit(1);
    }

    // 4. Create Product (Should Fail)
    console.log("\n4. Attempting to create product (Should fail)...");
    try {
      await axios.post(
        `${API_URL}/products`,
        {
          name: "Test Product",
          description: "Description",
          price: 100,
          stock: 10,
          images: [],
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.error("Error: Product creation should have failed");
      process.exit(1);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log("Product creation blocked as expected (403 Forbidden)");
      } else {
        console.error(
          `Error: Unexpected status code ${error.response ? error.response.status : error.message}`,
        );
        process.exit(1);
      }
    }

    // 5. Verify Store (Manually update DB)
    console.log("\n5. Manually verifying store in database...");
    await prisma.store.update({
      where: { id: storeId },
      data: { isVerified: true },
    });
    console.log("Store verified in DB");

    // 6. Fetch Store (Verify isVerified = true)
    console.log("\n6. Fetching Store (Checking verification status)...");
    response = await axios.get(`${API_URL}/stores/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.store.isVerified === true) {
      console.log("Store status reflected as verified");
    } else {
      console.error("Error: Store should be verified now");
      process.exit(1);
    }

    // 7. Create Product (Should Success)
    console.log("\n7. Attempting to create product (Should success)...");
    response = await axios.post(
      `${API_URL}/products`,
      {
        name: "Test Product",
        description: "Description",
        price: 100,
        stock: 10,
        images: ["image1.jpg"],
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (response.status === 201) {
      console.log("Product created successfully");
    } else {
      console.error("Error: Product creation failed");
      process.exit(1);
    }

    console.log("\nALL CHECKS PASSED!");
  } catch (error) {
    console.error("\nVerification Failed:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  } finally {
    await prisma.$disconnect();
  }
}

verifyStoreModule();
