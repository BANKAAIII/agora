"use client"

import React from 'react'
import Image from 'next/image';
import githubDark from "../public/githubDark.png";
import emailDark from "../public/imageDark.png";
import xDark from "../public/xDark.png"
import discordDark from "../public/discordDark.png";

const Footer = () => {
  const iconsSize : number = 50;
  return (
    <div className="w-full h-[250px] grid grid-row-2 md:grid-cols-3 " >
        {/* Contact Us */}
      <div className="flex flex-col items-center justify-center  " >
        <div className=" flex justify-start  font-inter font-bold sm:text-[24px] md:text-[32px]" >Contact Us.</div>
        <div className="font-poppins font-light sm:text-[14px] md:text-[16px]"> Agora-Blockchain © 2025 — Open Source.<br/> Transparent. Secure.</div>
      </div>
      {/* rights */}
      <div className="flex items-center justify-center font-poppins font-bold text-[16px] text-[#736E58]">© 2016-2025 AOSSIE. All rights reserved.</div>
      {/* social Media Handles */}
      <div className="flex items-center justify-center md:justify-end gap-6 md:mr-[32px] " >
        {/* Github */}
        <a href="https://github.com/BANKAAIII" target='blank'><Image src={githubDark} alt="loading" className=" w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] md:w-[50px] md:h-[50px] "/></a>
        {/* Email Dark */}   
        <a href="https://gmail.com/ameyawarang203@gmail.com" target='blank'><Image src={emailDark} alt="loading" className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] md:w-[50px] md:h-[50px] "/></a>
        {/* x */}
        <a href="https://x.com/ammmeya" target='blank'><Image src={xDark} alt="loading" className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] md:w-[30px] md:h-[50px] "/></a>
        {/* discord */}
        <a href="https://x.com/ammmeya" target='blank'><Image src={discordDark} alt="loading" className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] md:w-[50px] md:h-[50px] "/></a>
      </div>
    </div>
  )
}

export default Footer;
  