import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";
import toast from "react-hot-toast";

const lectureSlice=createSlice({
    name:"lecture",
    initialState:{
        lectures: []
    },
    reducers:{

    },
    extraReducers:(builder)=>{
         builder.addCase(getLectures.fulfilled,(state,action)=>{
            state.lectures=action?.payload?.result
         })
         builder.addCase(addLecture.fulfilled,(state,action)=>{
            state.lectures=action?.payload?.data?.lectures
         })
    }
})

export const { } = lectureSlice.actions;
export default lectureSlice.reducer;

export const getLectures=createAsyncThunk("/course/lecture/get",async (courseId)=>{
    try{
        const response=axiosInstance.get(`/course/${courseId}`)
        toast.promise(response, {
            loading: "Fetching course lectures",
            success: "Lectures fetched successfully",
            error: "Failed to load the lectures"
        });
        return (await response).data
    }
    catch(err){
    toast.error(err?.response?.data?.message)
    }
})

//NOTE: we can only send one parameter during dispatch of actions 
// so in AddLeture.jsx we did like this=>
//data:{id:state.state.courseData._id,title:"",description:"",lecture:"",videoSrc:""}
export const addLecture=createAsyncThunk("/course/lecture/add",async (data)=>{
    try{
        let formData = new FormData();
        formData.append("lecture",data.lecture)
        formData.append("title",data.title)
        formData.append("description",data.description)
        const response=axiosInstance.post(`/course/${data.id}`,formData)
        toast.promise(response,{
            loading:"Adding course lectures",
            success:"Lecture added successfully",
            error:"Failed to add course lecture"
        })
        return (await response).data
    }
    catch(err){
        toast.error(err?.response?.data?.message)
        }
})

export const deleteCourseLecture=createAsyncThunk("/course/lecture/delete",async(data)=>{
    try{
        const response=axiosInstance.delete(`/course/l/${data.courseId}/${data.lectureId}`)
        toast.promise(response,{
            loading: "deleting course lecture",
            success: "Lecture deleted successfully",
            error: "Failed to delete the lectures"
        })
        return (await response).data
    }
    catch(err){
        toast.error(err?.response?.data?.message)
        }
})