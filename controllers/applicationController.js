
import { Application } from "../models/applicationmodel.js";
import { Job } from "../models/jobmodel.js";



export const applyJob = async(req,res)=>{
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({
                message:"Job Id is missing",
                success:false
            })
        }
        const checkApplication = await Application.findOne({job:jobId,applicant:userId});
        if(checkApplication){
            return res.status(400).json({
                message:"user has already applied for this job! ",
                success:false
            })
        }

        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({
                message:"Job not found",
                success:false
            })
        }

        const application = await Application.create({
            job:jobId,
            applicant:userId
        });

        job.applications.push(application._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getApplied = async(req,res)=>{
    try {
        const userId = req.id;
        const applications = await Application.find({applicant:userId})
                                .populate({
                                    path: "job",
                                    populate: {
                                    path: "company"
                                    }
                                })
                                .sort({ createdAt: -1 });
        if(applications.length===0){
            return res.status(404).json({
                message:"No jobs applied",
                success:false
            })
        }
        return res.status(200).json({
            applications,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getApplicants = async(req,res)=>{
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
                        .populate({
                            path: "applications",
                            options: { sort: { createdAt: -1 } },
                            populate: { path: "applicant" }
                            })

        if(!job){
            return res.status(404).json({
                message:"No applicants found",
                success:false
            })
        }

        return res.status(200).json({
            job, 
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}

export const updateStatus = async(req,res)=>{
    try {
        const {status} = req.body;
        const id = req.params.id;

        if(!status){
            return res.status(400).json({
                message:"status is required", 
                success:false
            });
        }
        const application = await Application.findById(id);
        if(!application){
            return res.status(404).json({
                message:"Application not found", 
                success:false
            });
        }

        application.status = status.toLowerCase();

        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });
    } catch (error) {
        console.log(error);
    }
}