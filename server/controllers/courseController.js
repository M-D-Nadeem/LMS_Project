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

    if(!title || !description || !category || !category){
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

//Controller to update perticular course info

//M1>>>> By this method we have to provide title,description,category,createdBy 
//       all the required information or non of the required information only the thumnail
//       then only it will update , if we want to update only title then this method is not for you
// const updateCourse=async (req,res,next)=>{
//     const {title,description,category,createdBy}=req.body
//     const courseId=req.params.courseId;
//     if(!courseId){
//         return next(new AppError("Can not fetch courseId",404))
//     }
//     try{
//          const course=await Course.findById(courseId)
         
//          if(!course){
//             return next(new AppError("No such coures exist",404))
//          }
//          if(title || description || category || createdBy){
//             course.title=title
//             course.description=description
//             course.category=category
//             course.createdBy=createdBy
//             await course.save()
//          }
//          if(req.file){
//               cloudinary.v2.uploader.destroy(course.thumbnail.public_id)
//                 const result=await cloudinary.v2.uploader.upload(req.file.path,{
//                     folder:"LMS",
//                     width:250,
//                     height:250,
//                     gravity:"face",
//                     crop:"fill"
//                 })
//                 if(result){
//                     course.thumbnail.public_id=result.public_id,
//                     course.thumbnail.secure_url=result.secure_url
//                 }
//                 fs.rm(`uploads/${req.file.filename}`)
//             }
//             await course.save()
//             res.status(200).json({
//                 sucess:true,
//                 message:"Course Update sucessful",
//                 result:course
//             })
//          }
//     catch(err){
//         return next(new AppError(err.message,500))
//     }
// }

//M2>>>>(BETTER ONE) If we want to update only tite or all the required model then use M2
const updateCourse=async (req,res,next)=>{
    const courseId=req.params.courseId;
    if(!courseId){
                 return next(new AppError("Can not fetch courseId",404))
             }
    try{
        //    const course=await Course.findByIdAndUpdate(courseId,req.body)
           //           OR
           const course=await Course.findByIdAndUpdate(courseId,
            {
                $set:req.body
            },
            {
                runValidators:true    //Validates your req.body info from your Schema
            })
           if(!course){
            return next(new AppError("No such coures exist",404))
           }
           if(req.file){
            cloudinary.v2.uploader.destroy(course.thumbnail.public_id)
            const result=await cloudinary.v2.uploader.upload(req.file.path,{
                folder:"LMS",
                     width:250,
                     height:250,
                     gravity:"face",
                     crop:"fill"
            })
            if(result){
                course.thumbnail.public_id=result.public_id
                course.thumbnail.secure_url=result.secure_url
            }
            fs.rm(`uploads/${req.file.filename}`)
           }
           await course.save()
           return res.status(200).json({
            sucess:true,
            message:"Course update sucessfull",
            result:course
           })
    }
    catch(err){
        return next(new AppError(err.message,500))
    }
}

//Controller to delete Course
const deleteCourse=async (req,res,next)=>{
    const courseId=req.params.courseId
    if(!courseId){
        return next(new AppError("Can not fetch courseId",404))
    }
    try{
         const course=await Course.findById(courseId)
         if(!course){
            return next(new AppError("No such coures exist",404))
         }
         await Course.findByIdAndDelete(courseId)
         return res.status(200).json({
            sucess:true,
            message:"Couse deleted sucessfully"
         })
    }
    catch(err){
        return next(new AppError(err.message,500))
    }
}

//Add lectures to the course using courseId
const addLectureToCourseById=async (req,res,next)=>{
    const{title,description}=req.body
    const courseId=req.params.courseId
    if(!title || !description){
        return next(new AppError("All fields are required",404))
    }
    try{
        const course=await Course.findById(courseId)
        if(!course){
            return next(new AppError("Can not create the course",404))
        }
        const lecture={}
        if(req.file){
            console.log("req file",req.file);
            try{
            const result=await cloudinary.v2.uploader.upload(req.file.path,{
                folder:"LMS",
                resource_type: 'video',
                allowed_formats: ['mp4', 'webm']
            })
            console.log(result);
            if(result){
            
            lecture.public_id=result.public_id,
            lecture.secure_url=result.secure_url

            }
            fs.rm(`uploads/${req.file.filename}`)
        }
        catch(err){
            console.error("Error uploading to Cloudinary:", err);
        }
    }

        course.lectures.push({title,description,lecture})
        course.numberOfLectures=course.lectures.length
        await course.save()
       return res.status(200).json({
        sucess:true,
        message:"Lecture uploaded sucessfully",
        data:course
       })
    }
    catch(err){
        return next(new AppError(err.message,500))
    }
}

//Delete lecture from course using course id
const deleteLectureToCourseById=async(req,res,next)=>{
    const courseId=req.params.courseId;
    const lectureId=req.params.lectureId
    try{
        const course=await Course.findById(courseId)
        
        //Find the index of the lecture you want to delete from the lectures
        const lectureIndex=await course.lectures.findIndex((element)=>lectureId.toString()===element._id.toString())

        //if findIndex can't find any then it returns -1
        if(lectureIndex==-1){
            return next(new AppError('Lecture does not exist.', 404));
        }
        //Removing lecture image from cloudinary
        await cloudinary.v2.uploader.destroy(course.lectures[lectureIndex].lecture.public_id)
        //Removing title,description and public_id,secure_url from data base 
        course.lectures.splice(lectureIndex,1) //Remove 1 element start from lectureIndex
        course.numberOfLectures=course.lectures.length
        await course.save()
        return res.status(200).json({
            sucess:"true",
            message:"Course lecture removed successfully",
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
    createCourse,
    updateCourse,
    deleteCourse,
    addLectureToCourseById,
    deleteLectureToCourseById
}