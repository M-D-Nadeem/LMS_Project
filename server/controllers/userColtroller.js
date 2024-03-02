import { log } from "console"
import AppError from "../errorHandler/error.js"
import User from "../model/userSchema.js"
import cloudinary from "cloudinary"
import fs from "fs/promises"

    //Cookie option creation
    const cookieOption={
        maxAge:7*24*60*60*1000, //7days expiry data
        httpOnly:true,
        secure:true
    }
//Register user
const register=async (req,res,next)=>{
    const {name,email,password}=req.body
    if(!name || !email || !password){
        return next(new AppError("All the fields are required",404))
    }

    //Finding user already exist using user email
    const userExist=await User.findOne({email})
    if(userExist && userExist.email===email){
        return next(new AppError("USer already exist with same email",404))
    }
    try{
        
    //creating user
    const user =await User.create({
        name,
        email,
        password,
        avtar: {
          public_id: email,
          secure_url:"nadeem"
        },
      });

    //if failed to create user
    if(!user){
        return next(new AppError("User registration failed",404))
    }
    //TODO:File upload
    console.log(JSON.stringify(req.file));

    //We can  access our image file  in req.file after adding middleware in router regester
    //that is upload.single("avtar")
    //WORK FLOW > using upload.single("avtar") as middleware we get the file path
    //and the file varified using multer-> if it if jpg/png/... ->if file size is 50*1024*1024
    //and etc then the file is uploaded in uploads folder and we get the file path as req.file 
    if(req.file){
        try{
            const result=await cloudinary.v2.uploader.upload((req.file.path),{
                folder:'LMS',     //
                width:250,        //
                height:250,       // We can apply transformation to the photo using
                gravity:"face",   //properties of cloudinary 
                crop:"fill"       //refer https://cloudinary.com/documentation/node_image_manipulation
            })

            //if file is successfully uploaded in cloudinary it will return some value
            //so we can set that in out actual avtat.public_id
            if(result){
                user.avtar.public_id=result.public_id;
                user.avtar.secure_url=result.secure_url
            }
                        
            //After uploading the file to cloudinary we have to remove it from server
            //that is from uploads folder
            fs.rm(`uploads/${req.file.filename}`)
            
        }
        catch(err){
            return next(new AppError("Error in uploading thr file",500))
        }
    }

    await user.save()
    user.password=undefined //password undefined before storing in cookie
   // Cookie creation
   const token=await user.jwtToken()
    res.cookie("token",token,cookieOption)


    //sucess message
    return res.status(200).json({
        sucess:true,
        message:"Registration Sucessful",
        data:user
    })
} 

catch(err){
    console.log("ERROR in registration",err);
    return next(new AppError(err.message,500))
}
}

//login User
const login=async (req,res,next)=>{
    const {email,password}=req.body
    if(!email || !password){
        return next(new AppError("All fields are required",404))
    }
    try{
    const user=await User.findOne({email}).select("+password")
    //password compairing at userSchema level
    if(!user || user.passwordCompare(password)==false){
        return next(new AppError("Emailor password is incorrect",404))
    }

    user.password=undefined
    //creating cookie
    const token=await user.jwtToken()

    res.cookie("token",token,cookieOption)

    //sucess message
    res.status(200).json({
        sucess:true,
        message:"Login sucessfully",
        data:user
    })
}
catch(err){
    console.log("ERROR in login",err);
    return next(new AppError(err.message,500))
}
}

const logOut=async (req,res,next)=>{
    try{
    res.cookie("token","null",{
        secure:true,
        maxAge:0,
        httpOnly:true
    })
    res.status(200).json({
        sucess:true,
        message:"Log out sucessful"
    })
}
catch(err){
    console.log("ERROR in log out");
    return next(new AppError(err.message,500))
}
}

const getUser=async (req,res,next)=>{
    try{
    const userId=req.user.id
    const user=await User.findById(userId)
    if(!user){
        return next(new AppError("Failed to fetch user information",404))
    }
    res.status(200).json({
        sucess:true,
        message:"User found sucessfully",
        data:user
    })
    }
    catch(err){
        console.log("ERROR is finding the user",err);
        return next(new AppError(err.message,500))
    }
}
export {
    register,
    login,
    logOut,
    getUser
}