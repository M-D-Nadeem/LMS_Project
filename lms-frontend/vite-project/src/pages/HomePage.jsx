import React from "react"
import { Link } from "react-router-dom"
import homePageMainImage from "../assets/images/homePageMainImage.png"


const HomePage=()=>{
    return (
        
        <div className="min-h-screen flex items-center justify-between">
            <div className="ml-32">
            <div className="w-[500px] space-y-6">
                <div className="text-white">
                
                      </div>
                <h1 className="text-5xl font-semibold">Find out best
                <span className="text-yellow-500 font-bold">Online Course</span></h1>
                <p className="text-xl text-gray-200">
                    We have large library of courses tought by highly skilled and qualified teachers at a very affordable price.
                </p>
            </div>
            <div className="flex gap-10 py-6">
                <Link to="/courses">
                    <button className="bg-yellow-500 py-4 px-2 rounded-lg font-semibold text-xl text-white cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-500">Explore courses</button>
                </Link>

                <Link to="/contact">
                    <button className="border border-yellow-500 py-4 px-2 rounded-lg font-semibold text-xl text-white cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-500">Contact us</button>
                </Link>
            </div>
            </div>
            <img src={homePageMainImage} alt="Error404" className="w-1/3 h-1/3  rounded-full mr-20"></img>
        </div>
        
    )
}
export default HomePage
