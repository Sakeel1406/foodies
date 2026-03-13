import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  addFeedback,
  updateProfile,
  getUserData 
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", authMiddleware, verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.post("/feedback", authMiddleware, addFeedback);

// 2. Changed 'userRouter' to 'orderRouter' to match the constant above
orderRouter.get("/get-profile", authMiddleware, getUserData); 
orderRouter.post("/update-profile", authMiddleware, updateProfile);

// routes/orderRoute.js
orderRouter.post("/status", authMiddleware, updateStatus); 
orderRouter.get("/list", listOrders);           

export default orderRouter;