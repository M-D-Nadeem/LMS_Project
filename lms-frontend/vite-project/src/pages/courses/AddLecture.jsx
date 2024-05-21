import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { AiOutlineArrowLeft } from "react-icons/ai"
import { useLocation, useNavigate } from "react-router-dom"
import { addLecture } from "../../redux/Slice/lectureSlice"
import { useDispatch } from "react-redux"

const AddLecture=()=>{
    const navigate=useNavigate()
    const {state}=useLocation()
    // console.log(state.courseData);
    const dispatch=useDispatch()
    console.log(state);
    const [data,setFormData]=useState({
        id:state.courseData._id,
        title:"",
        description:"",
        lecture:"",
        videoSrc:""
    })


    function setVedio(e){
        
        const uploadVideo=e.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(uploadVideo);
        reader.onload = (e) => {
        const url = e.target.result;
        setFormData({
            ...data,
            lecture:uploadVideo,
            videoSrc:url
        })
        }
    }
    function setData(e){
        const {name,value}=e.target
        setFormData({
            ...data,
            [name]:value
        })
    }
    async function submitData(e){
        e.preventDefault()
        if(!data.title || !data.description || !data.lecture){
            toast.error("All fields are mandatory")
            return
        }
        
        
        const response=await dispatch(addLecture(data))
        // console.log(response);
        if(response?.payload?.sucess){
           navigate(-1)
           setFormData({
            id:"",
            title:"",
           description:"",
           lecture:"",
           videoSrc:""
           })
        }
    }
    //If we directly come to /addlecture route from adminDashboard we and after successfully
    //adding the lecture we will navigate(-1){i.s. to /displaylecture route} but in this 
    //case we can't fetch state form useLocation because state is passed as an attribut
    //to navigate
    useEffect(() => {
        if(!state) navigate("/course");
    }, [])

    return(
        <div className="min-h-[90vh] flex flex-col justify-center items-center">
            <div className="w-1/2 rounded-lg shadow-[0_0_10px_black] text-white">
            <div className="flex px-3  gap-[130px] py-4">
                <div onClick={()=>navigate(-1)} className="font-bold mt-1 text-2xl">
                <AiOutlineArrowLeft />
                </div>
                 <h1 className="font-bold text-2xl  text-yellow-500">Add new lecture</h1>
            </div>

            <form onSubmit={submitData} className="flex flex-col gap-3"> 
                <div className="px-3">
                    <input onChange={setData} type="text"
                           className="w-full border px-3 bg-transparent text-lg font-semibold"
                           placeholder="Enter the title of the lecture"
                           name="title"
                           ></input>
                </div>
                 <div className="px-3">
                    <textarea onChange={setData} type="text"
                              name="description"
                              placeholder="Enter the description of the lecture"
                              className="bg-transparent w-full px-3 py-1 border overflow-y-scroll h-36"
                              ></textarea>
                </div> 

                
                  {(data.videoSrc)?
                  (<video src={data.videoSrc}
                         className="rounded-xl w-full h-48 object-fill px-3"
                         controls
                         disablePictureInPicture
                         controlsList="nodownload nofullscreen"></video>)
                         :
                    (<div  className="px-3">
                        <label htmlFor="lecture" className="w-full h-48 flex items-center justify-center border  cursor-pointer text-lg font-semibold">Choose your video</label>
                        <input type="file"
                               className="hidden"
                               id="lecture"
                               name="lecture"
                               accept="video/mp4 video/x-mp4 video/*"
                               onChange={setVedio}></input>
                    </div>)     

                }

                
                <div className="px-3 py-1">
                <button type="submit" className="btn btn-primary  w-full flex font-semibold text-lg">
                            Add new Lecture
                        </button>
                        </div>
            </form>
            </div>
        </div>
    )
}
export default AddLecture