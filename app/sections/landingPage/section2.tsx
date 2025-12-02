import DesCards from '@/app/components/DesCards'
import React from 'react'

const section2 = () => {
  return<div className="flex flex-col w-full  min-h-screen" >
      {/* title Card */}
      <div className="container ml-[62px] mt-[15px]" >
        {/* Line 1 */}
        <div className="flex flex-row items-baseline gap-3 ">
          <h1 className="font-OpenSans text-[64px] font-light italic text-black/90 " >Start Your</h1>
          <h1 className="font-poppins text-[64px] italic font-semibold text-black/90  " >Journey.</h1>
        </div>
        {/* Line 2 */}
        <div className="mt-[19px]" >
          <h1 className="font-OpenSans text-[24px] italic font-normal" >Choose a new way to vote.<br/> 
Your participation and integrity are protected through blockchain <br/> transparency.</h1>
        </div>
      </div>

     <div className="flex flex-row justify-center mt-[50px] " >
      <DesCards title={"Be secure."} subTitle={`Cast your vote with confidence. Agora ensures every ballot is securely recorded and verifiable without exposing your identity`}  />
       <DesCards title={"Get connected."} subTitle={`Collaborate with citizens, governments, and organizations worldwide. Build shared trust through open, decentralized technology.`}  />
       <DesCards title={"Get Educated."} subTitle={`Access guides, documentation and real world case studies that show how blockChain can reshape modern elections.`}  />
     </div>

    </div>
}

export default section2
