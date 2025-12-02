import React from 'react'
import { navBarInterface } from '../utils/NavBarInterface';
import aossie from "../public/aossie.png";
import NightMode from "../public/night-mode.png";
import wallet from "../public/wallet.png";
import Image from 'next/image';


const NavBar = ({className,onClick1,onClick2}:navBarInterface) => {
  return <div className={`flex flex-row items-center justify-between w-full h-[80px] ${className} `} >
      <div className="container ml-[32px]" >
         <Image src={aossie} alt={"loading"} width={74} height={74} />
      </div>
      <div className="mr-[50px] gap-x-[20px] flex flex-row cursor-pointer" >
       <button onClick={()=>{  }} className="w-[74px] h-[74px] " >
        <Image src={NightMode} alt={""} width={36} height={36} />
       </button>
       <button className="w-[74px] h-[74px] bg-[#F4F4F4] rounded-[15px] flex items-center justify-center cursor-pointer" >
        <Image src={wallet} alt={""} width={30} height={30} />
       </button>
      </div>
    </div>
}

export default NavBar;
