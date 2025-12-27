import { Job } from "../models/jobmodel.js";
import { Application } from "../models/applicationmodel.js";

export const createJob = async(req,res)=>{
    try {
        const {title,description,requirements,salary,experience,location,position,jobType,companyId} = req.body;
        const userId = req.id;

        if(!title || !description || !salary || !experience || !position || !location || !jobType || !companyId){
            return res.status(400).json({
                message:"All fields are required",
                success:false
          });
        }

        const job = await Job.create({title,description, requirements: requirements.split(","),salary,experience,location,jobType,position,company:companyId,createdby:userId});

        return res.status(200).json({
            message:"Job created successfully",
            job,
            success:true
        });
    } catch (error) {
        console.log(error);
    }
}

export const getjobs = async(req,res)=>{
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or:[
                {title:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}}
            ]
        };
        const jobs = await Job.find(query)
                        .populate("company")
                        .sort({createdAt:-1});
        if (jobs.length === 0){
            return res.status(404).json({
                message:"No jobs found",
                success:false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getjobbyId = async(req,res)=>{
    try {
        const id=req.params.id;
        const job = await Job.findById(id).populate("applications");
        if(!job){
            return res.status(404).json({
                message:"No jobs found",
                success:false
            });
        }
        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ createdby: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}