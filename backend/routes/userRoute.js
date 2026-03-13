import express from "express";
import { 
  loginUser, 
  registerUser, 
  adminLogin, 
  forgotPassword, 
  resetPassword, 
  getProfile, 
  updateProfile 
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();


//    AUTH & PASSWORD ROUTES

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.post("/admin-login", adminLogin); 
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);


//    PROFILE ROUTES 

// Frontend POST to /api/user/update-profile
userRouter.post("/update-profile", authMiddleware, updateProfile);

// Frontend GET to /api/user/get-profile
userRouter.get("/get-profile", authMiddleware, getProfile);

export default userRouter;