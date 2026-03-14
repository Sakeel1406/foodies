// controllers/foodController.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import foodModel from "../models/foodModel.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "foodies", // optional folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 800, crop: "limit" }],
  },
});

const upload = multer({ storage });

// ----------------- Food Controllers -----------------

// Add a food item
const addFood = async (req, res) => {
  if (!req.file) return res.json({ success: false, message: "No image uploaded" });

  const image_url = req.file.path; // Cloudinary URL

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_url,
    rating: req.body.rating || 0,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food Added", data: food });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error saving food" });
  }
};

// List all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching foods" });
  }
};

// Remove a food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) return res.json({ success: false, message: "Food not found" });

    // Delete image from Cloudinary
    const publicId = food.image.match(/\/([^\/]+)\.\w+$/)[1]; // extract file name from URL
    await cloudinary.uploader.destroy(`foodies/${publicId}`);

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error removing food" });
  }
};

// Update food price (Increase / Decrease)
const updatePrice = async (req, res) => {
  try {
    const { id, type } = req.body;
    const food = await foodModel.findById(id);
    if (!food) return res.json({ success: false, message: "Food not found" });

    if (type === "add") food.price += 1;
    else if (type === "sub" && food.price > 0) food.price -= 1;

    await food.save();
    res.json({ success: true, message: "Price Updated", data: food });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating price" });
  }
};

export { addFood, listFood, removeFood, updatePrice, upload };
