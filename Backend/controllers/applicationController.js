import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import cloudinary from "cloudinary";
import {Job} from "../models/jobSchema.js";

// employer can see all applictions on its job
export const employerGetAllApplications = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("Job seeker is not allowed to access this resoures",400));
    }

    const {_id} = req.user;
    const applications = await Application.find({'employerID.user':_id});
    res.status(200).json({
        success:true,
        applications
    });
});

//job seeker can see all their applications
export const jobSeekerGetAllApplications = catchAsyncError(async(req,res,next)=>{
    const {role, _id} = req.user;
    if(role === "Employer"){
        return next(new ErrorHandler("Employer is not allowed to access this resoures",400));
    }

    // const {_id} = req.user;
    const applications = await Application.find({'applicationID.user':_id});
    res.status(200).json({
        success:true,
        applications
    });
});

//job_seeker deleteing application
export const jobSeekerDeleteApplication = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role === "Employer"){
        return next(new ErrorHandler("Employer is not allowed to access this resoures",400));
    }

    const { id} = req.params;
    const application = await Application.findById(id);
    if(!application)
        {
            return next(new ErrorHandler("OOps, application not found!",404));
        }
    await application.deleteOne();
    res.status(200).json({
        success:true,
        message: "Application deleted successfully",
    });
});

//make application --cloudinary
export const postApplication = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role === "Employer"){
        return next(new ErrorHandler("Employer is not allowed to access this resoures",400));
    }
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Resume File Required"));
    }
    const {resume} = req.files;
    
    const allowedFormats= ["image/png", "image/jpg ", "image/webp" ];
    if(!allowedFormats.includes(resume.mimetype)){
        return next(new ErrorHandler("Invalid file type , please upload your resume in a PNG , JPG, or WEBP format"));
    }
    
    const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath 
    );

    // console.log(cloudinaryResponse);

    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary Error:", cloudinaryResponse.error ||"Unknown cloudinary error");
        return next(new ErrorHandler("Failed to upload resume",500));
    }
    const {name ,email , coverLetter , phone , address , jobId} = req.body;
    const applicantID ={
        user: req.user._id,
        role: "Job Seeker"
    };
    if(!jobId){
        return next(new ErrorHandler("Job not found",404));
    }
    const jobDetails = await Job.findById(jobId);
    if(!jobDetails){
        return next(new ErrorHandler("Job not found",404));
    }

    const employerID ={
        user: jobDetails.postedBy,
        role: "Employer",
    };
    if(!name || !email || !coverLetter || !phone || !address || !applicantID || !resume || !employerID)
        {
            return next (new ErrorHandler("Please fill all details",400));
        }
    
    const application = await Application.create({
        name, email, coverLetter , phone, address ,
         applicantID , employerID,
          resume :{
            public_id:cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
          }
    });
    return res.status(200).json({
        success:true,
        message:"Application submitted",
        application,
    });

});