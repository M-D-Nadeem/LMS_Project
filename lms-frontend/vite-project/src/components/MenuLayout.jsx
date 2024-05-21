import { HiOutlineBars3} from "react-icons/hi2";
import { AiFillCloseCircle } from "react-icons/ai";
import HomePage from "../pages/HomePage";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {logoutAccount } from "../redux/Slice/authSlice";

const MenuLayout=()=>{
  
  const dispatch=useDispatch()
  const isLoggedIn=useSelector((store)=>store.auth.isLoggedIn)
  const role=useSelector((store)=>store.auth.role)
  
   function drawerSideClose(){
    const element=document.getElementsByClassName("drawer-toggle")
    element[0].checked=false
    const slide=document.getElementsByClassName("drawer-side")
    slide[0].style.width="0"
   }
   function drawerSideOpen(){
    const slide=document.getElementsByClassName("drawer-side")
    slide[0].style.width="auto"
   }

  async function handelLogOut(){
    const res=await dispatch(logoutAccount())
    
    if(res?.payload?.sucess==true ){
       <Navigate to="/"></Navigate>
    }
  }
 

    return (
        <div className="drawer ">
            <div className="absolute left-0 ">
        <input id="my-drawer" type="checkbox" className="drawer-toggle " />
       <div className="drawer-content ">
    {/* Page content here */}
    
    <label htmlFor="my-drawer" className="cursor-pointer relative" onClick={()=>drawerSideOpen()}><HiOutlineBars3 size={30} className="font-bold text-white m-4"/></label>
  </div> 
  <div className="drawer-side transition  ease-in-out duration-75">
    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay "></label>
    <ul className="menu p-4 w-fit min-h-full bg-base-200 text-base-content ">
      {/* Sidebar content here */}
      
      
      <button ><AiFillCloseCircle onClick={()=>drawerSideClose()} size={25} className="text-white font-bold z-50 absolute top-0 right-0 m-5"></AiFillCloseCircle></button>
      <li>
      <Link to="/" className="" >Home</Link> 
      </li>

      {/* If user is login and is admin then retrun a list to go to admin dashboard */}
      {isLoggedIn && role==="ADMIN" && (
        <li>
          <Link to="/admin/dashboard">Admin Dashboard</Link>
        </li>
      )}
      <li><Link to="/course" >All Courses</Link></li>
      <li><Link to="/contact" >Contact Us</Link></li>
      <li><Link to="/about" >About Us</Link></li>

      {!isLoggedIn && (
        <li className="flex-row ">
          <div>
            <Link to="/login">
              <button className="bg-yellow-500 text-white text-lg py-1 px-4 rounded-lg font-semibold cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-500">Login</button>
            </Link>
          </div>
          <div>
            <Link to="/signup">
              <button className="bg-pink-500 text-white text-lg py-1 px-4 rounded-lg font-semibold cursor-pointer hover:bg-pink-600 transition-all ease-in-out duration-500">Signup</button>
            </Link>
          </div>
        </li>
      )}
      {isLoggedIn && (
        <li className="flex-row ">
          <div>
            <Link to="/user/profile">
              <button className="bg-yellow-500 text-white text-lg py-1 px-4 rounded-lg font-semibold cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-500">Profile</button>
            </Link>
          </div>
          <div>
            <Link onClick={()=>handelLogOut()}>
              <button className="bg-pink-500 text-white text-lg py-1 px-4 rounded-lg font-semibold cursor-pointer hover:bg-pink-600 transition-all ease-in-out duration-500">Logout</button>
            </Link>
          </div>
        </li>
      )}
    </ul>
  </div>
  </div>
 
</div>

    )

}
export default MenuLayout
