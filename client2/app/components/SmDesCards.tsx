"use client"

import React, { useState } from 'react'
import { DesCardsInterface } from '../utils/DesCardsInterface';
import {easeIn, motion} from "framer-motion"

const hardcodedCardVariants ={
  hidden:{
    opacity:0,
    y:40
  },
  visible:{
    opacity:1,
    y:0,
    
    transition:{
      duration:0.6,
      ease:easeIn
    }
  }
}

const SmDesCards = ({title,subTitle,containerVariants, cardVariants}:DesCardsInterface) => {
  
  const [hoverX,setHoverX] = useState(false);
  return <motion.div 
           variants={hardcodedCardVariants}
          className={`w-[340px]  sm:w-[430px] sm:h-[260px] rounded-[40px] bg-[#D9D9D9]/35  flex  items-center justify-center mb-10`}
          
          >
      <motion.div 
     
      className={`flex-wrap pt-3 sm:pt-0 m-2  sm:w-[400px] sm:h-[200px] rounded-[32px] bg-[#d9d9d9]/60 flex flex-col p-4 sm:p-[35px] items-center justify-start `}
        >
        {/* title */}
        <h1 className="font-OpenSans text-[16px] sm:text-[18px] font-medium mt-[4px]  mb-[4px]" >{title}</h1>
        {/* description */}
        <h1 className="font-OpenSans italic font-light text-[12px] sm:text-[20px] mt-[2px]" >{subTitle}</h1>
      </motion.div>
    </motion.div>
}

export default SmDesCards;