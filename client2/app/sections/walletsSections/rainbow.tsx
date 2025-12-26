"use client"
import React from 'react'
import {easeIn, motion} from "framer-motion";
import Image from "next/image";

const Rainbow = () => {
  return (
    <div className="hidden md:block" >
    <motion.div 
    initial={{ opacity:0}}
    animate={{ opacity:1}}
    transition={{duration:1.2,ease:easeIn}}
    className=" flex flex-col items-center justify-center p-10">
      {/* Title */}
      <div className="flex w-full">
       <div className=" font-OpenSans font-bold italic flex gap-x-6 flex-row items-center justify-center 
                              text-[#ffffff] 
                              md:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] " >
                               <Image src="/rainbow.svg" height={20} width={20}  alt="loading logo" className=" xl:w-[60px] xl:h-[60px] " />
                               <a>Rainbow</a>
                              </div>
      </div>
      
      {/* Para 1 */}
      <div className="flex w-full flex-col" >
        {/* title */}
        <a className="font-OpenSans lg:text-[30px] md:text-[25px] xl:text-[40px] italic text-[#ffffff]
                       md:mt-[55px]  lg:mt-[63px] xl:mt-[87px] " >A home for your digital assets</a>
        <a className="font-OpenSans md:mt-[16px] lg:mt-[20px] xl:text-[24px] italic text-[#ffffff]
                      xl:mt-[8px]" >Manage tokens, NFTs, and apps with speed and elegance.</a>
      </div>
      {/* Para 2 */}
      <div className="flex w-full flex-col" >
        {/* title */}
        <a className="font-OpenSans g:text-[30px] md:text-[25px] xl:text-[30px] italic text-[#ffffff]
                       md:mt-[55px]  lg:mt-[63px] xl:mt-[87px]" >Get started by connecting your Rainbow wallet.</a>
      </div>

      {/* Button1 */}
      {/* Button 2 */}
    </motion.div>
    </div>
  )
}

export default Rainbow;
