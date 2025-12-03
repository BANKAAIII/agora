"use client"

import React, { useState } from 'react'
import { DesCardsInterface } from '../utils/DesCardsInterface';
import {motion} from "framer-motion"

const SmDesCards = ({title,subTitle}:DesCardsInterface) => {
  
  const [hoverX,setHoverX] = useState(false);
  return <motion.div 
           
          
          className={`w-[600px] h-[260px] rounded-[40px] bg-[#D9D9D9]/35  flex  items-center justify-center mb-10`}
           
      transition={{ duration: 0.25, ease: "easeOut" }}
          >
      <motion.div className={`w-[550px] h-[200px] rounded-[32px] bg-[#d9d9d9]/60 flex flex-col p-[35px] items-center justify-start `}
       
        transition={{ duration: 0.25 }}
      >
        {/* title */}
        <h1 className="font-OpenSans text-[24px] font-medium  mb-[4px]" >{title}</h1>
        {/* description */}
        <h1 className="font-OpenSans italic font-light text-[20px] mt-[4px]" >{subTitle}</h1>
      </motion.div>
    </motion.div>
}

export default SmDesCards;
