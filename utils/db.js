import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log("MONGODB connected successfully");
    } catch (error) {
        console.log(error)
    }
}

export default connectDB;