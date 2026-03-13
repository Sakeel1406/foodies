import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "./models/userModel.js"; 
import 'dotenv/config';

const createAdmin = async () => {
    try {
        
        await mongoose.connect(process.env.MONGO_URI);
        
        const email = "foodiesofficial82@gmail.com";
        const password = "foodiesadmin82"; 
        
        const exists = await userModel.findOne({ email });
        if (exists) {
            console.log("Admin already exists in the local database!");
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = new userModel({
            name: "Official Admin",
            email: email,
            password: hashedPassword,
            role: "admin" 
        });
        await admin.save();
        console.log("SUCCESS: Admin created in local MongoDB!");
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

createAdmin();