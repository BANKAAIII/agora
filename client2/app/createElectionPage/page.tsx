"use client"

import React, { useEffect, useState } from 'react'
import NavBar2 from '../components/navbar2'
import { usePathname } from 'next/navigation'
import WalletsCard from '../components/walletsCard';
import { walletCardInterface } from '../utils/walletCardInterface';
import HostedElections from '../components/hostedElections';
import HostedElections2 from '../components/hostedElections2';
import {easeInOut, motion, scale} from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from '../themeProvider';
import {Toggle} from '../components/toggle';
import { useRouter } from 'next/navigation';
import MinimalNavBar from '../components/minimalNavBar';
import DynamicInput from '../components/dynamicInput';
import { payload1Interface } from '../utils/createElectionsPayload';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AddCandidate from '../components/addCandidate';
import { set } from 'date-fns';
import Image from 'next/image';
import AddCandidatePfp from '../components/addCandidatePfp';
import { useCreateElectionStore } from '../zustandStore/draftStore';


interface candidatesInterface{
    key:number
    id:number
    name:string;
    description:string;
    image:string;
    
}


const createElection = () => {

    // hardcoded voting types. objects are defined to accomodate if any other fields here
    const votingTypes =[
      {id:1,name:"type1"}, {id:2,name:"type2"}, {id:3,name:"type3"},{id:4,name:"type4"}
    ]

    const router = useRouter();
    const { toggleTheme } = useTheme();     // ui button for changing theme.

    const navMenuVariants = {
        closed:{
          opacity:0 , x:-100
        },
        open:{
          opacity:1 , x:0
        }
      }

    // state variables controlling ui components

    const [navMenuOpen , setNavMenuOpen] = useState(false);       // controlling the left navBar.
    const [DarkMode , setDarkMode] = useState(false);             // controling ui mode's.
    const [stage,setStage] = useState(1);                         // setting stage of create election. 1 | 2 | 3 
    const [addCandidateStage,setAddCandidateStage]=useState(1);   // stages of mini add candidate cards.


    // state variables for maintaining creation count 
    const [counter,setCounter] = useState(0)
    const [candidates,setCandidates] = useState<candidatesInterface[]>([]);

    const { meta , setMeta , addCandidate , nextStage } = useCreateElectionStore();

    const[deleteC,setDeleteC]= useState(false);
    const[startDate,setStartDate] = useState<Date>(new Date());
    const[endDate,setEndDate] = useState<Date | null>(new Date());
    const [payload1,setPayload1] = useState<payload1Interface>({name:"",description:"",startDate:new Date(),endDate:new Date()});

    const [votingAccess,setVotingAccess]= useState<"public"|"private">("public");
    const [votingType,setVotingType]=useState("select voting Type");
    const [votingTypeMenuOpen,setVotingTypeMenuOpen]=useState(false);
    
    


      // zustand store setup

      const metaData = useCreateElectionStore( (s)=> s.setMeta );
  return (
    <div className="flex w-full h-screen flex-col items-start justify-center relative z-10 overflow-hidden" >
      
      

      {/* Navbar */} 
      <div className="flex w-full items-center justify-center  dark:bg-[#2c2c2c] pt-[24px] " >
        <NavBar2 navMenuOpen={navMenuOpen} setNavMenuOpen={setNavMenuOpen} button2Img='/search.png' button2ClassName='hidden' button3ClassName={"hidden"}/>
      </div>

        <AnimatePresence mode="wait">
           {
            stage === 1 &&(
            <motion.div key={stage} className="relative z-20 flex  flex-col w-full h-full items-center justify-center   dark:bg-[#2c2c2c] " >
              <div className="flex w-[80%] h-[90%] relative  items-center justify-center " >

                <div className=" absolute z-30 right-[10%] flex w-[30%] items-center justify-center aspect-square bg-TitleDot rounded-full blur-[80px] opacity-30 bottom-0" />
                
                <div className="relative z-30 flex flex-col w-[70%] h-full rounded-4xl  items-center dark:bg-[#5b5b5b] bg-[#d9d9d9] overflow-hidden ">
                  
                  {/* cancel button */}
                  <div className="p-4 flex  w-full items-center justify-start  rounded-full " >
                    <button className="flex w-[5%] aspect-square rounded-full hover:shadow-[17px_15px_29px_-14px_rgba(1,1,0,1)] bg-[#d9d9d9]  items-center justify-center "
                     onClick={()=>{
                      router.push("/dashboard");
                    }} >
                      <Image src={"/cross.png"} width={45} height={45} alt="" className="p-4 flex w-full h-full" />
                    </button>
                  </div>
                  
                  {/* electionTypes and addCandidate Pfp */}
                  <div className="flex flex-row w-full h-full items-center justify-center" >

                    {/* col 1 : election type details */}
                    <div className="flex flex-col w-full h-full items-center justify-start" >
                      
                      {/* title */}
                      <a className="p-10 flex w-full items-center justify-start font-inter font-semibold text-4xl dark:text-[#d9d9d9]" >Create Election</a>
                      
                      {/* input : name */}
                      <div className="flex flex-row pl-10 w-full items-center justify-start" >
                        <DynamicInput className="w-[80%] h-12 rounded-xl bg-[#ffffff]/89 dark:bg-[#d9d9d9]/89 p-4 outline-none font-inter text-md flex items-center justify-center m-2 " placeholder="Election Name" type="string" value={meta.name} onChange={
                          (value)=> setMeta({ name: value })
                        } />
                      </div>

                    {/* input : description */}
                    <div className="flex flex-row pl-10 w-full items-center justify-start" >
                      
                        <DynamicInput className="w-[80%] h-24 rounded-xl bg-[#ffffff]/89 dark:bg-[#d9d9d9]/89 p-4 outline-none font-inter text-md flex flex-col items-center justify-start m-2" placeholder="Election Description" type="text" value={payload1.description} onChange={(val)=>{
                            setPayload1({
                                ...payload1,
                                description:val
                            })
                        }
                        } ></DynamicInput>
                       
                    </div>
                    {/* input Date : From and To */}<div className="flex  pl-10 w-full items-center justify-center  mt-[30px]" >
                        <div className="flex w-[50%] flex-row  items-center justify-center " >
                            <a className="flex  items-center justify-center font-poppins text-xl font-medium  dark:text-[#f8f8f8]/25" >From:</a>
                            <DatePicker
                                selected={startDate}
                                onChange={ (e:Date|null )=>{
                                        if(!e) return;
                                        setStartDate(e)
                                      }
                                } 
                                className=" w-[55%] h-[50px] rounded-full bg-[#ffffff]/89 dark:bg-[#d9d9d9]/89 p-2 flex items-center justify-center outline-none font-inter text-md m-2"
                                placeholderText="Select a date"
                                />
                        </div>
                        <div className="flex w-[50%] flex-row  items-center justify-center" >
                            <a className="flex  items-center justify-center font-poppins text-xl font-medium dark:text-[#f8f8f8]/25" >To:</a>
                            <DatePicker
                                selected={endDate}
                                onChange={(e:Date | null) => {
                                  if(!e) return;
                                    setEndDate(e);
                                }}
                                className=" w-[55%] h-[50px] rounded-full bg-[#ffffff]/89 dark:bg-[#d9d9d9]/89 p-2 flex items-center justify-center outline-none font-inter text-md m-2"
                                placeholderText="Select a date"
                                />
                        </div>
                    </div>
                    {/* confirm button */}
                    <div className="flex flex-row pl-10 w-full items-center justify-center" >
                        <button className="flex w-[30%] h-[60px] hover:shadow-[15px_15px_29px_-14px_rgba(1,1,0,0.5)] items-center justify-center rounded-full bg-TitleDot/30 hover:bg-TitleDot/50 font-poppins text-xl font-medium m-8" onClick={()=>{
                            setStage(2);
                            setAddCandidateStage(2);
                            
                        }} >next</button>
                    </div>
                </div>
                <div className="flex flex-col  w-full h-full items-center justify-start" >
                    {/* adding Candidates */}
                    <div className="flex flex-col w-[75%] items-center justify-start h-[80%]  rounded-2xl bg-[#feda3b]/50 p-4" >
                     {/* add and remove button */}
                     <div className="flex w-full flex-row items-center justify-end p-2 pb-8 gap-4 " >
                        <button className="flex h-[50px] aspect-square rounded-full bg-[#f3f3f3] hover:scale-[1.1]" onClick={()=>{
                          if(deleteC === false){
                            const newId = counter + 1;
                          setCounter(newId);
                          setCandidates([...candidates, {key:newId ,id: newId, name: '', description: '', image: '' }]);
                          }else{
                            // logic to delete candidates from server
                            setDeleteC(false);
                          }
                          
                        }} >
                          <Image src={deleteC?"/tick.png":"/add.png"} alt={""} width={40} height={40} className="flex w-full h-full p-2" />
                        </button>
                        <button 
                        onClick={()=>{
                          setDeleteC(!deleteC);
                        }}
                        className="flex h-[50px] aspect-square rounded-full bg-[#FE3B3B] hover:scale-[1.1] " >
                          <Image src={"/delete.png"} alt={""} width={40} height={40} className="flex w-full h-full p-2" />
                        </button>
                     </div>
                     {/* candidate input */}
                     <div className="flex flex-col space-y-2 h-[600px] w-full items-center justify-start
                     overflow-y-auto " >
                        {
                          candidates.map(card => (
                            <AddCandidate
                              key={stage}
                              stage={addCandidateStage}
                              id={card.id}
                              name=""
                              description=''
                              deletingMode={deleteC}
                            />
                          ) )
                        }
                     </div>
                    </div>
                </div>
               
                </div>
                
             </div>
        

        </div>
        
      </motion.div>
)
     
          }
          {
             stage === 2 && (
            <motion.div key={stage}  className="relative z-20 flex  flex-col w-full h-screen items-center justify-center  dark:bg-[#2c2c2c]"  >
              {/* page parent container */}
              <div className=" flex w-[80%] h-[90%] relative  items-center justify-center" >

                {/* background decor of yellow blur light */}
                <div className=" absolute z-30 right-[10%] flex w-[30%]  aspect-square bg-TitleDot rounded-full blur-[80px] opacity-30 bottom-0" />
                
                {/* main card container */}
                <div className="relative z-40  flex flex-col w-[70%] rounded-4xl h-full items-center dark:bg-[#5b5b5b] bg-[#d9d9d9] ">
                  
                  {/* container for top buttons : terminate & back */}
                  <div className="p-4 flex flex-row gap-2  w-full items-center justify-start  rounded-full " >
                      
                      {/* ternimate button */}
                      <button className="flex w-[5%] aspect-square rounded-full hover:shadow-[17px_15px_29px_-14px_rgba(1,1,0,1)] bg-[#d9d9d9]  items-center justify-center "
                      onClick={()=>{
                        router.push("/dashboard");
                      }} >
                        <Image src={"/cross.png"} width={45} height={45} alt="" className="p-4 flex w-full h-full" />
                      </button>
                      {/* back button */}
                      <button className="flex w-[5%] aspect-square rounded-full hover:shadow-[17px_15px_29px_-14px_rgba(1,1,0,1)] bg-[#d9d9d9]  items-center justify-center "
                      onClick={()=>{
                        setStage(1);
                        setAddCandidateStage(1);
                      }} >
                        <Image src={"/arrow.png"} width={45} height={45} alt="" className="p-4 flex w-full h-full" />
                      </button>
          
                  </div>

                {/* container for details filling and image addition colunn */}  
                <div className="flex flex-row w-full h-full items-center justify-center" >

                {/* col 1 : election basic details */}
                <div className="flex flex-col w-full h-full items-center justify-start" >
                  {/* Create Election line */}
                  <a className="p-10 flex w-full items-center justify-start font-inter font-semibold text-3xl dark:text-[#d9d9d9]" >Create Election</a>
                    
                  <a className="  p-10 flex w-full items-center j z-30 flustify-start font-inter font-semibold text-2xl dark:text-[#d9d9d9]" >voting access :</a>
                    
                    <div className="flex flex-row items-center justify-center w-full" >
                      <button className={`flex w-[30%] h-[60px] hover:shadow-[15px_15px_29px_-14px_rgba(1,1,0,0.5)] items-center justify-center rounded-full ${votingAccess === "public"? "bg-TitleDot/80":"bg-TitleDot/30"} hover:bg-TitleDot/50 font-poppins text-xl font-medium `} onClick={()=>{
                           setVotingAccess("public")
                        }} >public</button>
                        <button className={`flex w-[30%] h-[60px] hover:shadow-[15px_15px_29px_-14px_rgba(1,1,0,0.5)] items-center justify-center rounded-full ${votingAccess === "private"? "bg-TitleDot/80":"bg-TitleDot/30"} hover:bg-TitleDot/50 font-poppins text-xl font-medium ml-4`} onClick={()=>{ 
                          setVotingAccess("private")
                        }} >private</button>
                    </div>

                    <a className="p-10 flex w-full items-center justify-start font-inter font-semibold text-xl dark:text-[#d9d9d9]" >Select an algorithm for vote calculation</a>
                    {/* voting type menu */}
                    <div className="flex w-full h-full relative flex-col items-center justify-start z-10" >
                      <div className={` z-30 flex flex-col items-start justify-start w-[70%] ${votingTypeMenuOpen === true? "h-[200px] absolute":"h-[70px] relative"} bg-amber-100 rounded-xl`} >
                    <div className="flex flex-row w-full items-center " >
                      <a className=" p-4 flex flex-row min-w-[80%] font-inter text-xl items-center justify-start" >{votingType}</a>
                        <motion.button 
                        className="flex w-full h-full flex-col items-center p-2 "
                        onClick={()=>{setVotingTypeMenuOpen(!votingTypeMenuOpen)}} >
                          <Image src={ "/downArr.png"} alt={""} width={40} height={40} className={`${votingTypeMenuOpen? "rotate-180":""} flex w-[50px] h-[50px] p-2`} />
                        </motion.button>
                        
                    </div>
                    <div className="flex overflow-auto w-full flex-col" >                        {
                            votingTypeMenuOpen &&
                            votingTypes.map( (VType)=>(
                            <button 
                            onClick={()=>{
                              setVotingType(VType.name);
                              setVotingTypeMenuOpen(false);
                            }}
                            className="flex items-center justify-center p-2 font-poppins text-xl w-full hover:bg-TitleDot/80" >
                              {VType.name}
                            </button>) )
                          }
                        </div> 

                    </div>
                    <div className="relative z-20 flex w-full h-[50px] mt-[50px] rounded-xl items-center justify-center" >
                      <button className="flex w-[20%] h-full rounded-2xl bg-TitleDot/70 hover:shadow-[15px_15px_29px_-14px_rgba(1,1,0,0.5)] hover:bg-TitleDot/90 items-center justify-center font-poppins text-xl"  >Finish</button>
                    </div>
                    </div>
                    
                </div>
                
                {/* container for addCandidate Pfp */}
                <div className="flex flex-col w-full h-full items-center justify-start" >
                  <div className="flex flex-col  w-[75%] items-center justify-start h-[85%]   rounded-2xl bg-[#feda3b]/50 p-4 " >
                     
                     {/* add and remove button */}
                     <div className="flex w-full flex-row items-center  justify-end p-4 gap-4 " >
                        <button className="flex h-[50px] aspect-square rounded-full bg-[#f3f3f3] hover:scale-[1.1]" onClick={()=>{
                          const newId = counter + 1;
                          setCounter(newId);
                          setCandidates([...candidates, { key:newId,id: newId, name: '', description: '', image: '' }]);
                          setDeleteC(false);
                        }} >
                          <Image src={deleteC?"/tick.png":"/add.png"} alt="" width={40} height={40} className='flex w-full h-full p-2'/>
                        </button>
                        <button className="flex h-[50px] aspect-square rounded-full bg-[#FE3B3B] hover:scale-[1.1] "
                        onClick={
                          ()=> setDeleteC(!deleteC)
                        }
                        >
                          <Image src={"/delete.png"} alt="" width={40} height={40} className='flex w-full h-full p-2'/>
                        </button>
                     </div>

                     {/* candidate input */}
                     <div className="flex  flex-col space-y-2 h-[600px] w-full items-center justify-start
                     overflow-y-auto " >
                        {
                          candidates.map(card => (
                            <AddCandidatePfp
                              key={stage}
                              stage={addCandidateStage}
                              id={card.id}
                              name=""
                              description=''
                              deletingMode={deleteC}
                            />
                          ) )
                        }
                     </div>
                    </div>
                    
                </div>
               
                </div>
                
             </div>
        

        </div>
            </motion.div>)
          }
        </AnimatePresence>
      
      
    </div>
  )
}

export default createElection
