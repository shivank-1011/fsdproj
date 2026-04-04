const request = require("supertest");
const app = require("../../app");

describe("API Integration Tests", () => {
  describe("Public Endpoints", () => {
    it("GET / should return Welcome message", async () => {
      const res = await request(app).get("/");
      expect(res.statusCode).toEqual(200);
      expect(res.text).toBe("Welcome to the E-Commerce API");
    });
  });

  describe("Product Endpoints", () => {
    it("GET /api/products should return an array of products (possibly empty)", async () => {
      const res = await request(app).get("/api/products");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.products)).toBe(true);
    });
  });
});
