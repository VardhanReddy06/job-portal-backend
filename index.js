import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";

dotenv.config({});
const app=express();
 
//middelwares
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin:"http://localhost:",
    Credentials:true
}
app.use(cors(corsOptions));
app.get('/',(req,res)=>{
    res.send("server running succesfully")
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    connectDB();
    console.log(`server is running on PORT ${PORT}`)
});

