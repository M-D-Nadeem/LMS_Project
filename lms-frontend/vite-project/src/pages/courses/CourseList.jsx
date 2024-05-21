import { useDispatch, useSelector } from "react-redux"
import { getAllCourses } from "../../redux/Slice/courseSlice"
import { useState } from "react"
import CourseCard from "../../components/CourseCard"

const CourseList=()=>{
    const [courseData,setCourseData]=useState([])
    const dispatch=useDispatch()

    async function loadCourses(){
      const response=await dispatch(getAllCourses())
      if(response?.payload?.sucess){
        setCourseData(response?.payload?.result)
      }
    }
     
    useState(()=>{
        loadCourses()
    },[])
    // console.log(courseData);
    return(
        <div className="p-12 min-h-[90vh] flex flex-col gap-10 text-white">
            <h1 className="text-center text-3xl font-bold">
                {"Explore the courses made by "} 
                <span className="font-bold text-yellow-500">
                    Industry experts
                </span>
            </h1>

            <div className="flex gap-10">
            {courseData.map((ele)=>{
                           return (<CourseCard  courseData={ele} key={ele._id} />)})}
            </div>
        </div>
    )
}
export default CourseList