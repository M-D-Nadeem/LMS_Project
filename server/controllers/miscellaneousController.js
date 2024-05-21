import User from "../model/userSchema.js"
import AppError from "../errorHandler/error.js"
import sendemail from "../utils/sendEmail.js"
const contactUs=async (req,res,next)=>{
     const {name,email,message}=req.body
     if(!name || !email || !message){
        return next(new AppError("All fildes are required",404))
     }
     try{
         const subject="Contact Us"
         const textMessage= `${name} -- ${email} <br/> ${message}`
         sendemail(email,subject,textMessage)
         res.status(200).json({
            sucess:true,
            message:"Successfully send the message"
         })

     }
     catch(err){
        return next(new AppError(err.message,500))
     }  
}

const userStatus=async (req,res,next)=>{
    if(req.user.status==="USER"){
        return next (new AppError("You can't access this route",404))
    }
    try{
         const noOfUser=await User.countDocuments()

         const noOfActiveUser=await User.countDocuments({
            "subscription.status":"active"
         })
        return res.status(200).json({
            success: true,
            message: 'All registered users count',
            allUser:noOfUser,
            activeUser:noOfActiveUser,
          });
        
    }
    catch(err){
        return next(new AppError(err.message,500))
    }
}

export {
    contactUs,
    userStatus
}