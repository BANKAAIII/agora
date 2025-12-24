"use client"

import React from 'react'
import { noBorderButtonInterface } from '../utils/noBorderButtonInterface';

const BorderButton = ({label,onClick,className}:noBorderButtonInterface) => {
  return <div className={`cursor-pointer ${className} flex text-[15px] sm:text-[20px] md:text-[19px] xl:text-[24px] font-poppins font-extralight italic items-center justify-center w-[150px] h-[40px] sm:w-[180px] sm:h-[50px] md:w-[169px] md:h-[49px] xl:w-[224px] xl:h-[66px] rounded-full bg-[#F2F2F2] shadow-[17px_15px_29px_-14px_rgba(0,0,0,0.29)] `} onClick={onClick} >
      {label}
    </div>
}

export default BorderButton