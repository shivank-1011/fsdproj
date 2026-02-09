const axios = require("axios");

const API_URL = "http://localhost:3001/api";

const registerAndLogin = async (name, email, password, role) => {
  try {
    // Try login first
    try {
      const loginRes = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      return loginRes.data.accessToken;
    } catch (e) {
      // If login fails, try register
      await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        role,
      });
      const loginRes = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      return loginRes.data.accessToken;
    }
  } catch (error) {
    console.error(
      `Failed to auth user ${name}:`,
      error.response?.data || error.message,
    );
    process.exit(1);
  }
};

const runTests = async () => {
  console.log("Starting RBAC Tests...");

  // 1. Setup Users
  const adminToken = await registerAndLogin(
    "Admin",
    "admin@test.com",
    "password123",
    "ADMIN",
  );
  const sellerToken = await registerAndLogin(
    "Seller",
    "seller@test.com",
    "password123",
    "SELLER",
  );
  const userToken = await registerAndLogin(
    "User",
    "user@test.com",
    "password123",
    "USER",
  );
  const seller2Token = await registerAndLogin(
    "Seller2",
    "seller2@test.com",
    "password123",
    "SELLER",
  );

  console.log("✅ Authentication successful for all roles");

  let storeId;
  let productId;

  // 2. Seller creates a store
  try {
    const res = await axios.post(
      `${API_URL}/stores`,
      {
        name: "Seller Store " + Date.now(),
        description: "Best store",
      },
      { headers: { Authorization: `Bearer ${sellerToken}` } },
    );
    storeId = res.data.store.id;
    console.log("✅ Seller created store");
  } catch (error) {
    console.error(
      "❌ Seller failed to create store:",
      error.response?.data || error.message,
    );
  }

  // 3. User tries to create a store (Should FAIL)
  try {
    await axios.post(
      `${API_URL}/stores`,
      {
        name: "User Store",
        description: "Should fail",
      },
      { headers: { Authorization: `Bearer ${userToken}` } },
    );
    console.error("❌ User managed to create store (Should have failed)");
  } catch (error) {
    if (error.response?.status === 403) {
      console.log("✅ User blocked from creating store");
    } else {
      console.error(
        "❌ Unexpected error for user creating store:",
        error.response?.status,
      );
    }
  }

  // 4. Seller adds product to own store
  try {
    const res = await axios.post(
      `${API_URL}/products`,
      {
        name: "Test Product",
        description: "Description",
        price: 100,
        stock: 10,
        images: ["img.png"],
      },
      { headers: { Authorization: `Bearer ${sellerToken}` } },
    );
    productId = res.data.product.id;
    console.log("✅ Seller added product to own store");
  } catch (error) {
    console.error(
      "❌ Seller failed to add product:",
      error.response?.data || error.message,
    );
  }

  // 5. User tries to update Seller's product (Should FAIL)
  try {
    await axios.put(
      `${API_URL}/products/${productId}`,
      { name: "Hacked Product" },
      { headers: { Authorization: `Bearer ${userToken}` } },
    );
    console.error("❌ User updated seller's product (Should have failed)");
  } catch (error) {
    if (error.response?.status === 403) {
      console.log("✅ User blocked from updating seller's product");
    } else {
      console.error(
        "❌ Unexpected error for user updating product:",
        error.response?.status,
      );
    }
  }

  // 6. Seller2 tries to update Seller's product (Should FAIL - Ownership check)
  try {
    await axios.put(
      `${API_URL}/products/${productId}`,
      { name: "Competitor Hack" },
      { headers: { Authorization: `Bearer ${seller2Token}` } },
    );
    console.error("❌ Seller2 updated Seller1's product (Should have failed)");
  } catch (error) {
    if (error.response?.status === 403) {
      console.log("✅ Seller2 blocked from updating Seller1's product");
    } else {
      console.error(
        "❌ Unexpected error for Seller2 updating product:",
        error.response?.status,
      );
    }
  }

  // 7. Admin deletes Seller's product (Should SUCCEED)
  try {
    await axios.delete(`${API_URL}/products/${productId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log("✅ Admin deleted seller's product");
  } catch (error) {
    console.error(
      "❌ Admin failed to delete product:",
      error.response?.data || error.message,
    );
  }
};

runTests();
