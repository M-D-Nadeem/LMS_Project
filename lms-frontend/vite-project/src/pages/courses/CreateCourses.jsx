import { useState } from "react"
import toast from "react-hot-toast"
import { AiOutlineArrowLeft } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { createCourse } from "../../redux/Slice/courseSlice"

const CreateCourse=()=>{
    
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const [courseData,setCourseData]=useState({
        title:"",
        description:"",
        category:"",
        createdBy:"",
        thumbnail:"",
        previewImage:""
    })
     function handelImageUpload(e){
        e.preventDefault()
        const uplaodImage=e.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(uplaodImage);
        reader.onload = (e) => {
        const url = e.target.result;
        setCourseData({
        ...courseData,
        thumbnail:uplaodImage,
        previewImage:url
      })
      };   
    }
    function handelFormData(e){
        const {name,value}=e.target
        setCourseData({
            ...courseData,
            [name]:value
        })
    }
    async function onSubmit(e){
        e.preventDefault()
        if(!courseData.title || !courseData.description || !courseData.category || !courseData.createdBy){
             toast.error("All fields are mandatory")
             return
        }
        //If any data is accepted in form of formData from backend then use this method
        //to convert data to form data 1st before sending it to backend
        let formData = new FormData();
        formData.append("title", courseData?.title);
        formData.append("description", courseData?.description);
        formData.append("category", courseData?.category);
        formData.append("createdBy", courseData?.createdBy);
        formData.append("thumbnail", courseData?.thumbnail);
        const response=await dispatch(createCourse(formData))
        // console.log(response);
        if(response?.payload?.sucess){
            setCourseData({
                title:"",
                description:"",
                category:"",
                createdBy:"",
                thumbnail:"",
                previewImage:""
            })
            navigate("/course")
        }
    }
    return(
        <div className="flex items-center justify-center min-h-[100vh]">
            <form noValidate onSubmit={onSubmit} className="flex  flex-col justify-center w-[100vh] gap-5 rounded-lg shadow-[0_0_10px_black] text-white">

            <div className="flex px-3 py-2 gap-[33vh]">   
            <Link onClick={()=>navigate(-1)} className=" text-2xl font-bold link text-accent cursor-pointer">
                        <AiOutlineArrowLeft />
            </Link>
            <h1 className="text-2xl font-bold text-center  ">Create New Course</h1>
            </div> 
               
               <main className="grid grid-cols-2 gap-x-10">
                <div className="flex flex-col gap-3">
                <div className="px-3">
                    <label htmlFor="uplaodImage">
                        {(courseData.previewImage==="")?
                        <div className="w-full h-44 m-auto flex  items-center justify-center border">
                            <h1 className="font-bold text-lg text-yellow-300">Upload your course thumbnail</h1>
                        </div>
                        :
                        <img src={courseData.previewImage} className="h-44 w-full px-3 py-3 rounded-3xl" ></img>}
                    </label>
                    <input onChange={handelImageUpload} type="file"
                           id="uplaodImage"
                           accept=".jpg, .jpeg, .png, .src"
                           name="uploadImage"
                           className="hidden " ></input>
                </div>
                <div className="flex flex-col gap-2 px-3">
                    <label htmlFor="courseTitle" className="text-lg font-semibold">Course title</label>
                    <input type="text"
                           id="courseTitle"
                           name="title"
                           required
                           placeholder="Enter course title"
                           className="bg-transparent border py-1 px-2"
                           onChange={handelFormData}
                           value={courseData.title}
                           ></input>
                </div>
                </div>
                <div>
                <div className="flex flex-col gap-2 px-3">
                    <label htmlFor="CourseInstructor" className="text-lg font-semibold">Course instructor</label>
                    <input type="text"
                           id="CourseInstructor"
                           name="createdBy"
                           required
                           placeholder="Enter course instructor"
                           className="bg-transparent border py-1 px-2"
                           onChange={handelFormData}
                           value={courseData.createdBy}
                           ></input>
                </div>
                <div className="flex flex-col gap-2 px-3">
                    <label htmlFor="CourseCategory" className="text-lg font-semibold">Course category</label>
                    <input type="text"
                           id="CourseCategory"
                           name="category"
                           required
                           placeholder="Enter course category"
                           className="bg-transparent border py-1 px-2"
                           onChange={handelFormData}
                           value={courseData.category}
                           ></input>
                </div>
                <div className="flex flex-col gap-2 px-3">
                    <label htmlFor="CourseDescription" className="text-lg font-semibold">Course description</label>
                    <input type="text"
                           id="CourseDescription"
                           name="description"
                           required
                           placeholder="Enter course description"
                           className="bg-transparent border py-10 px-2"
                           onChange={handelFormData}
                           value={courseData.description}
                           ></input>
                </div>
                </div>
                </main>
                <div className="px-2 py-2">
                <button type="submit" className="bg-yellow-500 w-full py-2 rounded-sm text-lg font-semibold hover:bg-yellow-400 transition-all ease-in-out duration-300">
                    Create Course
                </button>
                </div>
            </form>
        </div>
        
    )
}
export default CreateCourse