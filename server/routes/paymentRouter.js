import express from "express"
import { authorizeSubscribers, authorizedRoles, jwtAuth } from "../middleware/userMiddleware.js"
import { buySubscription, cancelSubscription, getAllSubscription, getPaymentApiKey, varifySubscribtion } from "../controllers/paymentController.js"
const paymentRouter=express.Router()

paymentRouter.route("/paymentKey")
.get(jwtAuth,getPaymentApiKey)

paymentRouter.route("/subscribe")
.post(jwtAuth,buySubscription)

paymentRouter.route("/verify")
.post(jwtAuth,varifySubscribtion)

paymentRouter.route("/unsubscribe")
.post(jwtAuth,authorizeSubscribers,cancelSubscription)

paymentRouter.route("/getAllSubscription")
.get(jwtAuth,getAllSubscription)

export default paymentRouter
