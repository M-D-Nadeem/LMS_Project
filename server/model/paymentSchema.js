import { timeStamp } from "console"
import mongoose from "mongoose"

const paymentSchema=new mongoose.Schema({
    payment_id:{
        type:String,
        required:[true,"Payment id is required to be given"]
    },
    subscription_id:{
        type:String,
        required:[true,"Subscription id is required to be given"]
    },
    signature:{
        type:String,
        required:[true,"Signature id is required to be given"]
    }
},{timeStamp:true})

export default mongoose.model("Payment",paymentSchema)