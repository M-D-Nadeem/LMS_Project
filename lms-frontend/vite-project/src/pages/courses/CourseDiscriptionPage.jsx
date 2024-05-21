import { useSelector } from "react-redux";
import {  useLocation, useNavigate } from "react-router-dom"

const CourseDiscriptionPage=()=>{
    const {state}=useLocation()
    const {role,data}=useSelector((store)=>store.auth)
    const navigate=useNavigate()
    return(
        <div className="min-h-[100vh] flex gap-10 items-center justify-center text-white">
            <div className="">
                
                <img 
                src={state.courseData.thumbnail.secure_url}
                className="w-fill h-60 py-5"
                alt="thumbnail"
                ></img>
                
                <div className="flex flex-col gap-3">
                   <p className="font-bold text-yellow-500 text-xl">
                    {"Total Lectures : "}
                    <span className="font-semibold" >
                      {state.courseData.numberOfLectures}
                    </span>
                   </p>

                   <p className="font-bold text-yellow-500 text-xl">
                    {"Instructor : "}
                    <span className="font-semibold" >
                      {state.courseData.createdBy}
                    </span>
                   </p>

                   <div>
                    {/* we have provide {...state} so to prevent object nesting {state{state:courseData}} */}
                    {(role==="ADMIN" || data?.subscription?.status==="active")?
                    <button onClick={()=>navigate("/course/displaylecture", {state:{...state}})} className="bg-yellow-600 text-xl font-bold px-5 py-3 rounded-md w-full hover:bg-yellow-500 transition-all ease-in-out">Watch Lectures</button>
                :
                <button onClick={()=>navigate("/checkout")}
                className="bg-yellow-600 text-xl font-bold px-5 py-3 rounded-md w-full hover:bg-yellow-500 transition-all ease-in-out">Subscribe</button>}
                   </div>
                </div>
                
            </div>
            <div className="flex flex-col gap-1 relative bottom-28">
                <h1 className="text-2xl font-bold text-yellow-500 mb-5 text-center ">
                    {state.courseData.title}
                </h1>
                <p className="text-yellow-500 font-semibold text-lg" >Course description: </p>
                <p>{state.courseData.description}</p>
            </div>
        </div>
    )
}
export default CourseDiscriptionPage