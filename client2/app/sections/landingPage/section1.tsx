"use client"

import React from 'react'
import NavBar from '@/app/components/NavBar'
import BorderButton from '@/app/components/BorderButton'
import NoBorderButton from '@/app/components/noBorderButton'
import {delay, easeIn, easeOut, motion, scale} from "framer-motion";
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Introduction from '../walletsSections/introduction'
import { useRouter } from 'next/navigation';
import { CLIENT_LINKS } from '@/config/clientLinks';
import{ useScrollStore} from '@/app/zustandStore/landingPageStores'
import Rainbow from '../walletsSections/rainbow'
import Coinbase from '../walletsSections/coinbase'
import Metamask from '../walletsSections/metamask'
import WalletConnect from '../walletsSections/walletconnect'
import {useEffect} from 'react';

type Section1Props = {
  scrollToSection:() => void;
}

// learnMore button animation variants
const learnMoreVariants = {
  initial: {
    opacity: 0,
    y: 40,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: easeIn,
    },
  },
  exit: {
    opacity: 0,
    y: -100,
   
    transition: {
      delay:0.3,
      duration: 0.3,
      ease: easeOut,
    },
  },
};



const outer = {
  initial:{opacity:0},
  show : {opacity:1 , transition :{ staggerChildren:0.3  , ease:easeOut }}
}

const group ={
  initial : {opacity:0},
  show :{ opacity:1 , transition:{ staggerChildren : 0.08 } }
}

