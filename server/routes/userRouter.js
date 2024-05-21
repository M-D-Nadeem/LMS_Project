import express from "express"
const router=express.Router()
import { jwtAuth } from "../middleware/userMiddleware.js"
import { register, login, logOut ,getUser,forgotPassword,resetPassword, changePassword,updateUser} from "../controllers/userColtroller.js"
import upload from "../middleware/multerMiddleware.js"

router.post("/register",upload.single("avtar"),register)
router.post("/login",login) 
router.get("/logout",jwtAuth,logOut)
//Only the success payment user can get detailes its detailes done by >>authorizeSubscribers
router.get("/getUser",jwtAuth,getUser)  
router.post("/reset",forgotPassword)
router.post("/reset/:resetToken",resetPassword)
router.post("/changePassword",jwtAuth,changePassword)
router.put("/updateUser",jwtAuth,upload.single("avtar"),updateUser)

export default router