"use client"
import React from 'react'
import {easeIn, motion} from "framer-motion";

const Introduction = () => {
  return (
    <div className="hidden md:block" >
    <motion.div 
    initial={{ opacity:0}}
    animate={{ opacity:1}}
    transition={{duration:1.2,ease:easeIn}}
    className=" flex flex-col items-center justify-center p-10">
      {/* Title */}
      <div className="flex w-full">
        <a className=" font-OpenSans font-bold italic 
                       text-[#ffffff] 
                       md:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] " >What's a wallet?</a>
      </div>
      
      {/* Para 1 */}
      <div className="flex w-full flex-col" >
        {/* title */}
        <a className="font-OpenSans lg:text-[30px] md:text-[25px] xl:text-[40px] italic text-[#ffffff]
                       md:mt-[55px]  lg:mt-[63px] xl:mt-[87px] " >A home for your digital assets</a>
        <a className="font-OpenSans md:mt-[16px] lg:mt-[20px] xl:text-[24px] italic text-[#ffffff]
                      xl:mt-[8px]" >wallets are used to send,recieve, stotre and<br/> display digital assets like ethereum and NFT’s.</a>
      </div>
      {/* Para 2 */}
      <div className="flex w-full flex-col" >
        {/* title */}
        <a className="font-OpenSans g:text-[30px] md:text-[25px] xl:text-[40px] italic text-[#ffffff]
                       md:mt-[55px]  lg:mt-[63px] xl:mt-[87px]" >A brand new way to login</a>
        <a className="font-OpenSans  md:mt-[16px] lg:mt-[20px] xl:text-[24px] italic text-[#ffffff]
                      xl:mt-[8px]" >Instead od creating new accounts and passwords<br/> on every new website , just connect your wallet.</a>
      </div>

      {/* Button1 */}
      {/* Button 2 */}
    </motion.div>
    </div>
  )
}

export default Introduction