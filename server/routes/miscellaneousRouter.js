
import express from "express";
import { contactUs, userStatus } from "../controllers/miscellaneousController.js";
import { authorizedRoles, jwtAuth } from "../middleware/userMiddleware.js";
const miscellaneousRouter=express.Router()

miscellaneousRouter.post("/contactUs",contactUs)

//NOTE we have to provide jwtAuth first if we want to use authorizedRoles because 
//in jwtAuth we set res.user=payload then only req.user.role will be available in authorizedRoles
miscellaneousRouter.get("/userStatus",jwtAuth,authorizedRoles("ADMIN"),userStatus)

export default miscellaneousRouter