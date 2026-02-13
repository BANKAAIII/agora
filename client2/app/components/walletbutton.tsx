"use client"
import React from 'react'
import { walletCardInterface } from '../utils/walletCardInterface'
import Image from 'next/image'


const Walletbutton = ({ name , onClick} :walletCardInterface) => {
    let walletcolor = ""
    name === "phantom"? walletcolor = "bg-[#ab9ff2]" : name === "metaMask"? walletcolor = "bg-[#F48700]" : name === "CoinBase"? walletcolor= "bg-[#004FF6]": name === "walletConnect"? walletcolor="bg-[#419CFC]" : walletcolor= "null"

  return <div className='w-[275px] h-[90px] rounded-full bg-[#fff6cc] flex flex-row items-center justify-center gap-4 m-2'>
        {/* wallet color */}
        <div className={`w-[22px] h-[22px] rounded-full ${walletcolor}`} ></div>  
        <a className="font-poppins text-[22px] font-medium italic " >{name}</a>      
        <button
         onClick={()=>{}} >
            <Image width={80} height={80} src={"/cross.png"} alt={"loading"} className="w-[20px] h-[20px] hover:scale-[1.1]" />
        </button>
    </div>
}

export default Walletbutton
