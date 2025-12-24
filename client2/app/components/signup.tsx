"use client"

import React from 'react'
import Image from 'next/image';
import back from "../public/back.png";
import Link from 'next/link';
import gmail2 from "../public/gmail2.png";
import twitter2 from "../public/twitter 2.png";
import github2 from "../public/github2 .png";
import { authCardInterface } from '../utils/authCardInterface';
import {motion} from "framer-motion"
import { useRouter} from "next/navigation"; 

const Signup = () => {
  const router = useRouter();
  return (
    <div className={`
    flex md:mt-[10px] xl:mt-[30px]
    items-center justify-center
    md:w-[550px] md:h-[550px]
    
    xl:w-[750px] xl:h-[750px]
   
    bg-[#ffffff]/80
    dark:bg-[#5B5B5B]/80
    rounded-[40px]
    md:rounded-full
    shadow-[10px_10px_29px_6px_rgb(0_0_0_/_0.25),_5px_4px_5px_4px_rgba(0,0,0,0.25)_inset]
  `} >
    <div className="flex flex-col p-3
                    
                    md:w-[340px] md:h-[420px]
                    
                    xl:w-[450px] xl:h-[600px]
                    " >
                    {/* Back Button */}
                    <motion.div
                      initial={{scale:1 , opacity:0}}
                      
                      animate={{scale:1.1 , opacity:1}}
                      transition={{duration:0.5}} className=" flex w-full pl-[30px] " onClick={()=> router.push("/")}>
           <Image src={back} alt={"loading"} className=" hover:scale-120 hover:duration-130 dark:invert w-[30px] h-[30px]" />
          </motion.div>
                    {/* Title */}
                    <div className="flex mt-[40px] xl:mt-[44px] items-center justify-start dark:text-[#dcdcdc]  " ><a className=" font-openSans text-[24px] xl:text-[32px] font-medium">Create Account</a></div>
                    {/* Input Box 1 */}
                    <div  className="flex flex-col items-start justify-start pl-[16px] mt-[40px] xl:mt-[78px] ">
                        <input placeholder='Email / Phone No.' className=" outline-none pl-[16px]"/>
                        <span className=" dark:bg-[#dcdcdc]/30  flex mt-[5px] w-[320px] h-[2px] bg-[#000000]/40" />
                    </div>
                    {/* Input Box 1 */}
                    <div  className="flex flex-col mt-[34px] items-start justify-start pl-[16px]">
                        <input placeholder='Passowrd' className="outline-none pl-[16px]"/>
                        <span className=" dark:bg-[#dcdcdc]/30  flex mt-[5px] w-[320px] h-[2px] bg-[#000000]/40" />
                    </div>
                    {/* Button  */}
                    <div className="flex items-center justify-center w-full mt-[50px]" >
                        <button className="hover:scale-102 hover:duration:110 hover:shadow-lg hover:shadow-gray-950/30 w-[100px] h-[36px] rounded-full bg-TitleDot shadow-[17px_15px_29px_-14px_rgba(0,0,0,0.29)]">Sign Up</button>
                    </div>
                    {/* Signin page Link */}
                    <div className="flex flex-row items-center justify-center gap-2 w-full mt-[30px] xl:mt-[50px]" >
                        <div className='dark:text-[#dcdcdc] ' >Already have an account</div>
                        <button className=" text-blue-600 cursor-pointer" onClick={()=>{router.push("/signin")}} >Sign-In</button>
                    </div>
                    {/* buttons */}
                    <div className="flex flex-row gap-[33px] items-center justify-center w-full md:mt-[20px] xl:mt-[50px]" >
                        <button className=" flex items-center justify-center z-0 md:w-[40px] md:h-[40px] xl:w-[60px] xl:h-[60px] rounded-full bg-[#494949]/15 dark:bg-white/8" ><Image src={github2} alt={""} className=" z-10 md:w-[25px] md:h-[25px] lg:w-[30px] lg:h-[30px] " /></button>
                        <button className="flex items-center justify-center z-0 md:w-[40px] md:h-[40px] xl:w-[60px] xl:h-[60px] rounded-full bg-[#494949]/15  dark:bg-white/8" ><Image src={gmail2} alt={""} className=" z-10 md:w-[25px] md:h-[25px] lg:w-[30px] lg:h-[30px]" /></button>
                        <button className="flex items-center justify-center z-0 md:w-[40px] md:h-[40px] xl:w-[60px] xl:h-[60px] rounded-full bg-[#494949]/15  dark:bg-white/8" ><Image src={twitter2} alt={""} className="z-10 md:w-[25px] md:h-[25px] lg:w-[30px] lg:h-[30px] " /></button>
                    </div>
                  </div>
    </div>
  )     
}

export default Signup
