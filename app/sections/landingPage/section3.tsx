"use client"

import Sprinkler from '@/app/components/confetti'
import React from 'react'

const Section3 = () => {
  return<div className=" w-full h-screen flex bg-[#D9D9D9] items-center justify-center">

      {/* parent container */}
      <div className="m-[25px] md:m-[81px] sm:w-[600px] md:w-[1600px] h-[700px] flex flex-row items-center justify-center gap-[50px] overflow-hidden" >
        {/* subcontainer 1 */}
        <div className="flex flex-col items-center justify-start w-[858px] h-[637px]" >

          {/* title and Description */}
          
              {/* title */}
              <div className="flex justify-center md:justify-start w-full" > <h1 className="font-poppins text-[24px] sm:text-[32px] md:text-[64px] font-semibold" >Get Started Today.</h1> </div>
              <div className="flex justify-center md:justify-start w-full" ><h1 className="font-poppins text-[14px] sm:text-[18px] md:text-[24px] font-medium mt-4 " >Introducing the Agora Voting Protocol™ — our next-generation <br/>framework for secure, verifiable elections.</h1>
          
            {/* mini cards R1*/}</div>
              
            <div className="flex flex-row gap-y-24 items-center justify-start w-full gap-x-8 mt-5 sm:mt-0" >
              
              {/* Card1 */}
              <div className=" flex flex-col items-center justify-center  sm:w-[350px] md:w-[377px] sm:h-[212px]" >
                 {/* title */}
                 <div className="flex w-full mt-[19px]" ><h1 className="font-poppins font-regular text-[18px] sm:text-[22px] md:text-[24px]" >Agora Ledger</h1></div>
                 <div className="flex w-full mt-[24px]" ><h1 className="font-poppins font-light text-[12px] sm:text-[16px]  " >Our blockchain infrastructure guarantees end-to-end encryption and immutable records, ensuring no tampering or loss of data.</h1></div>
              </div>

              {/* card2 */}
              <div className=" flex flex-col items-center justify-center  sm:w-[350px] md:w-[377px] h-[212px]" >
                <div className="w-full mt-[19px]" ><h1 className="font-poppins font-regular text-[18px] sm:text-[22px] md:text-[24px]" >Agora Interface</h1></div>
                <div className="w-full mt-[24px]" ><h1 className="font-poppins font-light text-[12px] sm:text-[16px] " >A user-friendly platform designed for both voters and election administrators — simple, elegant, and built for scalability.</h1></div>
              </div>

            </div>

            {/* mini cards R1*/}
            <div className="flex flex-row gap-y-24 items-center justify-start w-full gap-x-8" >
              {/* card3 */}
              <div className=" flex flex-col items-center justify-center sm:w-[350px] md:w-[377px] h-[212px]" >
                <div className="w-full flex mt-[19px]" ><h1 className="font-poppins font-regular text-[18px] sm:text-[22px] md:text-[24px]" >Agora Community</h1></div>
                <div className="flex w-full mt-[24px]" > <h1 className="font-poppins font-light text-[12px] sm:text-[16px]" >Join developers, auditors, and civic leaders shaping the future of digital democracy. Your input helps strengthen transparency.</h1></div>
             </div>
              
              {/* card4 */}
              <div className=" flex flex-col items-center justify-center sm:w-[350px] md:w-[377px] h-[212px]" >
                <div className="w-full flex mt-[19px]" ><h1 className="font-poppins font-regular text-[18px] sm:text-[22px] md:text-[24px]" >Gsoc</h1></div>
                <div className="w-full flex mt-[24px]" ><h1 className="font-poppins font-light text-[12px] sm:text-[16px] " >Agora is an openSource gsoc organisation ,which encourages young minds to get hands on exp on projects.</h1></div>
              </div>
            </div>
        
              </div>
        {/* subcontainer 2 */}
        <div className="hidden md:block w-full h-full" >
          <div className=" relative z-0 flex w-full h-full flex-row items-center justify-center" >

         
        <Sprinkler count={60} />
     
          <div className="absolute z-30 w-[421px] h-[642px] rounded-[10px] bg-[#ffffff]" ></div>
        </div> 
        </div>
        
        
        
     </div>
    </div>
  
}

export default Section3
 