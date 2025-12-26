import { User } from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async(req,res)=>{
    try {
        const {Name,email,phoneNumber,password,role}=req.body;
        if(!Name || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                message:"All fields are required",
                success:false
            });
        }
        const user = await User.findOne({email:email});
        if(user){
            return res.status(400).json({
                message:"User already exists , Please Login",
                success:false
            });
        }
        const hashPassword = await bcrypt.hash(password,10);

        await User.create({
            Name,email,phoneNumber,password:hashPassword,role
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });

    } catch (error) {
        console.log(error);
    }
}

export const Login = async(req,res)=>{
    try {
        const {email,password,role} = req.body;
        if(!email || !password || !role){
            return res.status(400).json({
                message:"All fields are required",
                success:false
            });
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"No user exists with given Email , please register",
                success:false
            });
        }
        const pass = await bcrypt.compare(password,user.password);
        if(!pass){
            return res.status(400).json({
                message:"Incorrect email or password",
                success:false
            });
        }
        if(role!==user.role){
            return res.status(400).json({
                message:"Account doesn't exist with current role.",
                success:false
            });
        }

        const tokenData = {userId:user._id};
        const token = jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:"1d"});

        user ={
            _id:user._id,
            Name:user.Name,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }

        return res.status(200).cookie("token",token,{ httpOnly: true }).json({
            message:"Logged in succesfully",
            user,
            success:true
        });
    } catch (error) {
        console.log(error);
    }
}

export const Logout = async(req,res)=>{
    try {
        return res.status(200).cookie("token","",{ expires: new Date(0) }).json({
            message:"Logged out succesfully",
            success:true
        });
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async(req,res)=>{
    try {
        const {Name,email,phoneNumber,bio,skills}=req.body;
        
        let skillsArray;
        if(skills){
            skillsArray=skills.split(",");
        }

        const userId = req.id;
        let user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                message:"User not found",
                success:false
            });
        }

        if (!user.profile) {
            user.profile = {};
        }

        if(Name) user.Name=Name;
        if(email) user.email = email
        if(phoneNumber)  user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray

        await user.save();

        user = {
            _id: user._id,
            Name: user.Name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        })


    } catch (error) {
        console.log(error);
    }
}