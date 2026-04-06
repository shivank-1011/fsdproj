const app = require("./app");
const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
});
