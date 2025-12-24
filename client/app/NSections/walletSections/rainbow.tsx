"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Rainbow = () => {

  return (
    <div className="flex w-full h-full  flex-col ">
      {/* logo and walletName  */}
      <div className="flex w-full flex-col " >
        <div className="flex flex-row gap-x-2 " >
          <Image src={"/rainbow.png"} width={50} height={50} alt="" className="xl:w-[80px] xl:h-[80px] rounded-2xl opacity-80" />
          <a className="text-7xl font-poppins text-[#ffffff]/90 font-medium flex items-center justify-center p-2 " >rainbow</a>
          </div>
        <div className="p-5 font-poppins text-3xl text-[#ffffff]/80 font-normal" >Rainbow Extension. Built for speed. Built for power.<br/> Built for You.</div>
      </div>
      {/* connect button */}
      <div className="grid grid-cols-[1fr_2fr] w-[50%] h-[40%] mt-[5%] shadow-2xl rounded-[20px] " >
        {/* QR code */}
        <div className="flex w-full h-full items-center justify-center px-5" >
          <div className="w-full aspect-square bg-red-200 rounded-2xl" ></div>
        </div>
        {/* connector */}
        <div className="flex flex-col w-full h-full items-center justify-center gap-y-6" >
          <button className=" flex w-[70%] rounded-2xl h-[20%] items-center justify-center border border-2 " onClick={()=>{}} >
            <a className=""></a>
          </button>
          <button className=" flex w-[70%] rounded-2xl h-[20%]   border border-2 " onClick={()=>{}} />
        </div>
      </div>
    </div>
  );
};

export default Rainbow;
