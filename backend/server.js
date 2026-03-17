import "dotenv/config";
import express from "express";
import cors from "cors";
<<<<<<< HEAD
import rateLimit from "express-rate-limit";
=======
>>>>>>> 0a311298d6ec06f98250eaedb34d6643d70fc220

import { connectDB } from "./config/db.js";

import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

import errorHandler from "./middleware/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Connect Database
connectDB();

app.use(express.json());

<<<<<<< HEAD
// CORS
=======
>>>>>>> 0a311298d6ec06f98250eaedb34d6643d70fc220
app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization","token"]
}));

<<<<<<< HEAD
// Rate Limiter (protect API)
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
=======
connectDB();

>>>>>>> 0a311298d6ec06f98250eaedb34d6643d70fc220
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Static Images
app.use("/images", express.static("uploads"));

// Test Route
app.get("/", (req, res) => {
<<<<<<< HEAD
  res.send("Foodies API Running 🚀");
});

// Error Middleware (always last)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
=======
  res.send("Foodies API running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
>>>>>>> 0a311298d6ec06f98250eaedb34d6643d70fc220
