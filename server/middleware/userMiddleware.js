
const errorMiddleware=(err,req,res,next)=>{
    err.message=err.message || "Somethng went wrong"
    err.statusCode=err.statucCode || 404
    res.status(err.statusCode).json({
        sucess:false,
        message:err.message,
        stack:err.stack
    })
}

import jwt from "jsonwebtoken"
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
        req.user={id:payload.id,email:payload.email}
    }
    catch(err){
        res.status(500).json({
            sucess:false,
            message:err.message
        })
    }
    next()
}
export { errorMiddleware  ,jwtAuth}