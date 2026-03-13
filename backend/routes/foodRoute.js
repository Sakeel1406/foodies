import express from "express";
import { addFood, listFood, removeFood, updatePrice } from "../controllers/foodController.js";
import multer from "multer";
import authMiddleware from "../middleware/auth.js";

const foodRouter = express.Router();

// Image Storage
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
});

const upload = multer({ storage: storage });

// API 
foodRouter.post("/add", authMiddleware, upload.single("image"), addFood);
foodRouter.get("/list", listFood); 
foodRouter.post("/remove", authMiddleware, removeFood);
foodRouter.post("/updateprice", authMiddleware, updatePrice); 

export default foodRouter;