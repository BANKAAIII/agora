"use client"
import React from 'react'
import {easeIn, motion} from "framer-motion";
import Image from 'next/image';

const WalletConnect = () => {
  return (
    <div className="hidden md:block" >
    <motion.div 
    initial={{ opacity:0}}
    animate={{ opacity:1}}
    transition={{duration:1.2,ease:easeIn}}
    className=" flex flex-col items-center justify-center p-10">
      {/* Title */}
      <div className="flex w-full">
        <div className=" font-OpenSans font-bold italic flex gap-x-6 flex-row items-center justify-center 
                               text-[#ffffff] 
                               md:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] " >
                               
                                                                    <Image
                                    src="/walletConnect.jpeg"
                                    alt="WalletConnect"
                                    width={100}
                                    height={100}
                                    className=" xl:w-[70px] aspect-square rounded-2xl"
                                    />

                                <a>Wallet Connect</a>
                                </div>
      </div>
      
      {/* Para 1 */}
      <div className="flex w-full flex-col" >
        {/* title  Connect securely using your preferred mobile or desktop wallet.
A universal, decentralized bridge with no accounts or extensions required. */}
        <a className="font-OpenSans lg:text-[30px] md:text-[25px] xl:text-[40px] italic text-[#ffffff]
                       md:mt-[55px]  lg:mt-[63px] xl:mt-[87px] " >Connect securely using your preferred mobile or desktop wallet.</a>
        <a className="font-OpenSans md:mt-[16px] lg:mt-[20px] xl:text-[24px] italic text-[#ffffff]
                      xl:mt-[8px]" >A universal, decentralized bridge with no accounts or extensions required.</a>
      </div>
      {/* Para 2 */}
      <div className="flex w-full flex-row" >
        {/* title */}
        <a className="font-OpenSans g:text-[30px] md:text-[21px] xl:text-[32px] italic text-[#ffffff]
                       md:mt-[55px]  lg:mt-[63px] xl:mt-[87px]" >Get started by scanning the QR code with your wallet.</a>
      </div>

      {/* Button1 */}
      {/* Button 2 */}
    </motion.div>
    </div>
  )
}

export default WalletConnect;
