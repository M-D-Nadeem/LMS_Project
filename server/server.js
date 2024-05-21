
import app from "./app.js"
import dotenv from "dotenv"
dotenv.config()
import dbConnect from "./config/dbConnection.js"
dbConnect()
import cloudinary from "cloudinary"
import Razorpay from "razorpay"
//Creating coonfiguration for cloudinary 
cloudinary.v2.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

export const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, 
    key_secret: process.env.RAZORPAY_SECRET_KEY })


const PORT=process.env.PORT || 4010
app.listen(PORT,()=>{ 
    console.log(`Server is running at http://localhost:${PORT}`);
})