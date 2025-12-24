"use client"

import React from 'react'
import Signup from '../components/signup'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Image from 'next/image'
import gmail2 from "../public/gmail2.png";
import twitter2 from "../public/twitter 2.png";
import github2 from "../public/github2 .png";
import { authCardInterface } from '../utils/authCardInterface';
import back from "../public/back.png";
import {motion} from "framer-motion"
import {useRouter} from "next/navigation";
;
const page = () => {
  const router = useRouter();
  return (
    <div className="relative  w-full min-h-screen  dark:bg-[#2C2C2C] overflow-hidden">

      {/* BACKGROUND BLURS */}
      <div
        className="
        absolute z-20
        top-[170px] xl:left-[550px] md:left-[300px]
        md:w-[300px] md:h-[300px] xl:w-[328px] xl:h-[336px]
        bg-[#FEE15F]/80
        opacity-60
        blur-[120px]
        rounded-xl
        "
      />

      <div
        className=" z-20
        absolute
        md:bottom-[200px] xl:bottom-[50px] xl:right-[480px] md:right-[300px]
        md:w-[300px] md:h-[300px] xl:w-[328px] xl:h-[336px]
        bg-[#FEE15F]/80
        opacity-50
        blur-[140px]
        rounded-xl
        "
      />

      {/* MAIN CONTENT */}
      <div className="relative  flex flex-col items-center justify-center">
        <NavBar className="absolute z-10 dark:bg-[#2C2C2C] mt-[24px] " />
        {/* md - Lg */}
        <div className="hidden md:block z-30" ><Signup /></div>
        {/* xs-sm */}
        <div className="md:hidden flex w-[300px] bg-TitleDot/20 rounded-4xl pt-[30px] pb-[50px]  mt-[20px] flex-col items-center justify-center " >
          {/* back button */}
          <motion.div
                      initial={{scale:1 , opacity:0}}
                      
                      animate={{scale:1.1 , opacity:1}}
                      transition={{duration:0.5}} className=" flex w-full pl-[30px] " onClick={()=>router.push("/")} >
           <Image src={back} alt={"loading"} className=" hover:scale-120 hover:duration-130 dark:invert w-[30px] h-[30px]" />
          </motion.div>
                    {/* Title */}
          <div className="flex items-center justify-start dark:text-[#dcdcdc]  " ><a className=" font-openSans text-[24px] mt-[30px] font-medium">Create Account</a></div>
                    {/* Input Box 1 */}
                    <div  className="flex flex-col items-start justify-start pl-[16px] mt-[60px] lg:mt-[78px] ">
                        <input placeholder='Email / Phone No.' className="p-3 outline-none bg-amber-950/10 pl-[16px] bg-amber-50/20 rounded-3xl"/>
                       
                    </div>
                    {/* Input Box 1 */}
                    <div  className="flex flex-col mt-[24px] items-start justify-start pl-[16px]">
                        <input placeholder='Passowrd' className="p-3 bg-amber-950/10  pl-[16px] bg-amber-50/10 rounded-3xl"/>
                    </div>
                    {/* Button  */}
                    <div className="flex items-center justify-center w-full mt-[50px]" >
                        <button className="w-[100px] h-[36px] rounded-full bg-TitleDot shadow-[17px_15px_29px_-14px_rgba(0,0,0,0.29)]">Sign Up</button>
                    </div>
                    {/* Signin page Link */}
                    <div className="flex flex-row items-center justify-center w-full mt-[30px] lg:mt-[50px] gap-1.5" >
                        <div className='dark:text-[#dcdcdc] ' >Already have an account</div>
                        <div className="text-blue-600 cursor-pointer" onClick={()=>router.push("/signin")}>Sign-In</div>
                        </div>
                    {/* buttons */}
                    <div className="flex flex-row gap-[33px] items-center justify-center w-full mt-[25px]" >
                        <button className=" flex items-center justify-center z-0 p-2 rounded-full bg-[#494949]/15 dark:bg-white/8" ><Image src={github2} alt={""} className=" z-10 w-[25px] h-[25px] " /></button>
                        <button className="flex items-center justify-center z-0 p-2 rounded-full bg-[#494949]/15  dark:bg-white/8" ><Image src={gmail2} alt={""} className=" z-10 w-[25px] h-[25px] " /></button>
                        <button className="flex items-center justify-center z-0 p-2 rounded-full bg-[#494949]/15  dark:bg-white/8" ><Image src={twitter2} alt={""} className="z-10 w-[25px] h-[25px] " /></button>
                    </div>
                  </div>
        
      </div>

    </div>
  )
}

export default page
