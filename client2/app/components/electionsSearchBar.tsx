import React, { Dispatch, SetStateAction } from 'react'

interface electionsSearchBarInterface{
  setParticipatedFilter: Dispatch<SetStateAction<boolean>>
  participated:boolean;
  status:boolean;
  setStatusFilter: Dispatch<SetStateAction<boolean>>;
  name?:string;
}

const ElectionsSearchBar = ({setParticipatedFilter ,participated,status, setStatusFilter ,name}:electionsSearchBarInterface) => {
  return (
    <div className=" flex flex-row w-full md:h-[100px] items-center gap-[20px] mb-[60px]">
        {/* search bar */}
      <div className="flex w-[40%] h-[60px] rounded-full bg-[#d9d9d9]/60 items-center justify-center p-4  " >
      <input className="flex flex-row w-full h-full outline-none inset-0 border-transparent p-2 font-poppins text-xl" />
      </div>
      {/* participated filter */}
      <button 
      onClick={()=>setParticipatedFilter(!participated)}
      className={`flex items-center justify-center w-[200px] h-[55px] rounded-full ${participated? 'bg-green-500/60': 'bg-[#d9d9d9]/60'}  font-poppins text-[19.91px] cursor-pointer`} >Participated</button>
      {/* status filter */}
      <button 
      onClick={()=>setStatusFilter(!status)}
      className={`flex items-center justify-center w-[150px] h-[55px] rounded-full ${status?  'bg-teal-500/60' :'bg-[#d9d9d9]/60'} font-poppins text-[19.91px] cursor-pointer `} > status</button>
    </div>
  )
}

export default ElectionsSearchBar
