import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";
import toast from "react-hot-toast";

const courseSlice=createSlice({
    name:"courses",
    initialState:{
        courseData:[]
    },
    reducers:{},
    extraReducers:(builder)=>{
       builder.addCase(getAllCourses.fulfilled,(state,action)=>{
        
        state.courseData=[...action?.payload?.result]
       
       })
       
    }
})

export const getAllCourses=createAsyncThunk("/course/get",async ()=>{
    try{
        const response=axiosInstance.get("/course/")
        toast.promise(response,{
            loading:"loading course data...",
            success:"Courses loaded successfully",
            error:"Failed to get courses"
        })
        return (await response).data

    }
    catch(err){
        toast.error(err?.response?.data?.message)
    }
})

export const createCourse=createAsyncThunk("/course/create",async (data)=>{
    try{
        
        const response=axiosInstance.post("/course/create",data)
        toast.promise(response,{
            loading:"Creating new course",
            sucess:"Course created sucessfully",
            error:"Failed to create course"
        })
        return (await response).data
    }
    catch(err){
        toast.error(err?.response?.data?.message)
    }
})

export const deleteCourse=createAsyncThunk("/course/delete",async (courseId)=>{
    try{
        const response=axiosInstance.delete(`/course/${courseId}`)
        toast.promise(response,{
            loading:"Deleting the course...",
            success:"Course deleted successfully",
            error:"Failed to delete the course"
        })
        return (await response).data
    }
    catch(err){
        toast.error(err?.response?.data?.message)
    }
})


export const { } = courseSlice.actions;
export default courseSlice.reducer;