"use client"
import React from 'react'
import { walletCardInterface } from '../utils/walletCardInterface'
import Image from 'next/image'
import cross  from "../public/cross.png";

const wallets = [{
    name:"Phantom" , walletColor:"bg-[##ab9ff2]"
},
{
    name: "CoinBase" , walletColor:""
}
]

const Walletbutton = ({walletColor , name , onClick} :walletCardInterface) => {
  return <div className='w-[275px] h-[90px] rounded-full bg-[#fff6cc] flex flex-row items-center justify-center'>
        {/* wallet color */}
        <div className={`w-[22px] h-[22px] rounded-full ${walletColor}`} ></div>  
        <a className="font-poppins text-[22px] font-medium italic pl-[11px] pr-[68px]" >{name}</a>      
        <button onClick={()=>{}} >
            <Image src={cross} alt={"loading"} className="w-[20px] h-[20px]" />
        </button>
    </div>
}

export default Walletbutton
