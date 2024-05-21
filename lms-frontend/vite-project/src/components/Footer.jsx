import { BsInstagram ,BsFacebook,BsTwitter,BsLinkedin } from "react-icons/bs";
import { Link } from "react-router-dom";
import React from "react";
const Footer=()=>{
    const currentYear = new Date().getFullYear();
    return(
        <footer className="bg-gray-700 relative bottom-0 w-full  h-[15vh] flex flex-col sm:flex-row sm:px-20 text-white items-center justify-between" >
            <section className="text-lg">
                Made by MD Nadeem ©️ {currentYear} | All rights reserved
            </section>
            <section className="flex items-center justify-between text-2xl gap-5">
                <Link to="" className="hover:text-yellow-500 transition-all ease-in-out duration-300"><BsFacebook /></Link>
                <Link to="" className="hover:text-yellow-500 transition-all ease-in-out duration-300"><BsInstagram /></Link>
                <Link to="" className="hover:text-yellow-500 transition-all ease-in-out duration-300"><BsTwitter /></Link>
                <Link to="" className="hover:text-yellow-500 transition-all ease-in-out duration-300"><BsLinkedin /></Link>
            </section>
        </footer>
    )
}
export default Footer