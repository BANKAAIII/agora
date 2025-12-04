"use client"

import React, { useState } from 'react'
import { DesCardsInterface } from '../utils/DesCardsInterface';
import {motion} from "framer-motion"

const outer = {
  initial:{opacity:0},
  show : {opacity:1 , transition :{ staggerChildren:0.18 }}
}

const group ={
  initial : {opacity:0},
  show :{ opacity:1 , transition:{ staggerChildren:0.8 } }
}

const DesCards = ({title,subTitle}:DesCardsInterface) => {
  
  const [hoverX,setHoverX] = useState(false);
  return <motion.div 
          className={` min-w-[250px] max-w-[417px] max-h-[525px] min-h-[340px] rounded-[40px] bg-[#D9D9D9]/35  lg:m-10 flex  items-center justify-center ${hoverX? "hover:bg-TitleDot/35":" bg-[#D9D9D9]/35" }`}
           animate={hoverX ? "hover" : "rest"}
      variants={{
        rest: { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
        hover: { scale: 1.04, boxShadow: "0px 12px 28px rgba(0,0,0,0.20)" }
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
          >
      <motion.div className={`min-w-[190px] min-h-[300px] max-w-[341px] max-h-[481px] rounded-[32px] bg-[#d9d9d9]/60 flex flex-col p-[40px] lg:p-[35px] m-[10px] lg:m-[41px] items-center justify-center ${hoverX? "hover:bg-TitleDot/50":" bg-[#D9D9D9]/35" } `}
        onMouseEnter={()=>setHoverX(true)}
        onMouseLeave={()=>setHoverX(false)}
        animate={hoverX ? "hover" : "rest"}
        variants={{
          rest: { scale: 1 },
          hover: { scale: 1.03 }
        }}
        transition={{ duration: 0.25 }}
      >
        {/* title */}
        <h1 className=" font-OpenSans text-[18px] lg:text-[36px] font-medium italic mt-[20px] lg:mt-[62px]" >{title}</h1>
        {/* description */}
        <h1 className="font-OpenSans italic font-light text-[12px] lg:text-[24px] mt-[12px] mb-[40px] lg:mb-[101px]" >{subTitle}</h1>
      </motion.div>
    </motion.div>
}

export default DesCards;
