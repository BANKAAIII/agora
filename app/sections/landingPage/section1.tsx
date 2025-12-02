import React from 'react'
import NavBar from '@/app/components/NavBar'
import BorderButton from '@/app/components/BorderButton'
import NoBorderButton from '@/app/components/noBorderButton'

const Section1 = () => {
  return <div className="relative z-0 flex  w-full min-h-screen ">      
    
<NavBar className={"absolute z-10 mt-[24px]"}/>
    {/* parent container */}
    <div className="absolute z-10 container flex flex-col 
                      md:ml-[62px] mt-[272px] "  >
      {/* Line 1 */}
      <h1 className="text-[80px] font-poppins italic font-light" >Welcome to</h1>
      {/* Line 2 */}
       <div className="container flex flex-row items-baseline gap-2 " >
      <h1 className="text-[88px] font-poppins font-semibold italic mt-[-18px] " >Agora BlockChain</h1>
      <div className="h-[25px] w-[25px] rounded-full bg-TitleDot"/>
      </div>
      {/* Line 3 */}
        <div className="text-[24px] font-poppins font-extralight italic" >With blockchain as its foundation,<br/> Agora ensures that every voice is heard and every vote counts</div>
      
      </div>

       {/* Buttons */}
      <div className="absolute z-10 flex flex-row w-full h-[66px] mt-[761px] justify-end " >
          <NoBorderButton onClick={()=>{}} label={"Learn more"} className={""} />
          <BorderButton onClick={()=>{}} label={"Get Started >"} className={"mr-[157] ml-8z hover:scale-[1.1] duration-75 transition-all"} />
         
        </div>

    </div>
}

export default Section1
