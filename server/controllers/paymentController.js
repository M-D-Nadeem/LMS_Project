import { log } from "console";
import AppError from "../errorHandler/error.js";
import Payment from "../model/paymentSchema.js";
import User from "../model/userSchema.js"
import { instance } from "../server.js";
import crypto from "crypto"
// const hmac = require('crypto').createHmac;

//Controller to get payment api key from .env
const getPaymentApiKey=async (req,res,next)=>{
    try{  
        return res.status(200).json({
            sucess:true,
            message:"Payment Api Key",
            key:process.env.RAZORPAY_KEY_ID
        })
    }
    catch(err){
        return next(new AppError(err.message || "Failed to get payment api key",500))
    }
}

//Controller for Subscription
const buySubscription=async (req,res,next)=>{
    //As we are addinding middleware jwtAuth before buySubscription so from
    //there we will get user id
    const userId=req.user.id
    try{
        //UserId is required to find the user, to cheak user has login
        const user=await User.findById(userId)
        if(!user){
            return next(new AppError("User does not exist please login",404))
        }
       
        //Cheak point for Admin can not buy cources
        if(req.user.role==="ADMIN"){
            return next(new AppError("Admin can not but curces",404))
        }





//>>>This way we can create a plan but we have already created a plan
//whose is is in process.env.RAZORPAY_PLAN_ID 
//Here for this project we are creating only 1 plan on yearly basis subscribtion for 3 
//years on 1 rs, one can access any course if he buy the subscribtion

//>>>But we can create diffrent plan for diffrent acourse using course id

// const plan=await instance.plans.create({
//   period: "yearly",
//   interval: 1,
//   item: {
//     name: "Test plan2 ",
//     amount: 100,
//     currency: "INR",
//     description: "Description for the test plan"
//   },
// })




 //If user exist then create subscription of user in razorpay
 //get the create subscription documentry from https://razorpay.com/docs/api/payments/subscriptions/subscriptions/create-subscription/
const subscriptionDetails=await instance.subscriptions.create({  //instance of subscription is in server.js
  plan_id:process.env.RAZORPAY_PLAN_ID,
  customer_notify: 1,
  total_count:3,

// start_at: Math.floor(Date.now() / 1000),  //As start_at takes time seconds and 
//Date.now() gives time millisecond so we use Date.now()/1000

//   offer_id:process.env.RAZORPAY_OFFER_ID
})

//Set subscription id and status
user.subscription.id=subscriptionDetails.id
user.subscription.status=subscriptionDetails.status

await user.save()

//Now we need to give subscription id to clint side to buid an url which will redirect
//to sucessfully payed page
return res.status(200).json({
    sucess:true,
    message:"Subscription sucessfull",
    subscriptionId:subscriptionDetails.id
})
    }
    catch(err){
        return next(new AppError(err.message,500))
    }
}


const varifySubscribtion=async (req,res,next)=>{
    const userId=req.user.id

    const {razorpay_payment_id,razorpay_signature,  razorpay_subscription_id }=req.body
    try{ 
        const user=await User.findById(userId)
        if(!user){
            return next(new AppError("User does not exist please login",404))
        }


//<<<NOTE>>>razorpay signature we will get only after sucessfull payment from frontend

//Create a razorpay signature using RAZORPAY_SECRET_KEY , razorpay_payment_id ,razorpay_subscription_id
//using cripto >>>refer https://stackoverflow.com/questions/56573028/razorpay-signature-verification-not-happening-as-sha256-digest-is-wrong-nodejs
const generatedSignature =await crypto
.createHmac("sha256",process.env.RAZORPAY_SECRET_KEY)
.update(razorpay_payment_id + "|" + razorpay_subscription_id)
.digest("hex"); 
       

        if(generatedSignature!=razorpay_signature){
            return next(new AppError("Payment not varified please try again",404))
        }

        //If signatuge varified then save all the req.body info in Payment collection
        //and change the subscription status in user to active
        await Payment.create({
            payment_id: razorpay_payment_id, 
            signature:razorpay_signature,  
            subscription_id: razorpay_subscription_id
        })

        user.subscription.status="active"
        await user.save()

        return res.status(200).json({
            sucess:true,
            message:"Subscription varified"
        })

}
catch(err){
    return next(new AppError(err.message,500))

}
}


//Controller for unsubscribe
//Middleware >> 1.If not login then return 2.If admin login then return 3.If subscription
//Status is not active then return
const cancelSubscription=async (req,res,next)=>{
    const userId=req.user.id
    
    try{
        const user=await User.findById(userId)
        if(!user){
            return next(new AppError("User does not exist please login",404))
        }
       
        //If user is not admin or not subscribe then return
        if(req.user.role==="ADMIN"){
            return next(new AppError("Admin can not but curse",404))
        }
        if(user.subscription.status!=="active"){
           return next(new AppError("Please subscribe to access this route",404))
        }

        const subscriptionId=user.subscription.id
        const subscribtionDetailes=await instance.subscriptions.cancel(subscriptionId)
       console.log(subscribtionDetailes);

       user.subscription.status=subscribtionDetailes.status
       user.subscription.id=subscribtionDetailes.id
       await user.save()
        
       res.status(200).json({
        sucess:true,
        message:"Subscription cancel sucessfull"
       })
    }
    catch(err){
        return next(new AppError(err.message,500))
    }
}

const getAllSubscription=async (req,res,next)=>{
    const userId=req.user.id
    const count=req.query //In postman we will get params there we have to provide the count info
    try{
        const user=await User.findById(userId)
        if(!user){
            return next(new AppError("User does not exist please login",404))
        }
        // if(req.user.role==="USER"){
        //     return next(new AppError("Usew can not get subscription detailes",404))
        // }
        const subscriptionDetails=await instance.subscriptions.all({count:count || 10})
        const monthNumber=[
            "January",
            "February",
           "March",
            "April",
            "May",
            "June",
            'July',
            "August",
            "September",
            "October",
            'November',
            "December"
        ]
        const finalMonths={
        January:0,
        February:0,
        March:0,
        April:0,
        May:0,
        June:0,
        July:0,
        August:0,
        September:0,
        October:0,
        November:0,
        December:0
        }
        let months=[]
        let i=0;
        const dateSeconds=subscriptionDetails.items.forEach((ele)=>{
            const date=new Date(ele.start_at * 1000)
            months[i++]=date.getMonth()
          
        })
        months.forEach((ele,index)=>{
            const month=monthNumber[ele]
            const extValue=finalMonths[month]
            finalMonths[month]=extValue+1
        })
        const monthlySalesRecord=[]
        i=0;
        Object.values(finalMonths).forEach((ele)=>{
            monthlySalesRecord[i++]=ele
        })

        return res.status(200).json({
            sucess:true,
            message:"Succesfully got all subscription",
            result: {subscriptionDetails , finalMonths ,monthlySalesRecord}
        })
    }
        
    catch(err){
        return next(new AppError(err.message,500))
    }
}
export {
    getPaymentApiKey,
    buySubscription,
    varifySubscribtion,
    cancelSubscription,
    getAllSubscription
}