const item = { initial: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const Section1 = ( { scrollToSection }: Section1Props ) => {
  const router = useRouter();

const [animateDiv,setAnimateDiv] = useState(0);
const [showLearnMore, setShowLearnMore] = useState(false);


function hoveringDiv(){
    
    setShowLearnMore(true);
}

const [activeOption,setActiveOption] =useState("Rainbow");
 const [ walletMiniPage, setWalletMiniPage ] = useState< "rainbow" | "coinBase" | "metaMask" | "walletConnect" | null >(null);

  const [open,setOpen] = useState(false);

useEffect(() => {
  if (!showLearnMore) return;

  const timer = setTimeout(() => {
    setShowLearnMore(false);
  }, 2500); // visible duration

  return () => clearTimeout(timer);
}, [showLearnMore]);



  return <div  className="relative z-10 bg-[#ffffff] dark:bg-[#2C2C2C] flex flex-col w-full min-h-screen ">      
          
          <NavBar className={"mt-[24px]"} open={open} setOpen={setOpen} />

          <AnimatePresence>
           {
            open && (
             <motion.div key="wallet-panel"
              initial={{ y: "-100%", opacity: 0 }}   // starting: above + invisible
              animate={{ y: "0%", opacity: 1 }}     // slide down + fade in
              exit={{ y: "-100%", opacity: 0 }}      // slide up + fade out
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="fixed top-0 left-0 w-full h-screen bg-[#666666] z-50 shadow-xl">
                        
                        <div className={`flex flex-row items-center justify-between w-full h-[80px] mt-[24px]  pr-[32px] `}>
                           <div className="pl-[25px] md:pl-[32px]" >
                              <Image width={74} height={74} src={"/aossie.png"} alt={"loading"} className="w-[40px] h-[40px] sm:h-[60px] sm:w-[60px] md:h-[74px] md:w-[74px] " />
                            </div>
                            <div className="flex flex-row items-center justify-center" >
                              
                              <button
                                    className="  h-[25px] w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] xl:w-[60px] xl:h-[60px] bg-[#F4F4F4]  rounded-[15px] flex items-center justify-center"
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
                        {/* main container */}
                        <div className="w-full h-[811px] grid grid-cols-[1fr_4fr]" >
                          <div className="">

                           {/* Menu */}
                           <div className="flex flex-col items-center justify-start mt-[51px] pl-[62px]" >
                            {/* title */}
                            <div className="w-full items-start justify-start" ><h1 className="font-poppins text-[24px] sm:text-[36px] md:text-[48px] italic  text-[#ffffff]" >Wallets :</h1></div>
                            {/* Options */}
                            <motion.div className="mt-[30px] w-full items-start justify-start font-poppins text-[16px] md:text-[24px] font-light italic text-[#ffffff] "
                                        initial={{opacity:0,y:20}} 
                                        animate={{opacity:1,y:0}}
                                        transition={{duration:0.4,ease:"easeIn",delay:0.6}}>
                              
                              
                              {/* Rainbow miniPage */}
                              <div className="mt-[20px]" 
                                   onMouseEnter={ ()=>{
                                  setWalletMiniPage("rainbow");
                                  } }
                              >
                                <a>Rainbow</a>
                                <motion.div 
                                initial={{width:100}}
                                animate={{width:250}}
                                transition={{duration:0.4,delay:0.6}}
                                className="w-[394px] h-[2px] mt-[6px] bg-[#ffffff]"
                                />
                                
                              </div>


                                {/* coinBase miniPage */}
                              <div className="mt-[20px]" 
                                  onMouseEnter={ ()=>{
                                  setWalletMiniPage("coinBase");
                                  
                                } }>
                                <a >CoinBase</a>
                                <motion.div 
                                initial={{width:100}}
                                animate={{width:250}}
                                transition={{duration:0.4,delay:0.64}}
                                className="w-[394px] h-[2px] mt-[6px] bg-[#ffffff]"
                                 />
                              </div>

                                {/* metaMask miniPage */}
                              <div className="mt-[20px]"  
                                  onMouseEnter={ ()=>{
                                    setWalletMiniPage("metaMask");
                                    
                                  } } >
                                  <a>MetaMask</a>
                                  <motion.div initial={{width:100}}
                                  animate={{width:250}}
                                  transition={{duration:0.4,delay:0.64}}
                                  className="w-[394px] h-[2px] mt-[6px] bg-[#ffffff]" />
                              </div>

                              <div className="mt-[20px]"
                                 onMouseEnter={ ()=>{
                                  setWalletMiniPage("walletConnect");
                                } } >
                                <a>WalletConnect</a>
                                <motion.div 
                                initial={{width:100}}
                                animate={{width:250}}
                                transition={{duration:0.4,delay:0.74}}
                                className="w-[394px] h-[2px] mt-[6px] bg-[#ffffff]"
                                />
                              </div>

                            </motion.div>
                            
                           </div>

                          </div>

                          {/* Wallet Connection */}
                          <div className=' flex flex-col w-full h-full items-center justify-center ' >
                            { walletMiniPage === null && <Introduction/> }
                            { walletMiniPage === "rainbow" && <div className="flex w-full h-full p-10" > <Rainbow/> </div> }
                            { walletMiniPage === "coinBase" && <div className="flex w-full h-full p-10" > <Coinbase/> </div> }
                            { walletMiniPage === "metaMask" && <div className="flex w-full h-full p-10" > <Metamask/> </div> }
                            { walletMiniPage === "walletConnect" && <div className="flex w-full h-full p-10" > <WalletConnect/> </div> }
                          </div>
                        </div>

             </motion.div>
                )
           }
            </AnimatePresence>

            {/* parent container */} {/* outermost container for animation "Outer" */}
            <div className="grid grid-cols-[5fr_3fr] w-full " >
             <motion.div className="  flex flex-col
                                 pl-[25px] md:pl-[30px] xl:pl-[62px] mt-[150px] md:mt-[130px] xl:mt-[168px] "
                      variants={outer} initial="initial" animate="show" >

            {/* Line 1 */}
            <motion.div className="flex flex-row gap-2 sm:gap-4" variants={group} >
             <motion.div  className="text-[#000000] dark:text-[#F3F3F3]/80 text-[25px] md:text-[50px] xl:text-[80px] font-poppins font-light tracking-tight" variants={item}  >Welcome</motion.div>
             <motion.div  className="text-[#000000] dark:text-[#F3F3F3]/80 text-[25px] md:text-[50px] xl:text-[80px] font-poppins  font-light tracking-tight" variants={item} >to</motion.div>
            </motion.div>

            {/* Line 2 */}
            <motion.div className=" flex flex-row items-baseline gap-2 sm:mt-1 lg:-mt-2  " 
                        variants={group} >

             <motion.div className="text-[30px] sm:text-[50px] md:text-[67px] xl:text-[88px] 
                                    font-poppins font-semibold italic text-[#000000] dark:text-[#F3F3F3]
                                    sm:mt-[-18px] " variants={item}  >Agora</motion.div> 

             <motion.div className="text-[30px] sm:text-[50px] md:text-[67px] xl:text-[88px] 
                                    font-poppins font-semibold italic  text-[#000000] dark:text-[#F3F3F3]
                                    sm:mt-[-18px] " variants={item}  >BlockChain</motion.div>
                                    
             <motion.div className="w-[10px] h-[10px] md:w-[19px] md:h-[19px] xl:h-[25px] xl:w-[25px] 
                                    rounded-full bg-TitleDot" variants={item} />

            </motion.div>

            {/* Line 3 */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1, ease:easeIn}} className=" text-[12px] sm:text-[20px] md:text-[19px] xl:text-[24px] font-poppins font-extralight italic text-[#000000] dark:text-[#F3F3F3]/88" >With blockchain as its foundation,<br/> Agora ensures that every voice is heard and every vote counts</motion.div>
            
            
          </motion.div>
          <div className="flex w-full  items-center justify-center" >
          <AnimatePresence>
  {showLearnMore && (
    <motion.div
      variants={learnMoreVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex w-[70%] h-[70%] mt-[40%] bg-[#D9D9D9]/35 shadow-2xl rounded-[40px]"
    >
      <p className="p-6 flex items-center justify-center flex-col">
        <a className="font-poppins text-3xl italic font-medium" >Agora BlockChain gurantees :<br/></a>
        <p className=" font-poppins text-xl font-normal mt-3">
          <a>1. Transperency</a><br/>
          <a>2. Decentralised Governance</a><br/>
          <a>3. Verifiable Results</a><br/>
        </p>
        </p>
    </motion.div>
  )}
</AnimatePresence>

          </div>
          </div>
         

          <motion.div className=" flex w-full h-[66px] mt-[100px] sm:mt-[180px] md:mt-[200px] justify-center md:justify-end items-center "  >
              {/*subContainer*/}
              <div className="flex flex-row pb-20 md:pr-[100px] lg:pr-[156px]" >
                 <NoBorderButton onClick={hoveringDiv} label={"Learn more"} className={""} />
                 <BorderButton onClick={()=>window.location.href = CLIENT_LINKS.APP_ROOT} label={"Get Started >"} className={" md:hover:scale-[1.1] md:duration-75 md:transition-all"} />
              </div>
         
          </motion.div>
          
     

    </div>
}

export default Section1