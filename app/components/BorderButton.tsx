"use client"

import React from 'react'
import { noBorderButtonInterface } from '../utils/noBorderButtonInterface'

const BorderButton = ({label,onClick,className}:noBorderButtonInterface) => {
  return <div className={`cursor-pointer ${className} flex text-[20px] md:text-[24px] font-poppins font-extralight italic items-center justify-center w-[180px] h-[50px] md:w-[224px] md:h-[66px] rounded-full bg-[#F2F2F2] shadow-[17px_15px_29px_-14px_rgba(0,0,0,0.29)] `} >
      {label}
    </div>
}

export default BorderButton
