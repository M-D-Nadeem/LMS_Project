import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";
import toast from "react-hot-toast";

const dashboardSlice=createSlice({
    name:"dashboard",
    initialState:{
        noOfUser:0,
        noOfActiveUser:0
    },
    reducers:{

    },
    extraReducers:(builder)=>{
            builder.addCase(getUserData.fulfilled,(state,action)=>{
                state.noOfUser=action?.payload?.allUser
                state.noOfActiveUser=action?.payload?.activeUser
            })
    }
})
export const getUserData=createAsyncThunk("/user/get",async ()=>{
    try{
        const response=axiosInstance.get("/Miscellaneous/userStatus")
        toast.promise(response,{ 
            loading:"Getting the user Data...",
            success:"Fetched user data sucessfully",
            error:"Failed to load user data"
        })
        return (await response).data
    }
    catch(err){
        toast.error(err?.response?.data?.message)
    }
})

export const { } = dashboardSlice.actions;
export default dashboardSlice.reducer;