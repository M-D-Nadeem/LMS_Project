import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";
import {toast} from "react-hot-toast"



export const createAccount = createAsyncThunk("/signup", async (data) => {
    try {
        //Note this response will contain res.status(200).json({...}) only if
        //we return res.status(200).json({...})from backend
        const response = axiosInstance.post("/register", data);
        toast.promise(response, {
            loading: "Wait! creating your account",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to create account"
        });
        //Always use .data to fetch what we return from backend irrespective of what variable we return from backend
        return (await response).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
})

export const loginAccount=createAsyncThunk("/login",async (data)=>{
    try{
        const response= axiosInstance.post("/login",data)
        toast.promise(response,{
            loading:"Wait! authentication in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error:"Failed to Log in"
        })
        return (await response).data
    }
    catch(err){
        toast.error(err?.response?.data?.message)
    }
})
export const logoutAccount=createAsyncThunk("/logout",async ()=>{
    try{
        const response=axiosInstance.get("/logout")
        toast.promise(response,{
            loading: "Wait! logout in progress...",
            success: "Log out sucessful",
            error: "Failed to to og out"
        })
        return (await response).data
    }
    catch(err){
        toast.error(err?.response?.data?.message)
    }
})


export const updateUser=createAsyncThunk("/updateUser",async (data)=>{
    try{
        const response=axiosInstance.put(`/updateUser`,data)
        toast.promise(response,{
            loading:"Wait! profile update in progress...",
            success:"Profile updated sucessfully",
            error:"Failed to update profile"
        })
        return (await response)?.data
    }
    catch(err){
        toast.error(err?.response?.data?.message)
    }
})
export const getUserData=createAsyncThunk("/getUserData",async ()=>{
    try{
        const response=axiosInstance.get("/getUser")
        return (await response).data
    }
    catch(err){
        toast.error(err?.response?.data?.message)
    }
})
const authSlice=createSlice({
    name:"auth",

    initialState:{
        //isLoggedIn fetch that the user is logIn or not ,if no such (isLoggedIn) is present
        //in localStorage then return false
        isLoggedIn:  localStorage.getItem("isLoggedIn") || false,
        role: localStorage.getItem("role") || "",
        //We need to parse the object data(conter the string to json) before gating 
        //it and we have to cheack the condition on undefined as well as "undefined"
        //because we stringify the data besfore seting then in loacalstorage
        data: (
        localStorage.getItem('data') == undefined || 
        localStorage.getItem('data') == "undefined") 
        ?  {} : JSON.parse(localStorage.getItem('data')) 
    },
    
    reducers:{

    },
    extraReducers:(builder)=>{
        builder.addCase(createAccount.fulfilled,(state,action)=>{
            //Imp to do JSON.stringify else data will not be in usable state
            localStorage.setItem("data",JSON.stringify(action?.payload?.data)),
            localStorage.setItem("isLoggedIn",(action?.payload!=undefined)?true:false),
            localStorage.setItem("role",action?.payload?.data?.role),

            state.isLoggedIn=(action?.payload!=undefined)?true:false,
            state.data=action?.payload?.data,
            state.role=action?.payload?.data?.role
        })
        builder.addCase(loginAccount.fulfilled,(state,action)=>{
            localStorage.setItem("data",JSON.stringify(action?.payload?.data)),
            localStorage.setItem("isLoggedIn",(action?.payload!=undefined)?true:false),
            localStorage.setItem("role",action?.payload?.data?.role),

            state.isLoggedIn=(action.payload!=undefined)?true:false,
            state.data=action?.payload?.data,
            state.role=action?.payload?.data?.role
        })
        builder.addCase(logoutAccount.fulfilled,(state,action)=>{
            
                localStorage.clear(),

                state.isLoggedIn=false,
                state.data={},
                state.role=""
            
        })
        builder.addCase(updateUser.fulfilled,(state,action)=>{
            console.log(action?.payload?.data);
            localStorage.setItem("data",JSON.stringify(action?.payload?.data))
            // localStorage.setItem("isLoggedIn",(action?.payload!=undefined)?true:false)
            // localStorage.setItem("role",action?.payload?.data?.role)

            // state.isLoggedIn=(action.payload!=undefined)?true:false
            state.data=action?.payload?.data
            // state.role=action?.payload?.data?.role
        })
        builder.addCase(getUserData.fulfilled,(state,action)=>{
            localStorage.setItem("data",JSON.stringify(action?.payload?.data)),
            localStorage.setItem("isLoggedIn",(action?.payload!=undefined)?true:false),
            localStorage.setItem("role",action?.payload?.data?.role),

            state.isLoggedIn=(action.payload!=undefined)?true:false,
            state.data=action?.payload?.data,
            state.role=action?.payload?.data?.role
        })
    }
})



export const { } = authSlice.actions;
export default authSlice.reducer;


