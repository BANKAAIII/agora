"use client"

import React from 'react'
import { navBarInterface } from '../utils/NavBarInterface';
import aossie from "../public/aossie.png";
import NightMode from "../public/night-mode.png";
import wallet from "../public/wallet.png";
import Image from 'next/image';
import { useTheme } from '../themeProvider';



const NavBar = ({className,onClick1,onClick2 , open,setOpen}:navBarInterface) => {

  const {toggleTheme} = useTheme();


  return <div className={`flex flex-row items-center justify-between w-full h-[80px] ${className} `} >

      {/* logo */}
      <div className=" pl-[25px] md:pl-[32px]" >
         <Image src={aossie} alt={"loading"} className="w-[40px] h-[40px] sm:h-[50px] sm:w-[50px] md:h-[74px] md:w-[74px] "  />
      </div>

      {/* cotainer : wallet , darkMode */}
      <div className=" pr-[15px] lg:pr-[50px] gap-x-[5px] md:gap-x-[20px] flex flex-row cursor-pointer" >
       <button onClick={ toggleTheme } className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] " >
        <Image src={NightMode} alt={""} className="h-[25px] w-[25px] sm:h-[35px] sm:w-[35px] md:h-[36px] md:w-[36px] " />
       </button>
       <button className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] bg-[#F4F4F4] rounded-[15px]  flex items-center justify-center cursor-pointer" onClick={()=>setOpen(!open)} >
        <Image src={wallet} alt={""} className="h-[25px] w-[25px] md:h-[36px] md:w-[36px] " />
       </button>
      </div>
    </div>
}

export default NavBar;
