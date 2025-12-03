"use client"

import React from 'react'
import NavBar from '@/app/components/NavBar'
import BorderButton from '@/app/components/BorderButton'
import NoBorderButton from '@/app/components/noBorderButton'
import {easeIn, easeOut, motion} from "framer-motion";
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import wallet from "../../public/wallet.png"
import aossie from "../../public/aossie.png";

const outer = {
  initial:{opacity:0},
  show : {opacity:1 , transition :{ staggerChildren:0.3  , ease:easeOut }}
}

const group ={
  initial : {opacity:0},
  show :{ opacity:1 , transition:{ staggerChildren : 0.08 } }
}

const item = { initial: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const Section1 = () => {

const [activeOption,setActiveOption] =useState("Rainbow");


  const [open,setOpen] = useState(false);
  return <div className="relative z-0 flex flex-col w-full min-h-screen ">      
          
          <NavBar className={"mt-[24px]"} open={open} setOpen={setOpen} />

          <AnimatePresence>
           {
            open && (
             <motion.div key="wallet-panel"
              initial={{ y: "-100%", opacity: 0 }}   // starting: above + invisible
              animate={{ y: "0%", opacity: 1 }}     // slide down + fade in
              exit={{ y: "-100%", opacity: 0 }}      // slide up + fade out
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="fixed top-0 left-0 w-full h-screen bg-[#666666] z-40 shadow-xl">
                        
                        <div className={`flex flex-row items-center justify-between w-full h-[80px] mt-[24px]  pr-[50px] `}>
                           <div className=" pl-[32px]" >
                              <Image src={aossie} alt={"loading"} width={74} height={74} />
                            </div>
                          <button className="w-[74px] h-[74px] bg-[#F4F4F4] rounded-[15px]  flex items-center justify-center cursor-pointer" onClick={()=>setOpen(!open)} >
                            <Image src={wallet} alt={""} width={30} height={30} />
                          </button>
                
                        </div>
                        {/* main container */}
                        <div className="w-full h-[811px] grid grid-cols-[1fr_2fr]" >
                          <div className=" ">

                           {/* Menu */}
                           <div className="flex flex-col items-center justify-center mt-[51px] pl-[62px]" >
                            {/* title */}
                            <div className="w-full items-start justify-start" ><h1 className="font-poppins text-[48px] italic  text-[#ffffff]" >Connect Wallet</h1></div>
                            {/* Options */}
                            <motion.div className="mt-[30px] w-full items-start justify-start font-poppins text-[24px] font-light italic text-[#ffffff] "
                                        initial={{opacity:0,y:20}} 
                                        animate={{opacity:1,y:0}}
                                        transition={{duration:0.4,ease:"easeIn",delay:0.6}}>
                              <div className="mt-[20px]">
                                <a>Rainbow</a>
                                <motion.div 
                                initial={{width:100}}
                                animate={{width:394}}
                                transition={{duration:0.4,delay:0.6}}
                                className="w-[394px] h-[2px] mt-[6px] bg-[#ffffff]" />
                              </div>

                              <div className="mt-[20px]" >
                                <a >CoinBase</a>
                                <motion.div 
                                initial={{width:100}}
                                animate={{width:394}}
                                transition={{duration:0.4,delay:0.64}}
                                className="w-[394px] h-[2px] mt-[6px] bg-[#ffffff]"
                                 />
                              </div>

                              <div className="mt-[20px]" >
                                <a>MetaMask</a>
                                <motion.div initial={{width:100}}
                                animate={{width:394}}
                                transition={{duration:0.4,delay:0.64}}
                                className="w-[394px] h-[2px] mt-[6px] bg-[#ffffff]" />
                              </div>

                              <div className="mt-[20px]" >
                                <a>WalletConnect</a>
                                <motion.div 
                                initial={{width:100}}
                                animate={{width:394}}
                                transition={{duration:0.4,delay:0.74}}
                                className="w-[394px] h-[2px] mt-[6px] bg-[#ffffff]" />
                              </div>

                            </motion.div>
                            
                           </div>

                          </div>

                          {/* Wallet Connection */}
                          <div className=' flex flex-col items-center justify-center ' >
                            
                          </div>
                        </div>

             </motion.div>
                )
           }
            </AnimatePresence>

            {/* parent container */} {/* outermost container for animation "Outer" */}
          <motion.div className="  flex flex-col
                                 pl-[25px] md:pl-[62px] mt-[150px] md:mt-[168px] "
                      variants={outer} initial="initial" animate="show" >

            {/* Line 1 */}
            <motion.div className="flex flex-row gap-2 sm:gap-4" variants={group} >
             <motion.div  className="text-[25px] md:text-[80px] font-poppins font-light tracking-tight" variants={item}  >Welcome</motion.div>
             <motion.div  className="text-[25px] md:text-[80px] font-poppins  font-light tracking-tight" variants={item} >to</motion.div>
            </motion.div>

            {/* Line 2 */}
            <motion.div className=" flex flex-row items-baseline gap-2 sm:mt-1 lg:-mt-2  " 
                        variants={group} >
             <motion.div className="text-[30px] sm:text-[50px]  md:text-[88px] font-poppins font-semibold italic sm:mt-[-18px] " variants={item}  >Agora</motion.div> 
             <motion.div className="text-[30px] sm:text-[50px] md:text-[88px] font-poppins font-semibold italic  sm:mt-[-18px] " variants={item}  >BlockChain</motion.div>
             <motion.div className="w-[10px] h-[10px] md:h-[25px] md:w-[25px] rounded-full bg-TitleDot" variants={item} />
            </motion.div>

            {/* Line 3 */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1, ease:easeIn}} className=" text-[12px] sm:text-[20px] md:text-[24px] font-poppins font-extralight italic" >With blockchain as its foundation,<br/> Agora ensures that every voice is heard and every vote counts</motion.div>
            
            
          </motion.div>

          <motion.div className="flex w-full h-[66px] mt-[140px] sm:mt-[180px] md:mt-[200px] justify-center md:justify-end items-center "  >
              {/*subContainer*/}
              <div className="flex flex-row  md:pr-[156px]" >
                 <NoBorderButton onClick={()=>{}} label={"Learn more"} className={""} />
                 <BorderButton onClick={()=>{}} label={"Get Started >"} className={" md:hover:scale-[1.1] md:duration-75 md:transition-all"} />
              </div>
         
          </motion.div>
          
     

    </div>
}

export default Section1
