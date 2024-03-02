import mongoose from "mongoose"

// mongoose.set("strictQuery",false) 
const dbConnect=()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then((con)=>{
        console.log("Sucessfully connected to database: ",con.connection.host);
    })
    .catch((err)=>{
        console.log("Failed to connect to database",err);
        process.exit(1) //if database is not connected then no need to go 
                        //further end the server connection here
    })
}

export default dbConnect 