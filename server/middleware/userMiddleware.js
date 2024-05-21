import AppError from "../errorHandler/error.js"
import { log } from "console"
import jwt from "jsonwebtoken"

import User from "../model/userSchema.js"
const jwtAuth=(req,res,next)=>{
    const token=(req.cookies.token) || null
    if(!token){
        return res.status(404).json({
            sucess:false,
            message:"Token does not exist"
        })
    }
    try{
        const payload=jwt.verify(token,process.env.JWT_SECRET_CODE)
        req.user=payload
    } 
    catch(err){
        res.status(500).json({
            sucess:false,
            message:err.message
        })
    }
    next()
}

const authorizedRoles=(role)=>
async (req,res,next)=>{
         const currentRole=req.user.role
         if(role!=currentRole){
           return next(new AppError("You don't have the permission to access",404))
            
         }
         next()
}

const authorizeSubscribers=async (req,res,next)=>{
    // If user is USER or does not have an active subscription then error else pass
    //for getUser
    const user=await User.findById(req.user.id)
    if( user.subscription.status !== "active"){
        return next(new AppError("Please subscribe to access this route.", 403));
    }
    next()
}
export {jwtAuth,authorizedRoles,authorizeSubscribers}