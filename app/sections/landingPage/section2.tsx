"use client"

import DesCards from '@/app/components/DesCards'
import React from 'react'
import SmDesCards from '@/app/components/SmDesCards'

const section2 = () => {
  return<div className="flex flex-col w-full " >

      {/* title Card */}
      <div className="w-full  flex" >
        <div className="pl-[25px] md:pl-[30px] xl:pl-[62px] mt-[15px]" >

          {/* Line 1 */}
          <div className="flex flex-row items-baseline gap-3 ">
            <h1 className="font-OpenSans text-[32px] sm:text-[40px] md:text-[49px] xl:text-[64px] font-light italic text-black/90 " >Start Your</h1>
            <h1 className="font-poppins text-[32px] sm:text-[40px] md:text-[49px] xl:text-[64px] italic font-semibold text-black/90  " >Journey.</h1>
          </div>

          {/* Line 2 */}
          <div className="mt-[5px] md:mt-[14px] xl:mt-[19px]" >
            <h1 className="font-OpenSans sm-[text-16px] sm:text-[20px] md:text-[19px] xl:text-[24px] italic font-normal" >Choose a new way to vote.<br/> 
              Your participation and integrity are protected through blockchain <br/> transparency.</h1>
          </div>

        </div>
      </div>
      
      {/* Carda container */}
      <div className="hidden md:block w-full md:flex md:flex-row justify-center mt-[50px] pl-[30px] pr-[30px] xl:pl-0 xl:pr-0 gap-[20px] xl:gap-[38px]  mb-[120px] " >
        <DesCards title={"Be secure."} subTitle={`Cast your vote with confidence. Agora ensures every ballot is securely recorded and verifiable without exposing your identity`}  />
        <DesCards title={"Get connected."} subTitle={`Collaborate with citizens, governments, and organizations worldwide. Build shared trust through open, decentralized technology.`}  />
        <DesCards title={"Get Educated."} subTitle={`Access guides, documentation and real world case studies that show how blockChain can reshape modern elections.`}  />
      </div>

      {/* Cards Container for sm */}
      <div className="block md:hidden w-full flex flex-col justify-center items-center mt-[70px] sm:mt-[100px] " >
      <SmDesCards title={"Be secure."} subTitle={`Cast your vote with confidence. Agora ensures every ballot is securely recorded and verifiable without exposing your identity`}  />
      <SmDesCards title={"Get connected."} subTitle={`Collaborate with citizens, governments, and organizations worldwide. Build shared trust through open, decentralized technology.`}  />
      <SmDesCards title={"Get Educated."} subTitle={`Access guides, documentation and real world case studies that show how blockChain can reshape modern elections.`}  />
      </div>

    </div>
}

export default section2
