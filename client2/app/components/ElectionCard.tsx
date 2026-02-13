import React from 'react'
import { electionCardInterface } from '../utils/electionCard'
import { useRouter } from 'next/navigation';


const ElectionCard = ({title,description,pinned,bookmarked,status,participated}:electionCardInterface) => {
  const router = useRouter();
  return (
    <div className="grid grid-cols-[60%_40%] w-[500px] h-[120px] rounded-[8px] bg-[#FFF6CC] dark:bg-[#adadad]/25 dark:text-[#f8f8f8] hover:shadow-[5px_5px_4px_0px_rgba(0,0,0,0.25)] dark:hover:shadow-TitleDot " >
      <div className="flex flex-row" >
      {/* hardcoding for now */}
      <a className="mt-[5%] ml-[10%] text-[24px] font-poppins italic font-regular" >{title}</a>
      </div>
      <div className="flex items-center justify-center gap-4" >
        <button 
        onClick={()=>{
          {/* on every election we send a metadata packet copy to computer to generate a page and update from vote from the page to backend */}
          router.push('/electionPage');
        }}
        className="flex w-[50%] h-[40%] bg-[#f2f2f2] text-black font-poppins text-xl italic dark:bg-[#] rounded-[100px] items-center justify-center hover:scale-[1.1] shadow-[5px_5px_4px_0px_rgba(0,0,0,0.25)]" >Vote</button>
        <div className={`flex h-[30%] aspect-square rounded-full p-2 ${status === 'ongoing'? "bg-green-500/90": status === 'completed'? 'bg-red-500/90':"bg-TitleDot"} `} ></div>
      </div>
      
    </div>
  )
}

export default ElectionCard
