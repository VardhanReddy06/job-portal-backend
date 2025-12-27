import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from"./routes/applicationRoutes.js"

dotenv.config({});
const app=express();
 
//middelwares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin:"http://localhost:",
    Credentials:true
}
app.use(cors(corsOptions));

app.use("/api/user",userRoutes);
app.use("/api/company",companyRoutes);
app.use("/api/job",jobRoutes);
app.use("/api/application",applicationRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    connectDB();
    console.log(`server is running on PORT ${PORT}`)
});

