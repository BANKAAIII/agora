"use client"

import React, { useEffect } from 'react'
import { navBarInterface } from '../utils/NavBarInterface';
import wallet from "../public/wallet.png";
import Image from 'next/image';
import { useTheme } from '../themeProvider';
import { Toggle } from "./toggle"// <-- shadcn toggle
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

const NavBar = ({ className, onClick1, onClick2, open, setOpen,pathName }: navBarInterface) => {
  const { toggleTheme } = useTheme();

    
   const pathName2="http://localhost:3000/dashboard"
    
  const drawer = pathName2.includes("/dashboard");
  

  return (
    <div className={`relative z-10 flex flex-row items-center justify-between w-full h-[80px] ${className} `}>

     {/* left buttons */}
      <div className="flex items-center justify-center">
         {/* logo */}
         <div className="pl-[25px] md:pl-[25px] xl:pl-[32px] ">
        <Image
          src={"/aossie.png"}
          width={76} height={76}
      
          alt="loading"
          className="w-[40px] h-[40px] sm:h-[50px] sm:w-[50px] xl:h-[74px] xl:w-[74px]"
        />
      </div>
    
      </div>
      

      {/* container : wallet , darkMode */}
      <div></div>
      <div className="pr-[15px] md:pr-[25px] lg:pr-[32px] gap-x-[5px] md:gap-x-[20px] flex flex-row">

        {/* 🔥 shadcn toggle for theme */}
        <Toggle
          onClick={toggleTheme}
          className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] xl:w-[60px] xl:h-[60px] flex items-center justify-center"
        >
          <Image
          width={20} height={20}
            src={"/night-mode.png"}
            alt="dark mode"
            className="dark:invert  h-[25px] w-[25px] sm:h-[35px] sm:w-[35px] md:w-[30px] md:h-[30px] xl:h-[36px] xl:w-[36px]"
          />
        </Toggle>

        {/* wallet button */}
        <button
          className="h-[25px] w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] xl:w-[60px] xl:h-[60px] bg-[#F4F4F4]  rounded-[15px] flex items-center justify-center"
          onClick={() => setOpen(!open)}
        >
          <Image
          width={20} height={20}
            src={"/wallet.png"}
            alt="wallet"
            className=" w-[25px] md:h-[25px] md:w-[25px] xl:h-[36px] xl:w-[36px]"
          />
        </button>
      </div>
    </div>
  )
}

export default NavBar;
