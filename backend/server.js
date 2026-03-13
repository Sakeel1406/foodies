import "dotenv/config"; 
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// CORS CONFIGURATION
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://foodies-frontend-qe7j.onrender.com",
        "https://foodies-pulb.onrender.com"
    ],
    credentials: true
}));

// DB Connection
connectDB();

// API 
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/images", express.static('uploads'));

app.get("/", (req, res) => {
    res.send("Foodies API - Admin & User Ready");
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
