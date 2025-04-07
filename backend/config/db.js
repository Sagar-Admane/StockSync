import mongoose from "mongoose";
import env from "dotenv";
env.config();

async function connectDB(){
    try {
        const con = await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected");
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;