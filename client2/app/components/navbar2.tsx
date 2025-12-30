"use client"

import React from 'react'
import { navBarInterface } from '../utils/NavBarInterface';
import aossie from "../public/aossie.png";
import NightMode from "../public/night-mode.png";
import wallet from "../public/wallet.png";
import Image from 'next/image';
import { useTheme } from '../themeProvider';
import searchLogo from "../public/search.png";

const NavBar2 = ({ className, onClick1, onClick2, open, setOpen,pathName }: navBarInterface) => {
  const { toggleTheme } = useTheme();
  const pathName2 = "http://localhose:3000/dashboard";
  const drawer = pathName2.includes("/dashboard");

  return (
    <div className={`relative z-10 flex flex-row items-center justify-between w-full h-[80px] ${className} `}>

     {/* left buttons */}
      <div className="flex flex-row items-center justify-center ">
         {/* logo */}
         <div className="flex flex-row pl-[25px] md:pl-[25px] xl:pl-[32px] gap-[19px] items-center justify-center ">
        <Image
          src={aossie}
          alt="loading"
          className="w-[40px] h-[40px] sm:h-[50px] sm:w-[50px] xl:h-[74px] xl:w-[74px]"
        />
        <button className=" w-[60px] h-[60px] shadow-[17px_15px_29px_-14px_rgba(1,1,1,0.5)] rounded-full font-medium bg-[#f2f2f2] text-3xl"  >{">"}</button>
      </div>
    
      </div>
      

      {/* container : wallet , darkMode */}
      
      <div className="pr-[15px] md:pr-[25px] lg:pr-[32px] gap-x-[5px] md:gap-x-[20px] flex flex-row items-center justify-center">
       <div className="flex flex-row items-center justify-end p-4 w-[500px] h-[60px] rounded-full bg-TitleDot/46  " >
        <input className=" flex w-full outline-none p-5 " placeholder='Search '/>
        <Image src={searchLogo} alt="loading" className="invert dark:invert-0 p-0.5  w-[30px] h-[30px] " />
       </div>
       <button
          className="h-[25px] w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] xl:w-[60px] xl:h-[60px] bg-[#F4F4F4]  rounded-[15px] flex items-center justify-center"
          onClick={() => setOpen(!open)}
        >
          <Image
            src={wallet}
            alt="wallet"
            className=" w-[25px] md:h-[25px] md:w-[25px] xl:h-[36px] xl:w-[36px]"
          />
        </button>

        {/* wallet button */}
        <button
          className="h-[25px] w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] xl:w-[60px] xl:h-[60px] bg-[#F4F4F4]  rounded-[15px] flex items-center justify-center"
          onClick={() => setOpen(!open)}
        >
          <Image
            src={wallet}
            alt="wallet"
            className=" w-[25px] md:h-[25px] md:w-[25px] xl:h-[36px] xl:w-[36px]"
          />
        </button>
      </div>
    </div>
  )
}

export default NavBar2;