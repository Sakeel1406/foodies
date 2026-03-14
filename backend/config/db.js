import mongoose from "mongoose";

const localURI = "mongodb+srv://sakeelnoufash_db_user:<db_password>@cluster0.ulkljsn.mongodb.net/foodies";

export const connectDB = async () => {
    try {
        await mongoose.connect(localURI);
        console.log("DB Connected to Local Server");
    } catch (error) {
        console.error("DB Connection Error:", error);
    }
};
