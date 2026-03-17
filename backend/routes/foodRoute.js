import express from "express";
import authMiddleware from "../middleware/auth.js";

import {
  addFood,
  listFood,
  removeFood,
  updatePrice,
  upload
} from "../controllers/foodController.js";

const router = express.Router();

router.post("/add", authMiddleware, upload.single("image"), addFood);

router.get("/list", listFood);

router.post("/remove", authMiddleware, removeFood);

router.post("/updateprice", authMiddleware, updatePrice);

export default router;
