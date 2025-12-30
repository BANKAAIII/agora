"use client"

import React, { useEffect, useState } from 'react'
import NavBar2 from '../components/navbar2'
import { usePathname } from 'next/navigation'
import WalletsCard from '../components/walletsCard';
import { walletCardInterface } from '../utils/walletCardInterface';
import HostedElections from '../components/hostedElections';
import HostedElections2 from '../components/hostedElections2';



const page = ({walletColor , name , onClick}:walletCardInterface) => {
   let pathName="";
   const [hover,setHover] = useState(false);
    
  function setHoverState(setHover:any){
    onmouseenter:setHover(true);
    onmouseleave:setHover(false);
  }

  return (
    <div className="flex flex-col items-center justify-center " >
      {/* Navbar */} 
      <div className="flex w-full items-center justify-center" >
        <NavBar2 className="mt-[24px]" pathName={pathName}/>
      </div>
      {/* page parent container */}
      <div className="flex flex-col w-full h-full items-center justify-center p-[50px] " >
        <div className="flex w-full h-full flex-row items-center gap-8">
          {/* sub parent 1 */}
          <div className="flex">
            <WalletsCard walletColor={"bg-[#ab9ff2]"} name={"name"} onClick={onClick}  />
          </div>
          {/*sub parent 2 */}
          <div className="flex flex-col gap-8 ">
              <div className="flex flex-row gap-8" >
                 <HostedElections title="title" description={`Click to go to Elections you created`} width={"w-[900px]"} height={"h-[350px]"} onClick={()=>setHoverState(hover) } />
            <HostedElections title="title" description={`Click to go to Elections you created`} width={"w-[500px]"} height={"h-[350px]"} onClick={()=>{}} />
              </div>
              <div>
                <HostedElections2 title="title" description={`Click to go to Elections you created`} width={"w-[1430px]"} height={"h-[350px]"} onClick={()=>{}} />
      </div>
       
              </div>
            </div> 
        
       
            
      </div>
    </div>
  )
}

export default page
