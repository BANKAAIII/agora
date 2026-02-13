import React, { useState } from 'react'
import { miniCardsInterface } from '../utils/miniCArds'
import BorderButton from './BorderButton'
import { hover } from 'framer-motion'
import { useRouter } from 'next/navigation'


const MiniCards = ({title,description,status}:miniCardsInterface) => {
  const [open,setOpen] = useState(false)
  const router = useRouter();
  return (
    <div 
    className={`flex flex-col ${open? "w-[35%]" :"w-[15%]" } duration-600 hover:transition-all hover:duration-75 h-full rounded-[10px] bg-[#fff6cc] flex`}
    onMouseEnter={()=>{
      setOpen(true);
    }}
    onMouseLeave={()=>{
      setOpen(false);
    }}
    >
     {/* parent container 1 */}
     <div className="flex flex-row w-full h-full items-center  justify-start " >
       <div className={` font-poppins text-[18px] font-normal italic rotate-270`}>{title}</div>
     </div>
     {/* parent container 2 */}
     <div className={`flex flex-row  ${open? `block` : `hidden`} items-center justify-center ${open? "h-[50%]":""} rounded-[10px]`} >
        
        <div className="flex flex-col items-center  " >
             <button className={`w-20 h-7 rounded-full ${status ? "bg-green-500" : "bg-red-500"} hover:scale-[1.1] transition-all `} onClick={()=>{
                router.push('/electionPage');
             }} >Status</button>
             <a className="mt-2 font-poppins text-[14px] font-normal italic" >{description}</a>
        </div>
       
     </div>
    </div>
  )
}

export default MiniCards
