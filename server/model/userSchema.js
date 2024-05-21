import { timeStamp } from "console";
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        maxLength:[50,"User name can be maximum of 50 charecters"],
        minLength:[3,"User name must be at least of 3 chrecters"],
        required:[true,"User name is required"],
        trim:true,
        lowercase:true
    },
    email:{
        type:String,
        required:[true,"User email is required"],
        unique:[true,"User email must be unique"],
        trim:true,
        lowercase:true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please fill in a valid email address',
          ], //before 
        //quary from database cheak weather the email format is correct 3level validation
    },
    password:{
        type:String,
        required:[true,"User password is required"],
        select:false //If we quary data from database bydefault don't show password
    },
    
    avtar:{
        public_id:{type:String},
        secure_url:{type:String}
    },
//As same schema can be used by user as well as admin so to identify weather
//we are login as user or admin we user rode field
    role:{
         type:String,
         enum:["USER","ADMIN"], //there is 2 roles USER or ADMIN
         default:"USER"   //if not speccified login as USER
    },
    
    forgotPasswordToken:{type:String},
    forgotPasswordExpiry:{type:Date},
    
    //Will store the current status of user in case of subscription
    subscription:{
        id:{type:String},
        status:{type:String}
    }
},{timestamps:true})

//Encripying password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    else{
        this.password=await bcrypt.hash(this.password,10)
        return next()
    }
})





//Creating token
userSchema.methods={
    jwtToken(){
        return jwt.sign(
                {id:this._id,email:this.email,subscription:this.subscription,role:this.role},
                process.env.JWT_SECRET_CODE,
                {expiresIn:'24h'} 
            )
    },
    
//Password compare method
    async passwordCompare(planePassword,userPassword){
        const result=await bcrypt.compare(planePassword,userPassword)
        if(result==true){
            return true
        }
        return false
    },

    //Generating a random token using crypto
    async generatePasswordResetToken(){
        //Creating hax token reffer https://stackoverflow.com/questions/8855687/secure-random-token-in-node-js
         const resetToken=await crypto.randomBytes(20).toString("hex") 

         //Encrypting token before storing it to db
         //reffer https://nodejs.org/api/crypto.html
         this.forgotPasswordToken=crypto
         .createHash("sha256")
         .update(resetToken)
         .digest("hex")

         //The token expier in 15 mins After that user can reset password user have 
         //to again provide the email and new token will be generated
         this.forgotPasswordExpiry=Date.now()+15*60*1000

         return resetToken
    }
}
export default mongoose.model("User",userSchema)
//Here <<<User>>> is the name of the collection of userSchema