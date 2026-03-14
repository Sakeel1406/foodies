import mongoose from "mongoose";

const localURI = "mongodb+srv://sakeelnoufash_db_user:sakkenoufash007.@cluster0.ulkljsn.mongodb.net/foodies?retryWrites=true&w=majority";

export const connectDB = async () => {
    try {
        await mongoose.connect(localURI);
        console.log("DB Connected to Local Server");
    } catch (error) {
        console.error("DB Connection Error:", error);
    }
};
