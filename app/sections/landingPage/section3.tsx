import React from 'react'

const Section3 = () => {
  return<div className=" w-full h-screen flex bg-[#D9D9D9] items-center justify-center">
    {/* parent container */}
     <div className="m-[81px] w-[1600px] h-[700px] flex flex-row items-center justify-center gap-50 container" >
      {/* subcontainer 1 */}
      <div className="flex flex-col items-center justify-center" >

      {/* title and Description */}
        <div className="flex flex-col ml-[56px] mt-[86px] mb-8" >
            {/* title */}
            <h1 className="font-poppins text-[64px] font-semibold" >Get Started Today.</h1>
            <h1 className="font-poppins text-[24px] font-medium mt-4 " >Introducing the Agora Voting Protocol™ — our next-generation <br/>framework for secure, verifiable elections.</h1>
        </div>
        {/* mini cards */}
        <div className="flex flex-row gap-24 items-center justify-start" >
          <div className=" flex flex-col items-center justify-center p-4" ><h1 className="font-poppins font-regular text-[24px]" >Agora Ledger</h1>
          <h1 className="font-poppins font-light text-[16px] w-70 h-30 " >Our blockchain infrastructure guarantees end-to-end encryption and immutable records, ensuring no tampering or loss of data.</h1></div>
          <div className=" flex flex-col items-center justify-center p-4" ><h1 className="font-poppins font-regular text-[24px]" >Agora Interface</h1>
          <h1 className="font-poppins font-light text-[16px] w-70 h-30" >A user-friendly platform designed for both voters and election administrators — simple, elegant, and built for scalability.</h1></div>
        </div>
        <div className="flex flex-row gap-24 items-center justify-start" >
          <div className=" flex flex-col items-center justify-center p-4" ><h1 className="font-poppins font-regular text-[24px]" >Agora Community</h1>
          <h1 className="font-poppins font-light text-[16px] w-70 h-30" >Join developers, auditors, and civic leaders shaping the future of digital democracy. Your input helps strengthen transparency.</h1></div>
          <div className=" flex flex-col items-center justify-center p-4" ><h1 className="font-poppins font-regular text-[24px]" >Gsoc</h1>
          <h1 className="font-poppins font-light text-[16px] w-70 h-30" >Agora is an openSource gsoc organisation ,which encourages young minds to get hands on exp on projects.</h1></div>
        </div>
        
              </div>
      {/* subcontainer 2 */}
     <div className="flex flex-row items-center justify-center" >
      <div className="w-[421px] h-[642px] rounded-[10px] bg-[#ffffff]" ></div>
     </div>
        
     </div>
    </div>
  
}

export default Section3
 