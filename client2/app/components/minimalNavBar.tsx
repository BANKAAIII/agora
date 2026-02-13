"use client"

import React from 'react'
import { navBarInterface } from '../utils/NavBarInterface';
import Image from 'next/image';
import { useTheme } from '../themeProvider';

const MinimalNavBar = ({ className, onClick1, onClick2, open, setOpen,pathName , navMenuOpen , setNavMenuOpen }: navBarInterface) => {
  
  const pathName2 = "http://localhose:3000/dashboard";
  const drawer = pathName2.includes("/dashboard");

  return (
    <div className={`relative z-10 flex flex-row items-center justify-between w-full h-[80px]  dark:bg-[#2c2c2c] ${className} `}>

     {/* left buttons */}
      <div className="flex flex-row items-center justify-center ">

         {/* logo */}
         <div className="flex flex-row pl-[25px] md:pl-[25px] xl:pl-[32px] gap-[19px] items-center justify-center ">
        <Image
          width={80} height={80}
          src={"/aossie.png"}
          alt="loading"
          className="w-[40px] h-[40px] sm:h-[50px] sm:w-[50px] xl:h-[74px] xl:w-[74px]"
        />

        {/* navMenu button */}
        <button 
          className=" w-[60px] h-[60px] shadow-[17px_15px_29px_-14px_rgba(1,1,1,0.5)] rounded-full font-medium text-3xl dark:bg-[#454545]"
          onClick={ ()=>{
            setNavMenuOpen(!navMenuOpen);
            
          } }  >{navMenuOpen? "<":">" }</button>
          </div>
    
      </div>
      

     
    </div>
  )
}

export default MinimalNavBar;