import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import foodModel from "../models/foodModel.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// storage with unique filename every time
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "foodies",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      transformation: [{ width: 800, crop: "limit" }],
      public_id: `food_${Date.now()}`,
      // invalidate: true,
    };
  },
});

const upload = multer({ storage });

// ADD FOOD
const addFood = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No image uploaded" 
      });
    }

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      image: req.file.path,
      rating: Number(req.body.rating) || 0,
    });

    await food.save();
    res.json({ success: true, message: "Food Added", data: food });

  } catch (error) {
    console.error("ADD FOOD ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// LIST FOODS
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching foods" });
  }
};

// REMOVE FOOD
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    //  public ID extraction
    const urlParts = food.image.split("/");
    const filename = urlParts[urlParts.length - 1].split(".")[0];
    const publicId = `foodies/${filename}`;

    await cloudinary.uploader.destroy(publicId);
    await foodModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Food Removed" });

  } catch (error) {
    console.error("REMOVE FOOD ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE PRICE
const updatePrice = async (req, res) => {
  try {
    const { id, type } = req.body;
    const food = await foodModel.findById(id);

    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    if (type === "add") food.price += 1;
    else if (type === "sub" && food.price > 0) food.price -= 1;

    await food.save();
    res.json({ success: true, message: "Price Updated", data: food });

  } catch (error) {
    console.error("UPDATE PRICE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addFood, listFood, removeFood, updatePrice, upload };