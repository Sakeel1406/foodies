import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import fs from "fs";

import { connectDB } from "./config/db.js";

import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

import errorHandler from "./middleware/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 4000;


app.set('trust proxy', 1);

if (!fs.existsSync("uploads")) {           // ← ADD THIS
  fs.mkdirSync("uploads", { recursive: true }); // ← ADD THIS
}

// Connect Database
connectDB();

app.use(express.json());

// CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "token"]
}));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

app.use("/api", limiter);

// Routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Static Images
app.use("/images", express.static("uploads"));

// Test Route
app.get("/", (req, res) => {
  res.send("Foodies API Running 🚀");
});

// Error Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});