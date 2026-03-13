import foodModel from "../models/foodModel.js";
import fs from 'fs';

// add food item
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
        rating: req.body.rating 
    })

    try {
        await food.save();
        res.json({ success: true, message: "Food Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }
}

// remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        // Delete image from uploads folder
        fs.unlink(`uploads/${food.image}`, () => { });
        
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// update food price (Increase/Decrease)
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
        res.json({ success: true, message: "Price Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating price" });
    }
}


export { addFood, listFood, removeFood, updatePrice }