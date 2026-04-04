const AppError = require("../../src/utils/AppError");

describe("AppError Unit Tests", () => {
  it("should create an error with the correct message and status code", () => {
    const error = new AppError("Test Error", 400);
    expect(error.message).toBe("Test Error");
    expect(error.statusCode).toBe(400);
  });

  it('should set status to "fail" for 4xx status codes', () => {
    const error = new AppError("Bad Request", 400);
    expect(error.status).toBe("fail");
  });

  it('should set status to "error" for 5xx status codes', () => {
    const error = new AppError("Internal Server Error", 500);
    expect(error.status).toBe("error");
  });

  it("should mark error as operational", () => {
    const error = new AppError("Test Error", 400);
    expect(error.isOperational).toBe(true);
  });
});
