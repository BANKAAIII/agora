import React from 'react'
import { miniCardsInterface } from '../utils/miniCArds'
import BorderButton from './BorderButton'
import { hover } from 'framer-motion'

const MiniCards = ({width,height,title,description,hoverStatus}:miniCardsInterface) => {
  return (
    <div className={`flex flex-col ${hoverStatus? "w-[35%]" :"w-[15%]" }  hover:transition-all hover:duration-75 h-full rounded-[10px] bg-[#fff6cc] flex`}>
     {/* parent container 1 */}
     <div className="flex flex-row w-full h-full items-center  justify-start " >
       <div className={` font-poppins text-[18px] font-normal italic rotate-270`}>{title}</div>
     </div>
     {/* parent container 2 */}
     <div className={`flex flex-row  ${hoverStatus? "block" : "hidden"} items-center justify-center ${hoverStatus? "h-[50%]":""} rounded-[10px]`} >
        <div className="flex flex-col items-center  " >
             <button className="w-20 h-7 rounded-full bg-amber-50 " />
             <a className="mt-2 font-poppins text-[14px] font-normal italic" >{description}</a>
        </div>
       
     </div>
    </div>
  )
}

export default MiniCards
