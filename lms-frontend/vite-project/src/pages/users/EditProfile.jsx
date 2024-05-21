import { useDispatch, useSelector } from "react-redux"

import { Link, useNavigate } from "react-router-dom"
import { updateUser } from "../../redux/Slice/authSlice.js"
import { useState } from "react"
import { BsPersonCircle } from "react-icons/bs"
import { AiOutlineArrowLeft } from "react-icons/ai"

const EditProfile=()=>{
    
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const [userData,setUserData]=useState({
        fullName:"",
        avtar:"",
        previewImage:"",
    })

    function handelImageUpload(e){
        e.preventDefault(e)
        const uploadImage=e.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(uploadImage);
        reader.onload = (e) => {
        const url = e.target.result;
        setUserData({
            ...userData,
            avtar:uploadImage,
            previewImage:url
            
        })
    }
        
}

function handelFormData(e){
    const {name,value}=e.target
    setUserData({
        ...userData,
        [name]:value
    })
}
async function onSubmit(e){
    e.preventDefault()
    if(!userData.fullName || !userData.avtar){
        toast.error("All fields are mandatory");
        return
    }
    if(userData.fullName.length < 3) {
        toast.error("Name cannot be of less than 3 characters");
        return;
    }
    const formData=new FormData()
    formData.append("fullName",userData.fullName)
    formData.append("avtar",userData.avtar)

    const response=await dispatch(updateUser(formData))
    if(response?.payload?.sucess){
        navigate("/user/profile")

    }
}
    return(
        <div className="h-[100vh] flex items-center justify-center ">
            <form noValidate onSubmit={onSubmit} className="rounded-lg w-1/3 shadow-[0_0_10px_black] text-white  flex flex-col gap-7 py-5">
               <h1 className="text-2xl font-bold text-center">Edit Profile</h1>

               
                <label htmlFor="uploadImage" className="cursor-pointer" >
                    {(!userData.previewImage)?
                     (<BsPersonCircle className="w-24 h-24 rounded-full m-auto " />):
                     (<img src={userData.previewImage}
                          className="w-24 h-24 rounded-full m-auto"
                          alt="img" ></img>)
                }
                </label>
                <input type="file"
                       id="uploadImage"
                       name="uploadImage"
                       className="hidden"
                       accept=".jpg , .jpeg , .png , .svg"
                       onChange={handelImageUpload} ></input>

               <div className="flex flex-col gap-2 px-3">
                <label htmlFor="fullName" className="text-lg font-semibold">Full Name</label>
                <input type="text" 
                       className="bg-transparent px-2 py-1 border rounded-sm"
                       placeholder="Enter your name"
                       id="fullName"
                       name="fullName"
                       value={userData.fullName} 
                       onChange={handelFormData}/>
               </div>

                <div className="flex flex-col gap-5 px-3">
               <button type="submit"
                       className="bg-yellow-500 w-full rounded-sm cursor-pointer text-lg font-bold py-2 hover:bg-yellow-400 transition-all ease-in-out duration-300"
                >Update Profile</button>
                       
                <Link to="/user/profile">
                    <div className="font-bold flex items-center justify-center link text-accent gap-5">
                     <AiOutlineArrowLeft /> Go back to profile
                    </div>
                </Link>       
                </div>
            </form>
        </div>
    )
}
export default EditProfile