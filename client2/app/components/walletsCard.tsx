"use client"
import React from 'react'
import Walletbutton from './walletbutton'
import { walletCardInterface } from '../utils/walletCardInterface'
import plus from "../public/plus.png";
import Image from 'next/image';
import trash from "../public/trash.png"

// fetch wallets from server.
// maintain a global state for wallets.
// refresh wallets every 5 seconds.

const WalletsCard = ({walletColor , name , onClick} :walletCardInterface) => {

  return <div className='z h-[730px]  w-[320px] bg-[#d9d9d9]/60 rounded-3xl'>
    <div className="flex flex-row items-center justify-between p-4 w-full h-[10%] mt-[20px]" >
        <div className="flex flex-row items-center justify-center" >
            <a className="font-poppins text-[32px] font-normal italic  " >Wallets.</a>
        </div>
        <div className="flex flex-row items-center justify-center gap-x-3 " >
             <button className="w-10 h-10 rounded-full hover:scale-110 bg-[#d9d9d9] hover:bg-green-500/50 flex items-center justify-center"
                    onClick={()=>{alert("remove wallet")}} ><Image src={plus} alt={""} className=" w-[60%] h-[60%] invert dark:invert-0" /></button>
            <button className="w-10 h-10 rounded-full bg-[#d9d9d9] hover:scale-110 hover:bg-red-500/50 flex items-center justify-center"
                    onClick={()=>{alert("add wallet")}} ><Image src={trash} alt={""} className=" w-[60%] h-[60%] invert dark:invert-0" /></button>
        </div>
    </div>
    <div className="flex w-full flex-row items-center justify-center p-[15px] mt-[17px]">
        <Walletbutton walletColor={walletColor} name={name} onClick={onClick} />
    </div>
    </div>
}

export default WalletsCard;
