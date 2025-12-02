import React from 'react'
import { noBorderButtonInterface } from '../utils/noBorderButtonInterface'

const NoBorderButton = ({label,onClick,className} : noBorderButtonInterface ) => {
  return <div className={`group relative cursor-pointer flex text-[24px] font-poppins font-extralight italic justify-center items-center w-[223px] h-[64] rounded-full ${className}`}>
      {label}
      <span className='absolute bottom-0 
          bg-black h-[3px]
          w-0 opacity-0
          transition-all duration-300
          group-hover:w-[180px] group-hover:opacity-100' ></span>
    </div>
}

export default NoBorderButton;
