import React from 'react'
import Image from 'next/image';
import githubDark from "../public/githubDark.png";
import emailDark from "../public/imageDark.png";
import xDark from "../public/xDark.png"
import discordDark from "../public/discordDark.png";

const Footer = () => {
  return (
    <div className="w-full h-[250px] grid grid-cols-3 " >
        {/* Contact Us */}
      <div className="flex flex-col items-center justify-center  " >
        <div className="flex justify-start  font-inter font-bold text-[32px]" >Contact Us.</div>
        <div className="font-poppins font-light text-[16px]"> Agora-Blockchain © 2025 — Open Source.<br/> Transparent. Secure.</div>
      </div>
      {/* rights */}
      <div className="flex items-center justify-center font-poppins font-bold text-[16px] text-[#736E58]">© 2016-2025 AOSSIE. All rights reserved.</div>
      {/* social Media Handles */}
      <div className="flex items-center justify-end gap-6 mr-[32px]" >
        {/* Github */}
        <a href="https://github.com/BANKAAIII" target='blank'><Image src={githubDark} alt="loading" width={70} height={70}/></a>
        {/* Email Dark */}   
        <a href="https://gmail.com/ameyawarang203@gmail.com" target='blank'><Image src={emailDark} alt="loading" width={70} height={70}/></a>
        {/* x */}
        <a href="https://x.com/ammmeya" target='blank'><Image src={xDark} alt="loading" width={70} height={70}/></a>
        {/* discord */}
        <a href="https://x.com/ammmeya" target='blank'><Image src={discordDark} alt="loading" width={70} height={70}/></a>
      </div>
    </div>
  )
}

export default Footer;
  