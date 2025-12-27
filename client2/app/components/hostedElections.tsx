import React from 'react'
import { hostedElectionInterface } from '../utils/hostedElectionInterface'
import Image from 'next/image'

const HostedElections = ({width,height,title,description}:hostedElectionInterface) => {
  return <div className={`${width} ${height} bg-[#d9d9d9]/60 rounded-[25px] flex flex-col  items-center justify-between  `} >
      <div className="flex w-full items-center justify-between p-[24px]" >
        <a className=" w-[300px] font-poppins font-normal italic text-[16px] ">{description}</a>
        <Image src={"/send.png"} alt="" className="w-[35px] h-[35px]" />
      </div>
      <div className="flex w-full flex-row items-center p-[24px] justify-start" >
        <a className="font-poppins font-bold italic text-[40px]" >Hosted Election's</a>
      </div>
    </div>
}

export default HostedElections
