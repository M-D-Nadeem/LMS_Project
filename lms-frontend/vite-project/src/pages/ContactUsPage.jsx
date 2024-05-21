import { useState } from "react"
import toast from "react-hot-toast"
import { emailMatch } from "../helper/regexMatch"
import axiosInstance from "../helper/axiosInstance"

const ContactUsPage=()=>{
   const [contactData,setContactData]=useState({
    name:"",
    email:"",
    message:"",
   })

   function handelContactData(e){
    const {name,value}=e.target 
    setContactData({
        ...contactData,
        [name]:value
    })
   }

   async function onSubmit(e){
     e.preventDefault()
     if(!contactData.name || !contactData.email || !contactData.message){
        toast.error("All fields are mandatory")
        return
     }
     if(!emailMatch(contactData.email)){
        toast.error("Invalid email")
        return
     }
     try{
        const response=axiosInstance.post("/Miscellaneous/contactUs",contactData)
        toast.promise(response,{
            loading: "Submitting your message...",
            success: "Form submitted successfully",
            error: "Failed to submit the form"
        })
        const catchResponse=await response
        console.log(catchResponse);
        if(catchResponse?.data?.sucess){
            setContactData({
                name:"",
                email:"",
                message:"",
            })
        }
     }
     catch(err){
        toast.error("Operation failed",err.message)
     }
   }

    return(
        <div className="flex items-center justify-center h-[100vh]" >
            <form noValidate onSubmit={onSubmit} className="flex flex-col w-1/4 gap-4 px-3 items-center justify-center text-white shadow-[0_0_10px_black]">
                <h1 className="font-bold text-3xl">Contact Form</h1>

                <div className="flex flex-col w-full py-2 gap-2">
                    <label htmlFor="name" className="text-xl font-semibold">
                        Name
                    </label>
                    <input type="text" className=" bg-transparent border text-xl rounded-sm" 
                    placeholder="Enter your name"
                    name="name"
                    id="name"
                    onChange={handelContactData}
                    value={contactData.name}
                    ></input>
                </div>

                <div className="flex flex-col w-full py-2 gap-2">
                    <label htmlFor="email" className="text-xl font-semibold">
                        Email
                    </label>
                    <input type="email" className=" bg-transparent border text-xl rounded-sm" 
                    placeholder="Enter your Email"
                    name="email"
                    id="email"
                    onChange={handelContactData}
                    value={contactData.email}
                    ></input>
                </div>

                <div className="flex flex-col w-full py-2 gap-2">
                    <label htmlFor="message" className="text-xl font-semibold">
                        Message
                    </label>
                    <textarea className=" bg-transparent border text-xl rounded-sm" 
                    placeholder="Enter your Message"
                    name="message"
                    id="message"
                    onChange={handelContactData}
                    value={contactData.message}
                    ></textarea>
                </div>

                
                <button type="submit" className="w-full text-lg py-2 rounded-sm font-bold bg-yellow-500 hover:bg-yellow-400 transition-all ease-in-out duration-500 cursor-pointer">Submit</button>
                

            </form>
        </div>
    )
}
export default ContactUsPage