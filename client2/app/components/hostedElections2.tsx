import React, { useState } from 'react'
import { hostedElectionInterface } from '../utils/hostedElectionInterface'
import MiniCards from './miniCards';

const HostedElections2 = ({width,height,title,description}:hostedElectionInterface) => {


  return <div className={`${width} ${height} bg-[#d9d9d9]/60 rounded-[25px] flex flex-row  items-center justify-between pr-[24px] `} >
     {/* part 1 */}
     <div className="flex w-full h-full rounded-[25px] items-start p-[24px] justify-between flex-col" >
        <a className=" w-[300px] font-poppins font-normal italic text-[16px] ">{description}</a>
        <a className="font-poppins font-bold italic text-[40px]" >Hosted Election's</a>
     </div>
     {/* part 2 */}
     <div className="flex  w-full h-full rounded-[25px] items-center justify-end" >
        {/* container div */}
        <div className="flex w-[90%] h-[85%]  justify-end gap-x-[9px]" >
         <MiniCards title="title 1" description="description 1" status={false} hoverStatus={true}/>
         <MiniCards title="title 2" description="description 2" status={false} hoverStatus={false}/>
         <MiniCards title="title 3" description="description 3" status={false} hoverStatus={false}/>
        </div>
     </div>
    
    </div>
}

export default HostedElections2;
