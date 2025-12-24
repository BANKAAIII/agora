"use client"

import React from 'react'
import { noBorderButtonInterface } from '../utils/noBorderButtonInterface'
import {motion} from "framer-motion"

const NoBorderButton = ({label,onClick,className,initial,animate,transition} : noBorderButtonInterface ) => {
  return <motion.div className={`text-[#000000] dark:text-[#F3F3F3] group relative cursor-pointer flex text-[15px] sm:text-[20px] md:text-[19px] xl:text-[24px] font-poppins font-extralight italic justify-center items-center w-[150] sm:w-[180px] h-[50] sm:h-[50px] md:w-[169px] md:h-[49px] xl:w-[223px] xl:h-[64] rounded-full ${className}`} initial={initial} animate={animate} transition={transition}>
      {label}
      <span className='hidden md:block absolute bottom-0 
          bg-black  dark:bg-[#F3F3F3] h-[3px]
          w-0 opacity-0
          transition-all duration-300
          group-hover:w-[180px] group-hover:opacity-100' ></span>
    </motion.div>
}

export default NoBorderButton;