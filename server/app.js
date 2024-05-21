import cookieParser from "cookie-parser"
import express, { urlencoded } from "express"
import cors from "cors"
import morgan from "morgan"
import errorMiddleware from "./middleware/errorMiddleware.js"
import userRouter from "./routes/userRouter.js"
import courseRouter from "./routes/courseRouter.js"
import paymentRouter from "./routes/paymentRouter.js"
import miscellaneousRouter from "./routes/miscellaneousRouter.js"
const app=express()

app.use(express.json()) //Sucessfully allow to send a json data during res.status.json
app.use(cookieParser()) //Sucessfully allow to reed the cookie 
app.use(morgan("dev")) //To show in consol whenever someone access any of the url
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:[process.env.CLIENT_URL],
    credentials:true
}))
 
//Cheak using ping url if my server is working properly
app.use("/ping",(req,res)=>{
    res.send("PONG")
}) 

//Routes for User
app.use("/app/",userRouter)

//Routes for Course
app.use("/app/course",courseRouter)

//Router for Payment
app.use("/app/payment",paymentRouter)

app.use("/app/Miscellaneous",miscellaneousRouter)

//Display an error if any other url is been accessed
app.all("*",(req,res)=>{ 
    res.status(404).send("OPPS!! 404 page not found")
}) 

app.use(errorMiddleware)

export default app;