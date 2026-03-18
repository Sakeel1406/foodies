import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import foodModel from "../models/foodModel.js";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "foodies",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 800, crop: "limit" }],
  },
});

const upload = multer({ storage });

// ADD FOOD
const addFood = async (req, res) => {
  try {
        console.log("Body:", req.body);       // ← add this
    console.log("File:", req.file);
    if (!req.file) {
      return res.json({ success: false, message: "No image uploaded" });
    }

    const image_url = req.file.path;

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_url,
      rating: req.body.rating || 0,
    });

    await food.save();

    res.json({
      success: true,
      message: "Food Added",
      data: food,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding food" });
  }
};

// LIST FOODS
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({
      success: true,
      data: foods,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching foods" });
  }
};

// REMOVE FOOD
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    const publicId = food.image.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(`foodies/${publicId}`);

    await foodModel.findByIdAndDelete(req.body.id);

    res.json({
      success: true,
      message: "Food Removed",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error removing food" });
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

    if (type === "add") {
      food.price += 1;
    } else if (type === "sub" && food.price > 0) {
      food.price -= 1;
    }

    await food.save();

    res.json({
      success: true,
      message: "Price Updated",
      data: food,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating price" });
  }
};

export { addFood, listFood, removeFood, updatePrice, upload };

// Paste this entire block
const token = localStorage.getItem("token");
console.log("TOKEN:", token ? "EXISTS ✅" : "NULL ❌");

fetch("https://foodies-backend-nf43.onrender.com/")
  .then(r => r.text())
  .then(d => console.log("BACKEND:", d))
  .catch(() => console.log("BACKEND: DOWN ❌"));

fetch("https://foodies-backend-nf43.onrender.com/api/user/admin-login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ 
    email: "foodiesofficial82@gmail.com", 
    password: "test123" 
  })
})
.then(r => r.json())
.then(d => console.log("LOGIN ROUTE:", d))
.catch(() => console.log("LOGIN ROUTE: NOT FOUND ❌"));