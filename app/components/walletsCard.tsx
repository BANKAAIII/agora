"use client"
import React from 'react'
import Walletbutton from './walletbutton'
import { walletCardInterface } from '../utils/walletCardInterface'

const WalletsCard = ({walletColor , name , onClick} :walletCardInterface) => {
  return <div className='z h-[750px]  mt-[50px] w-[320px] bg-[#d9d9d9]/60 rounded-3xl'>
    <div className="flex items-center justify-center w-full" >
        <a className="font-poppins text-[32px] font-normal italic mt-[43px]" >Wallets.</a>
    </div>
    <div className="flex w-full flex-row items-center justify-center p-[15px] mt-[17px]">
        <Walletbutton walletColor={walletColor} name={name} onClick={onClick} />
    </div>
    </div>
}

export default WalletsCard
