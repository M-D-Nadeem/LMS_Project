import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./Slice/authSlice.js"
import courseSlice from "./Slice/courseSlice.js";
import paymentSlice from "./Slice/paymentSlice.js";
import lectureSlice from "./Slice/lectureSlice.js";
import dashboardSlice from "./Slice/dashboardSlice.js";
const store=configureStore({
    reducer:{
        auth:authSlice,
        courses:courseSlice,
        payment:paymentSlice,
        lecture:lectureSlice,
        dashboard:dashboardSlice
    },
    devTools:true
})
export default   store