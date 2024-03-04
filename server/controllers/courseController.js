import AppError from "../errorHandler/error.js";
import Course from "../model/courseSchema.js";
import cloudinary from "cloudinary"
import fs from "fs/promises"

//Controller to get information about all the courses listed (NOTE no info about
//the lecture in the courses)
const getAllCourses=async (req,res,next)=>{
    try{
    //Get all courses info except the lectures from schema
    const courses=await Course.find({}).select("-lectures")
    if(!courses){
        return next(new AppError("Courses not found!",404))
    }
    return res.status(200).json({
        sucess:true,
        message:"All courses found sucessfully",
        result:courses
    })
    }
    catch(err){
        return next(new AppError(err.message,500))
    }
}

//Controller to get information about the lectures in the perticular courses by fetching its id

const getLecturesByCourseId =async (req,res,next)=>{
    const courseId=req.params.courseId;
    //const {courseId}=req.params
    try{
        //Fetching the perticular course detailes using course id
         const course=await Course.findById(courseId)
         if(!course){
            return next(new AppError("Courses not found!",404))
         }
         return res.status(200).json({
            sucess:true,
            message:"Lectures found sucessfully",
            result:course.lectures
         })
    }
        catch(err){
        return next(new AppError(err.message,500))
    }
}


//Controller for create course 
const createCourse=async (req,res,next)=>{
    const {title,description,category,createdBy}=req.body //We will add all course info
    //in form data as we have a thumbnail as image file to upload
console.log(title+" "+description+" "+category+" "+createdBy);
    if(!title || !description || !category || !createdBy){
        return next(new AppError("All fields are required",404))
    }
try{ 
    const course=await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail:{   //Thumbnail is given as required in course sechema so we have 
            //to set initilly an Dummy thumbnail or if we not give required in course schema 
            //then we dont have to provide thumbnail here inside create
            public_id:"Dummy",   
            secure_url:"Dummy"
        }

    })

    if(!course){
        return next(new AppError("Can not create the course",404))
    }

    if(req.file){
        const result=await cloudinary.v2.uploader.upload(req.file.path,{
            folder:"LMS",
            width:250,
            height:250,
            gravity:"face",
            crop:"fill"
        })
        if(result){
            course.thumbnail.public_id=result.public_id,
            course.thumbnail.secure_url=result.secure_url
        }
        fs.rm(`uploads/${req.file.filename}`)
    }
    await course.save()
    return res.status(200).json({
        sucess:true,
        message:"Course created sucessfully",
        result:course
    })
}
catch(err){
    return next(new AppError(err.message,500))
}
}
export {
    getAllCourses,
    getLecturesByCourseId,
    createCourse
}