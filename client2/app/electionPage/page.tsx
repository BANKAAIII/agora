"use client"


import { AnimatePresence } from 'framer-motion';
import { easeInOut, motion } from 'framer-motion';
import NavBar2 from '../components/navbar2'

import { useTheme } from '../themeProvider';
import { Toggle } from '../components/toggle';
import { useRouter } from 'next/navigation';
import {useState} from 'react';
import { electionPageInterface } from '../utils/electionPage';
import ElectionCard from '../components/ElectionCard';
import Candidate from '../components/candidate';
import CandidateInfo from '../components/candidateInfo';
import Image from 'next/image';
import { electionInterface } from '../zustandStore/newStore';

// contents this page will need to before rendering 
// -> 

const page = (props:electionInterface) => {

  const [bookmarkOpen,setBookMarkOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [isdisplayedHover,setIsDisplayedHover] = useState(false);
  const [participated,setparticipated] = useState(false);

    // hardcoding the election cards for now
    const status = "ongoing"
    // local stage state for rendering different pages in one
    type stage = 'voting' | 'voted' | 'results';
    const [currentStage , setCurrentStage] = useState<stage>('voting');

    //hardcoding for now
    
     const [DarkMode , setDarkMode] = useState(false);
            const router = useRouter();
          const username="Ameya";
          const navMenuVariants = {
          closed:{
            opacity:0 , x:-100
          },
          open:{
            opacity:1 , x:0
          }
        }
        
           
           const [navMenuOpen , setNavMenuOpen] = useState(false);
          
        
          const { toggleTheme } = useTheme();
        const totalCandidates=2

  return (
    <div className="flex flex-col w-full h-screen dark:bg-[#2c2c2c]" >
      <AnimatePresence>
        {
        navMenuOpen === true &&
        <motion.div 
        className="absolute z-20 bg-[#ffffff] dark:bg-[#2c2c2c] flex flex-col  w-[20.5%] h-full justify-center"
        variants={navMenuVariants}
        initial="closed"
        animate="open"
        exit="closed"
        transition={{ duration:0.3 ,ease:easeInOut }} >
          {/* contents */}
          <div className="flex flex-col w-full h-[70%]  bg-[#ffffff]  dark:bg-[#2c2c2c]" >
          
          {/* profile pic */}
          <div className="flex w-full  items-center justify-center mt-[10%]" >
            <div className="w-[25%] aspect-square rounded-full bg-red-300 dark:bg-red-50/20" >
              {/* image to enter */}
            </div>
          </div>

          {/* name */} 
          <div className="flex w-full items-center justify-center" >
            <a className="font-poppins text-2xl font-medium mt-[10px]" >{username}</a>
          </div>

          {/* editButton */} 
          <div className="flex w-full items-center justify-center" >
            <button
            className={`flex items-center justify-center w-[80px] h-[30px] mt-[10px] shadow-gray-950/30 shadow-xl  bg-[#f2f2f2]  dark:bg-[#5b5b5b]/80 rounded-full hover:scale-[1.2] transition-all  `}
            onClick={()=>{

            }}
            > Edit </button>
          </div>

          {/* navigation options */}       
          <div className="flex flex-col items-center justify-center w-full h-[70%] mt-[10%]  text-poppins text-xl " >
            <button className="w-[70%] h-[20%] rounded-[20px] bg-[#d9d9d9]/60 m-[10px] flex items-center justify-start pl-[10%] p-[10px]  "
                onClick={()=>{
                    //navigate to dashboard
                    router.push('/dashboard');
                }}
            >
            Dashboard
            </button>
            
            <button 
            onClick={()=>{
                    //navigate to my Elections
                    router.push('/myElections');
                }}
            className="w-[70%] h-[20%] rounded-[20px] bg-[#d9d9d9]/60 m-[10px] flex items-center justify-start pl-[10%] p-[10px]  " >
            MyElections
            </button>
          </div> 

          {/* day Night mode button */}
          <div className="relative z-10 flex flex-row items-center justify-center w-full h-[10%]  text-md font-poppins" >
            <a className="" >Night</a>
            <div className="  w-[100px] h-[50px] bg-[#f2f2f2]  dark:bg-[#2c2c2c] ml-2 mr-2 rounded-full flex items-center " >
              <span className="relative z-20 flex flex-row h-full w-full text-2xl items-center ml-2 mr-2 justify-between" >
                <div>🌙</div>
                <div>☀️</div>
              </span>
              <Toggle className={` absolute z-30 h-[90%] aspect-square rounded-full bg-amber-700/20 ${DarkMode? `translate-x-[118%]`:`translate-x-0`}` } onClick={()=>{ setDarkMode(!DarkMode); toggleTheme()}} ></Toggle>
            </div>
            <a  >Day</a>
          </div>
          </div>
        </motion.div>
}
      </AnimatePresence>

      {/* Nav Bar */}
      <div className="flex w-full items-center justify-center items-center  dark:bg-[#2c2c2c]" >
        <NavBar2 className="absolute z-30 mt-[24px]" navMenuOpen={navMenuOpen} setNavMenuOpen={setNavMenuOpen} button2ClassName={'hidden'} button2Img={"/cross.png"} />
      </div>

    <div className="grid grid-cols-[30%_70%] items-center w-full h-full" >
        <div className="flex flex-col w-full h-full items-center justify-center" >
            {/* desktop leaderBoard Page */}
            <div className="flex flex-col w-[80%] h-[90%] bg-amber-600/10 dark:bg-amber-50/15 rounded-2xl" >
                <div className="flex flex-row w-full p-[29px] font-inter text-[32px] font-medium pb-2 justify-between" >LeaderBoard</div> 
                {/* status , pin? , bookmark? , participated? , display? */}
                <div className="flex fel-row items-center justify-start gap-2 p-2 pl-[29px] mb-[40px]" >
                  {/* status */}
                  <button className={`rounded-full items-center justify-center text-[16px] flex w-[100px] h-[40px] ${status === 'ongoing'? "bg-green-300" :status ==='upcoming'? "bg-teal-300" :"bg-red-300" }`} >{status} </button>
                  {/* bookmark*/}
                  < button
                  className="flex h-[40px] w-[40px] bg-TitleDot/10 rounded-full"
                  onClick={()=>setBookMarkOpen(!bookmarkOpen)}
                  ><Image src={bookmarkOpen? "/bookmarkClose.png":"/bookmarkOpen.png"} alt="" width={80} height={80} className="flex w-full h-full p-2" /></button>
                  {/* pinned */}
                  <button 
                  className="flex h-[40px] w-[40px] bg-TitleDot/10 rounded-full"
                  onClick={()=>setPinned(!pinned)}><Image src={pinned? "/pinned.png":"/unpinned.png"} alt="" width={80} height={80} className="flex w-full h-full p-1" /></button>
                  {/* participated */}
                  <Image src={"/participated.png"} alt="" width={80} height={80} className={`flex w-[50px] h-[50px] p-1 ${participated? "block":"hidden"}`} />
                </div>
              {/* candidates */}
              <div className=" flex flex-col space-y-6 w-full h-full " >
                  <Candidate name={"AmeyaWarang"} rank={1} />
                  <Candidate name={"AmeyaWarang"} rank={2} />
                
              </div>
            </div>
        </div>
        <AnimatePresence>
          {
            currentStage === 'voting' &&
              <motion.div className={`flex flex-col w-full h-[80%] items-center justify-center gap-20 `} >
                {/* map candidates for voting  */}
                <div className={` font-inter font-medium text-2xl grid w-full h-full ${totalCandidates ===2 ?'grid-cols-2' :totalCandidates === 3 ? "grid-cols-3 ":totalCandidates === 4? "grid-cols-4" : "grid-cols-1"} items-center justify-center`} >
              
              <CandidateInfo name={"Ameya"} totalCandidates={totalCandidates} imageUrl='' description='first time for elections' votesReceived={100} />
              <CandidateInfo name={"New Ameya"} totalCandidates={totalCandidates} imageUrl='' description='first time for elections' votesReceived={100}/>
                </div>
                {/* vote button */}
                <div className={`relative z-10 flex ${totalCandidates ===2 ? 'w-[30%]' : totalCandidates === 3? 'w-[40%]' :totalCandidates === 4 ? 'w-[55%]' :' w-[65%]'} h-[100px] bg-TitleDot/60 gap-x-5 items-center justify-center rounded-xl`} >
                  <button className=" relative z-20 flex items-center justify-center w-[100px] h-[100px] aspect-square rounded-full hover:-translate-y-10 transition-all ease-in-out hover:bg-[#ffffff] hover:dark:bg-[#2c2c2c] " >
                  <div className={`reltive-30 flex h-[70%] aspect-square rounded-full hover:bg-amber-300/70 items-center justify-center  `}
                  onClick={()=>{
                    // backend vote function to be called here
                    // verfity with backend if vote is successful or not
                    setCurrentStage('voted');
                    setparticipated(true);
                  }
                  }
                  >1</div></button>
                  <button className=" relative z-20 flex items-center justify-center w-[100px] h-[100px] aspect-square rounded-full hover:-translate-y-10 transition-all ease-in-out hover:bg-[#ffffff] hover:dark:bg-[#2c2c2c] " >
                  <div className={`reltive-30 flex h-[70%] aspect-square rounded-full hover:bg-amber-300/70 items-center justify-center  `}
                  onClick={()=>{
                    // backend vote function to be called here
                    // verfity with backend if vote is successful or not
                    setCurrentStage('voted');
                    setparticipated(true);
                  }
                  }
                  >2</div></button>
                </div>
              </motion.div> 

              ||
            
            currentStage === 'voted' &&
              <motion.div className="flex w-full h-full items-center justify-center flex-col"
              >
                
                {/* succeddfull image */}
                  <Image  src={"/completed.png"} width={300} height={300} alt={""} className=""/>
                  <a className="font-openSans text-2xl p-4 pt-8" >Your Vote has been recorded!!</a>
                  <a className="font-openSans text-2xl p-4 " >Thank you for participating</a>

                  <div className="flex items-center justify-center bg-[#d9d9d9]/80 p-5 text-[24px] rounded-2xl" >you will be informed of the results</div>
              </motion.div>

              ||

            currentStage === 'results' &&
              <motion.div className="flex w-full h-full items-center justify-center flex-col">
                {/* results image */}
                <div className="flex flex-col items-center justify-center w-[60%] h-full aspect-square rounded-2xl" >
                  <Image  src={"/emptyPfp.png"} width={300} height={300} alt={""} className=""/>
                  <a className="font-openSans font-medium text-2xl mt-12" >Ameya Warang</a>
                  <a className="font-openSans font-medium text-3xl m-4">Has Won the {props.name} Election !!</a>
                </div>
              </motion.div>
          }
        </AnimatePresence>
        

    </div>

    </div>
  )
}

export default page
