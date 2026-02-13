"use client"

import React from 'react'
import { navBarInterface } from '../utils/NavBarInterface';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useNotificationToggle } from '../zustandStore/dashboardStore';

const NavBar2 = ({ className, open, setOpen, navMenuOpen , setNavMenuOpen ,button2ClassName,button2State,setButton2State,button2Img,button3ClassName,searchOpen,setSearchOpen }: navBarInterface) => {
  
  const toggleOn = useNotificationToggle( (state)=> state.toggleOn )
  const toggleOff = useNotificationToggle( (state)=> state.toggleOff )

  

  return (
    <div className={`relative z-40 flex flex-row items-center justify-between w-full h-[80px]  dark:bg-[#2c2c2c] ${className} `}>

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
          className={`w-[60px] h-[60px] shadow-[17px_15px_29px_-14px_rgba(1,1,1,0.5)] rounded-full font-medium text-3xl dark:bg-[#454545] ${button3ClassName}`}
          onClick={ ()=>{
            setNavMenuOpen(!navMenuOpen);
            
          } }  >{navMenuOpen? "<":">" }</button>
          </div>
    
      </div>
      

      {/* container : wallet , darkMode */}
      
      <div className="pr-[15px] md:pr-[25px] lg:pr-[32px] gap-x-[5px] md:gap-x-[20px] flex flex-row items-center justify-center">
       
       <div className="flex relative z-10 flex-wrap">
       <button
          className="h-[25px] w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] xl:w-[60px] xl:h-[60px] bg-[#F4F4F4] dark:bg-[#454545] rounded-[15px] flex items-center justify-center"
          onClick={() => setOpen(!open)}
        >
          {/* notificaiton */}
          
          <Image
            width={80} height={80}
            src={"/notification.png"}
            alt="wallet"
            className={`relative z-10 w-[25px] md:h-[25px] md:w-[25px] xl:h-[36px] xl:w-[36px]`}
          />
          
          <div className="absolute z-20 top-2 right-2  w-[15px] h-[15px] rounded-full bg-red-600" ></div>
          
        </button>
        </div>

        {/* wallet button */}
        <motion.button
          className={` h-[25px] w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] xl:w-[60px] xl:h-[60px] bg-[#F4F4F4]  dark:bg-[#454545] rounded-[15px] flex items-center justify-center ${button2ClassName}`}
          onClick={() => 
            
            setButton2State(!button2State)
          }
        >
          <Image
            src={button2Img}
            width={80} height={80}
            
            alt="wallet"
            className=" w-[25px] md:h-[25px] md:w-[25px] xl:h-[28px] xl:w-[28px]"
             
          />
        </motion.button>
      </div>
    </div>
  )
}

export default NavBar2;