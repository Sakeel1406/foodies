import express from "express";
import multer from "multer";
import { addFood, listFood, removeFood, updatePrice } from "../controllers/foodController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Multer Storage with unique filenames
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Routes
router.post("/add", authMiddleware, upload.single("image"), addFood);
router.get("/list", listFood);
router.post("/remove", authMiddleware, removeFood);
router.post("/updateprice", authMiddleware, updatePrice);

export default router;
