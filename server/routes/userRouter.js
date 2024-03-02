import express from "express"
const router=express.Router()
import { jwtAuth } from "../middleware/userMiddleware.js"
import { register, login, logOut ,getUser} from "../controllers/userColtroller.js"
import upload from "../middleware/multerMiddleware.js"

router.post("/register/",upload.single("avtar"),register)
router.post("/login",login)
router.get("/logOut",jwtAuth,logOut)
router.get("/getUser",jwtAuth,getUser)
export default router