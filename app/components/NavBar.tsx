"use client"

import React from 'react'
import { navBarInterface } from '../utils/NavBarInterface';
import aossie from "../public/aossie.png";
import NightMode from "../public/night-mode.png";
import wallet from "../public/wallet.png";
import Image from 'next/image';


const NavBar = ({className,onClick1,onClick2 , open,setOpen}:navBarInterface) => {

  

  return <div className={`flex flex-row items-center justify-between w-full h-[80px] ${className} `} >

      {/* logo */}
      <div className=" sm:pl-[25px] md:pl-[32px]" >
         <Image src={aossie} alt={"loading"} className="sm:h-[60px] sm:w-[60px] md:h-[74px] md:w-[74px] "  />
      </div>

      {/* cotainer : wallet , darkMode */}
      <div className=" sm:pr-[25px] lg:pr-[50px] sm:gap-x-[5px] md:gap-x-[20px] flex flex-row cursor-pointer" >
       <button onClick={()=>{  }} className="w-[74px] h-[74px] " >
        <Image src={NightMode} alt={""} className="sm:h-[35px] sm:w-[35px] md:h-[36px] md:w-[36px] " />
       </button>
       <button className="w-[74px] h-[74px] bg-[#F4F4F4] rounded-[15px]  flex items-center justify-center cursor-pointer" onClick={()=>setOpen(!open)} >
        <Image src={wallet} alt={""} className="sm:h-[30px] sm:w-[30px] md:h-[36px] md:w-[36px] " />
       </button>
      </div>
    </div>
}

export default NavBar;
