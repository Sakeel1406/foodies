import mongoose from "mongoose";

const localURI = "mongodb://127.0.0.1:27017/foodies";

export const connectDB = async () => {
    try {
        await mongoose.connect(localURI);
        console.log("DB Connected to Local Server");
    } catch (error) {
        console.error("DB Connection Error:", error);
    }
};