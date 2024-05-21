import { timeStamp } from "console";
import mongoose from "mongoose";

const courseSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title is reqired to be given"],
        minLength:[5,"Title must be of atleat 8 charecters"],
        maxLength:[20,"Title can not be more than 20 charecters"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Description is reqired to be given"],
        minLength:[8,"Description must be of atleat 8 charecters"],
        maxLength:[200,"Description can not be more than 200 charecters"],
    },
    category:{
        type:String,
        required:[true,"Category is reqired to be given"],
    },
    createdBy:{
        type:String,
        required:[true,"Created by not given"]
    },
    //this thumbnail contains public id and secured url about the diffrent courses
    thumbnail:{
        public_id:{
            type:String,
            
        },
        secure_url:{
            type:String,
            
        }
    },

    //This lectures contains information about the lectures in the perticula courses
    lectures: [
        {
          title: String,
          description: String,
          lecture: {
            public_id: {
              type: String,
           
            },
            secure_url: {
              type: String,
             
            },
          },
        },
      ],
    numberOfLectures:{
        type:Number,
        default:0
    },
   
},{timestamps:true})

export default mongoose.model("Course",courseSchema)
//Here <<<Course>>> is the name of the collection of courseSchema