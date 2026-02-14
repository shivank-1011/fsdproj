const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./src/routes/authRoutes");
const storeRoutes = require("./src/routes/storeRoutes");
const productRoutes = require("./src/routes/productRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", require("./src/routes/cartRoutes"));
app.use("/api/orders", require("./src/routes/orderRoutes"));

app.get("/", (req, res) => {
  res.send("Welcome to the E-Commerce API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
