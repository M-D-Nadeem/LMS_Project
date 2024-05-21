
import { useRef, useState } from "react"
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {toast} from "react-hot-toast"
import { createAccount } from "../redux/Slice/authSlice.js";
import { useNavigate } from "react-router-dom";
import { emailMatch, passwordMatch } from "../helper/regexMatch.js";

const Signup=()=>{
    const dispatch=useDispatch()
    const [previewImage,setPreviewImage]=useState("")
    const [signUpData,setSignUpData]=useState({
        fullName:"",
        email:"",
        password:"",
        avtar:""
    })
     const navigate=useNavigate()

    function handelSignup(e){
        const {name,value}=e.target 
        setSignUpData({
            //set all the values as it is
            ...signUpData,
            //change the fullName to new value
            [name]:value
        })
    }

    function getImage(e){
      e.preventDefault()
        const uplaodImage=e.target.files[0]
        setSignUpData({
            ...signUpData,
            avtar:uplaodImage
        })
        //converting the image to url
        const reader = new FileReader();
        reader.readAsDataURL(uplaodImage);
        reader.onloadend = () => {
        setPreviewImage(reader.result); // reader.result contains the data URL representing the file
       
    };
    }

    async function formSubmit(e){
      e.preventDefault()
      if(!signUpData.email || !signUpData.password || !signUpData.fullName || !signUpData.avtar){
        toast.error("Please fill all the details")
        return
      }
      if(signUpData.fullName.length<5){
        toast.error("Name should be atleast 5 charecters")
        return
      }
      if(!emailMatch(signUpData.email)){
        toast.error("Email not valid")
        return
      }
      if(!passwordMatch(signUpData.password)){
        toast.error("Password not valid")
        return
      }
      
      //If any data is accepted in form of formData from backend then use this method
      //to convert data to form data 1st before sending it to backend
      const formData=new FormData()
      formData.append("fullName",signUpData.fullName)
      formData.append("email",signUpData.email)
      formData.append("password",signUpData.password)
      formData.append("avtar",signUpData.avtar)

      const response=await dispatch(createAccount(formData))
      // console.log(response);
      if(response?.payload?.sucess){
        setSignUpData({
          fullName:"",
          email:"",
          password:"",
          avtar:""
        })
        setPreviewImage("")
        navigate("/")

      }

      
    }

    return(
        <div className="flex  items-center justify-center h-[100vh]">
            <form noValidate onSubmit={formSubmit} className="flex flex-col gap-5 justify-center rounded-lg w-1/3 text-white shadow-[0_0_10px_black]">
                <h1 className="text-2xl font-bold text-center">Registration Page</h1>
                <label htmlFor="image_upload" className="cursor-pointer ">
                    {(!previewImage)?<BsPersonCircle className="w-24 h-24 rounded-full m-auto" />:
                    (<img className="w-24 h-24 rounded-full m-auto" src={previewImage} />)
                    }
                </label>
                <input onChange={getImage} className="hidden" type="file" name="image_upload" id="image_upload" 
                accept=".jpg , .jpeg , .png , .svg" ></input> 

                <div className="flex flex-col gap-2 mx-4">
               <label htmlFor="fullName" className="font-semibold text-white text-xl">Name</label>
               <input onChange={handelSignup} type="text" id="fullName" name="fullName" required={true} 
               placeholder="Enter your Name..." className="px-4 h-8 bg-transparent border" 
               value={signUpData.fullName}></input>
            </div>

                <div className="flex flex-col gap-2 mx-4">
               <label htmlFor="email" className="font-semibold text-white text-xl">Email</label>
               <input onChange={handelSignup} type="email" id="email" name="email" required={true} 
               placeholder="Enter your Email..." className="px-4 h-8 bg-transparent border" 
               value={signUpData.email}></input>
            </div>

            <div className="flex flex-col gap-2 mx-4">
               <label htmlFor="password" className="font-semibold text-white text-xl">Password</label>
               <input onChange={handelSignup} type="password" id="password" name="password" required={true} 
               placeholder="Enter your Password..." className="px-4 h-8 bg-transparent border" 
               value={signUpData.password}></input>
            </div>

            <button type="submit" className="mx-4 mt-4 text-xl font-bold bg-yellow-500 hover:bg-yellow-400 transition-all ease-in-out duration-500 rounded-lg h-12">Create Account</button>

            <p className="text-center font-semibold">
                Already have account? <Link to="/login" className="text-blue-700">Login</Link> 
            </p>
            </form>

           
        </div>
    )
}
export default Signup
