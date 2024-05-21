import { useState } from "react"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { loginAccount } from "../redux/Slice/authSlice"


const Login=()=>{
    
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const [logInData,setLogInData]=useState({
        email:"",
        password:"",
    })
    function handelLogin(e){
        const {name,value}=e.target 
        setLogInData({
            ...logInData,
            [name]:value
        })
    }
    async function formSubmit(e){
        e.preventDefault()
        if(!logInData.email || !logInData.password){
            toast.error("Please fill all the details")
        }

        //Here data is not acceped in form of formData so no need to convert it to form data 
        const response=await dispatch(loginAccount(logInData))
        // console.log(response);
        
        if(response?.payload?.sucess){
            navigate("/")  
        }
        setLogInData({
        email:"",
        password:"",
        })
    }

    return(
        <div className="flex  items-center justify-center h-[100vh]">
            <form noValidate onSubmit={formSubmit} className="flex flex-col gap-5 justify-center rounded-lg w-1/3 text-white shadow-[0_0_10px_black]">
                <h1 className="text-2xl font-bold text-center">Login Page</h1>


                <div className="flex flex-col gap-2 mx-4">
               <label htmlFor="email" className="font-semibold text-white text-xl">Email</label>
               <input onChange={handelLogin} type="email" id="email" name="email" required={true} 
               placeholder="Enter your Email..." className="px-4 h-8 bg-transparent border" 
               value={logInData.email}></input>
            </div>

            <div className="flex flex-col gap-2 mx-4">
               <label htmlFor="password" className="font-semibold text-white text-xl">Password</label>
               <input onChange={handelLogin} type="password" id="password" name="password" required={true} 
               placeholder="Enter your Password..." className="px-4 h-8 bg-transparent border" 
               value={logInData.password}></input>
            </div>

            <button type="submit" className="mx-4 mt-4 text-xl font-bold bg-yellow-500 hover:bg-yellow-400 transition-all ease-in-out duration-500 rounded-lg h-12">Create Account</button>

            <p className="text-center font-semibold">
                Do not have an account? <Link to="/signup" className="text-blue-700">Signup</Link> 
            </p>
            </form>

           
        </div>
    )
}
export default Login