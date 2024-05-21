import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { deleteCourseLecture, getLectures } from "../../redux/Slice/lectureSlice"

const DisplayLectures=()=>{
    const {state}=useLocation()
    const [currentVideo,setCurrentVideo]=useState(0)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const lectures=useSelector((store)=>store.lecture.lectures)
    const role=useSelector((store)=>store.auth.role)
    async function loadLectures(){
        console.log(state.courseData._id);
        if(!state){
            navigate("/course")
            return
        } 
        await dispatch(getLectures(state.courseData._id))
    }
    async function handelDeleteLecture(courseId,lectureId){
        const data={courseId:courseId,lectureId:lectureId}
       const response= await dispatch(deleteCourseLecture(data))
    //    console.log(response);
        await dispatch(getLectures(courseId))
    }

    //if we directly jump to this page then in that
    //case we can't fetch state form useLocation because state is passed as an attribut
    //to navigate
    useEffect(()=>{
        if(!state) navigate("/course");
        loadLectures()
    },[])
    return(
       <div className="min-h-[90vh] flex flex-col items-center justify-center">
        
        <div className="p-3">
            <h1 className="text-3xl text-yellow-500 font-bold text-center">
            Course title: {state.courseData.title}</h1>
        </div>

        {(lectures && lectures.length!==0)?
    (<main className="flex gap-4 w-full">
    <div className="w-[400px] rounded-lg shadow-[0_0_10px_black]">
        <div className="flex text-center justify-between px-2 py-3">
        <p className="text-2xl font-semibold text-yellow-500">
            Lecture List
        </p>
        {role==="ADMIN" && <button onClick={()=>navigate("/course/addlecture",{state:{...state}})} className="bg-blue-800 hover:bg-blue-700 transition-all ease-in-out duration-300 px-2 py-1 rounded-md font-semibold text-sm">
            Add new Lectures
            </button>}
        </div>
        <ul className="">
            {lectures && lectures.map((ele,idx)=>{
                return (<li className="space-y-2 px-2 py-3" key={ele._id}>
                       <p onClick={()=>setCurrentVideo(idx)} className="cursor-pointer text-lg ">
                        Lecture{" "+(idx+1)}:{" "+ele.title}
                       </p>
                       {role==="ADMIN" && <button onClick={()=>handelDeleteLecture(state.courseData._id,lectures[currentVideo]._id)}
                                         className="bg-red-700 hover:bg-red-600 transition-all ease-in-out duration-300 px-2 py-1 rounded-md font-semibold text-sm">
            Delete Lecture
            </button>} 
                </li>)
            })}   
        </ul>
    </div>

    <div className="w-full flex flex-col rounded-lg shadow-[0_0_10px_black]">
        <div className="p-3">
      <video className="rounded-lg w-full"
             src={lectures && lectures[currentVideo]?.lecture?.secure_url} 
             controls
             controlsList="nodownload"
             ></video>
             </div>
             <div className="p-3 space-y-2">
                <h1 className="">
                    <span className="text-yellow-500 text-xl font-bold">Title:{" "}</span>
                    {lectures && lectures[currentVideo]?.title}
                </h1>

                <p className="">
                    <span className="text-yellow-500 text-xl font-bold">Description:{" "}</span>
                    {lectures && lectures[currentVideo]?.description}
                </p>
             </div>
    </div>
</main>) 
:
    (role==="ADMIN" &&  <div>
    <button onClick={()=>navigate("/course/addlecture" , {state:{...state}})} className="btn btn-primary px-2 py-1 rounded-md font-semibold text-sm">
            Add new Lectures
            </button>
            </div>)  
    } 
</div>
    )
}
export default DisplayLectures