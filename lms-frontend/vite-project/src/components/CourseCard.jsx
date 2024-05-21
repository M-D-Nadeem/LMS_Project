import { useNavigate } from "react-router-dom"

const CourseCard=({courseData})=>{
    const navigate=useNavigate()
    return(
        <div onClick={()=>navigate("/course/discription" , {state:{courseData}})}
            className="text-white w-[22rem] h-[430px] shadow-lg rounded-lg cursor-pointer group overflow-hidden bg-zinc-700">
            <div className="overflow-hidden">
                <img 
                    className="h-48 w-full rounded-tl-lg rounded-tr-lg group-hover:scale=[1,2] transition-all ease-in-out diration-300"
                    src={courseData?.thumbnail?.secure_url}
                    alt="course thumbnail"
                />
                <div className="p-3 space-y-1 text-white">
                    <h2 className="text-xl font-bold text-yellow-500 line-clamp-2">
                        {courseData?.title}
                    </h2>
                    <p className="line-clamp-2">
                        {courseData?.description}
                    </p>
                    <p className="font-semibold">
                        <span className="text-yellow-500 font-bold">Category : </span>
                        {courseData?.category}
                    </p>
                    <p className="font-semibold">
                        <span className="text-yellow-500 font-bold">Total lectures : </span>
                        {courseData?.numberoflectures}
                    </p>
                    <p className="font-semibold">
                        <span className="text-yellow-500 font-bold">Instructor : </span>
                        {courseData?.createdBy}
                    </p>
                </div>
            </div>

        </div>
    )
}
export default CourseCard