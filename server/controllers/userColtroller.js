import { log } from "console"
import AppError from "../errorHandler/error.js"
import User from "../model/userSchema.js"
import cloudinary from "cloudinary"
import fs from "fs/promises"
import sendemail from "../utils/sendEmail.js"
import crypto from "crypto"
import { appendFile } from "fs"

    //Cookie option creation
    const cookieOption={
        maxAge:7*24*60*60*1000, //7days in expiry data
        httpOnly:true,
        secure:true
    }
//Register user
const register=async (req,res,next)=>{
    const {fullName,email,password}=req.body     //Give this all in form data
    if(!fullName || !email || !password){
        return next(new AppError("All the fields are required",402))
    }

    //Finding user already exist using user email
    const userExist=await User.findOne({email})
    if(userExist && userExist.email===email){
        return next(new AppError("USer already exist with same email",405))
    }
    try{
        
    //creating user
    const user =await User.create({
        fullName,
        email,
        password,
        avtar: {
          public_id: email,
          secure_url:"nadeem"
        },
      });

    //if failed to create user
    if(!user){
        return next(new AppError("User registration failed",406))
    }
    //TODO:File upload

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
    if(!user || await user.passwordCompare(password,user.password)==false){
        return next(new AppError("Emailor password is incorrect",404))
    }

    user.password=undefined
    //creating cookie
    const token=await user.jwtToken()

    res.cookie("token",token,cookieOption)

    //sucess message
    return res.status(200).json({
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
    return res.status(200).json({
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
    return res.status(200).json({
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



//Controller for forgot password
const forgotPassword= async (req,res,next)=>{
    const {email}=req.body;  //User will provide the email, then we will cheak weather
                            //the email exist in db or not , if exist then we will 
                            //create an url and send it to that email
    if(!email){
        return next(new AppError("Email not provided",404))
    }
    const user=await User.findOne({email})
    if(!user || user.email!==email){
        return next(new AppError("Email is not registerd"),404)
    }
    
        const resetToken=await user.generatePasswordResetToken() //Generate random token
        await user.save()  //Save the forgotPasswordToken and forgotPasswordExpiry to db
        console.log(resetToken);
        //Constructing url 
        /**HERE
   * req.protocol will send if http or https
   * req.get('host') will get the hostname
   * the rest is the route that we will create to verify if token is correct or not
   */
        const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/user/reset/${resetToken}`
        
        //OR we can provide the frontend user url in .env file
        // const resetPasswordUrl=`${process.env.FRONTEND_URL}/reset/${resetToken}`

 try{
    const subject = 'Reset Password';
    const message = `You can reset your password by clicking <a href=${resetPasswordUrl} 
    target="_blank">Reset your password</a>\nIf the above link does not work for 
    some reason then copy paste this link in new tab ${resetPasswordUrl}.\n 
    If you have not requested this, kindly ignore.`;

    sendemail(email,subject,message) // Send your url to email using nodemailer liberary
                                     //email api
    res.status(200).json({
        sucess:true,
        message:`Reset password token send to ${email}`
    })
 }       
catch(err){
    user.forgotPasswordToken=undefined;
    user.forgotPasswordExpiry=undefined;
    await user.save()
    return next(new AppError(err.message),500)
}
}


//Controller for reset password
//FLOW>>>>
//Part 1>>>>>>>>
//First if user clicked forgot password>> Ask for email >> Verify email(IF user exist in db)
//Second Generate a token using crypto and save the encrypted token and expiry date
//Third Send the generated token in form of url to user email using nodemaler+email api(smpt)

//Part 2>>>>>>>>
//First if user cliked the url then a new tab will open for reset password will contain
//reset token in url
//Second Fetch the reset token from url using params and new password from body
//Third encrypt token and store in forgotpassword
//Forth Find if the user exist in db with same forgotpassword and expiry date is
//not greater then current date
//5Th  if user exist then change the password to new password and save 
const resetPassword=async (req,res,next)=>{
    const resetToken=req.params.resetToken
    //const {resetToken}=req.params
    const {password}=req.body
    if(!password){
        return next(new AppError("Password field if required to be filled",404))
    }
   
    const forgotPasswordToken=crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

    const user=await User.findOne(
        {forgotPasswordToken,
        forgotPasswordExpiry:{$gt:Date.now()}} 
        ////If in db the forgotPasswordExpiry is still stored greated than now time

    )
    if(!user){
        return next(new AppError("Token is invalid or expired",404))
    }
    try{
    user.password=password
    user.forgotPasswordToken=undefined
    user.forgotPasswordExpiry=undefined
    await user.save()
    res.status(200).json({
        sucess:true,
        message:"Password changed sucessful"
    })
}
catch(err){
    user.forgotPasswordToken=undefined
    user.forgotPasswordExpiry=undefined
    await user.save()
    return next (new AppError(err.message,500))
}
}

//Coltroller to modify password 
//User will be already login so we will get id from token
const changePassword=async (req,res)=>{
    const{oldPassword,newPassword}=req.body
    const userId=req.user.id   //Id is set in req.user in jwtAuth middleware
    if(!oldPassword || !newPassword){
        return next(new AppError("All fileds are required to be filled",404))
    }
    if(oldPassword===newPassword){
        return next(new AppError("Old password and New password is same",404))
    }
    const user=await User.findById(userId).select("+password")
    if(!user){
        return next(new AppError("User does not exist",404))
    }
    if(user.passwordCompare(oldPassword)==false){
        return next(new AppError("Password din't not matched",404))
    }

    user.password=newPassword
    await user.save()
    user.password=undefined    //So that if we print user info password should not be printed
    res.status(200).json({
        sucess:true,
        message:"Password modified sucessfully"
    })
}


//Controller for update user NOTE>>> WE cant update email and password fromn this controller
//User will be already login so we will get id from token
const updateUser=async (req,res)=>{
    const{fullName}=req.body
    const userId=req.user.id
    const user=await User.findById(userId)
    if(!user){
        return next(new AppError("User does not exist",404))
    }

    if(fullName){
        user.fullName=fullName
        await user.save()
    }
    if(req.file){
        await cloudinary.v2.uploader.destroy(user.avtar.public_id)  //Deleting the exesting file
        try{ //Creating new life same flow as register
        const result=await cloudinary.v2.uploader.upload(req.file.path,{
            folder:"LMS",
            width:250,
            height:250,
            gravity:"face", 
            crop:"fill"
        })
    if(result){
        user.avtar.public_id=result.public_id
        user.avtar.secure_url=result.secure_url
    }
    fs.rm(`uploads/${req.file.filename}`)

    }
    catch(err){
        return next(new AppError("Error in uploading thr file",500))
    }
}
await user.save()
const data=await User.findById(userId)
 return res.status(200).json({
    sucess:true,
    message:"User update sucessfull",
    data:data
})
}
export {
    register,
    login,
    logOut,
    getUser,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser
}