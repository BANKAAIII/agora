"use client"

import React from 'react'
import { navBarInterface } from '../utils/NavBarInterface';
import aossie from "../public/aossie.png";
import NightMode from "../public/night-mode.png";
import wallet from "../public/wallet.png";
import Image from 'next/image';
import { useTheme } from '../themeProvider';
import { Toggle } from "./toggle"// <-- shadcn toggle

const NavBar = ({ className, onClick1, onClick2, open, setOpen }: navBarInterface) => {
  const { toggleTheme } = useTheme();

  return (
    <div className={`flex flex-row items-center justify-between w-full h-[80px] ${className} `}>

      {/* logo */}
      <div className="pl-[25px] md:pl-[25px] xl:pl-[32px]">
        <Image
          src={aossie}
          alt="loading"
          className="w-[40px] h-[40px] sm:h-[50px] sm:w-[50px] xl:h-[74px] xl:w-[74px]"
        />
      </div>

      {/* container : wallet , darkMode */}
      <div className="pr-[15px] md:pr-[30px] lg:pr-[50px] gap-x-[5px] md:gap-x-[20px] flex flex-row">

        {/* 🔥 shadcn toggle for theme */}
        <Toggle
          onClick={toggleTheme}
          className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] xl:w-[60px] xl:h-[60px] flex items-center justify-center"
        >
          <Image
            src={NightMode}
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
            src={wallet}
            alt="wallet"
            className=" w-[25px] md:h-[25px] md:w-[25px] xl:h-[36px] xl:w-[36px]"
          />
        </button>
      </div>
    </div>
  )
}

export default NavBar;
