"use client"

import { useState } from 'react'
import NavBar2 from '../components/navbar2'
import WalletsCard from '../components/walletsCard';
import HostedElections from '../components/hostedElections';
import HostedElections2 from '../components/hostedElections2';
import {easeInOut, easeOut, motion} from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from '../themeProvider';
import Image from 'next/image';

import {Toggle} from '../components/toggle';
import { useRouter } from 'next/navigation';
import { useNotificationToggle } from '../zustandStore/dashboardStore';
import {elections} from "../zustandStore/hardcodedStore"
import DisplayElectionCard from '../components/displayElectionCard';

const page = () => {

  const [editDisplay,setEditDisplay] = useState(false);

  // animation 
  const container = {
    hidden:{},
    show:{
      transition:{
        stagger:0.20
      }
    },
  }

  const itemUp = {
  initial: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit:{opacity:0,y:-50,transition:{duration:0.6}}
};

const itemDown = {
  hidden: { opacity: 0, y: -50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit:{opacity:0,y:50,transition:{duration:0.6,ease:easeOut}}
};

const editMenu ={
  hidden:{ opacity:0,x:-50 },
  show:{ opacity:1, x:1, transition:{ duration:0.7 } },
  exit:{ opacity:0 , x:-50 , transition:{ duration:0.6, ease:easeOut }}
}


  const [editingMode,setEditingMode] = useState(false);
  const router = useRouter();
  const [DarkMode , setDarkMode] = useState(false);
  const toggle = useNotificationToggle( (state)=>state.toggle );
   let pathName="";
   const [navMenuOpen , setNavMenuOpen] = useState(false);
  const { toggleTheme } = useTheme();
  const [editProfile,setEditProfile] = useState(false);

  
  const [searchOpen,setSearchOpen]= useState(false);

  // hardcoded stuff
  const [username,setUsername]=useState("Ameya");
  const navMenuVariants = {
      closed:{
        opacity:0 , x:-100
      },
      open:{
        opacity:1 , x:0
      }
   }

   const [open,setOpen] = useState(false);
   const [editDisplayElection,setEditDisplayElection] = useState(false);

  return (
    <div className="flex flex-col items-start justify-center relative z-10" >
      
      <AnimatePresence>
           {
            open && (
             <motion.div key="search-panel"
              initial={{ y: "-100%", opacity: 0 }}   // starting: above + invisible
              animate={{ y: "0%", opacity: 1 }}     // slide down + fade in
              exit={{ y: "-100%", opacity: 0 }}      // slide up + fade out
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="fixed top-0 left-0 w-full h-screen bg-[#666666] z-[999] shadow-xl">
                        
                        <div className={`flex flex-row items-center justify-between w-full h-[80px] mt-[24px]  pr-[32px] `}>
                           <div className="pl-[25px] md:pl-[32px]" >
                              <Image width={74} height={74} src={"/aossie.png"} alt={"loading"} className="w-[40px] h-[40px] sm:h-[60px] sm:w-[60px] md:h-[74px] md:w-[74px] " />
                            </div>
                            <div className="flex flex-row items-center justify-center" >
                              
                              <button
                                    className="  h-[25px] w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] xl:w-[60px] xl:h-[60px] bg-[#d9d9d9]  rounded-[15px] flex items-center justify-center"
                                    onClick={() => setOpen(!open)}
                                  >
                                    <Image
                                    width={20} height={20}
                                      src={open? "/cross.png":"/search.png"}
                                      alt="wallet"
                                      className=" w-[25px] md:h-[25px] md:w-[25px] xl:h-[36px] xl:w-[36px]"
                                    />
                                  </button>
                            </div>
                          
                
                        </div>
                        <div className="flex flex-col items-center  w-full h-full " >
                          <div className={`flex-col  fixed top-30 ${searchOpen?"h-[50%]": "h-[10%]" } w-[60%]  rounded-4xl bg-TitleDot/40 m-[5%] items-start justify-between p-6`} >
                          {/* search bar */}
                          <div className="flex flex-row items-center justify-between w-full " >
                            <input placeholder='Search Elections' className="flex placeholder:text-black/80 w-full h-full p-4 inset-0 outline-none border-none text-2xl" onChange={(e)=>{ e.target.value === ""? setSearchOpen(false) : setSearchOpen(true) }} />
                          <Image src={"/search.png"} alt="" width={80} height={80} className="flex h-[36px] w-[36px] " />
                          </div>
                          {/* search contents */}
                          <div className="mt-5 flex flex-row items-center justify-start" >
                            <div className="flex flex-row items-center justify-start" >
                              { 
                                // mapping the search contents
                               }
                            </div>
                          </div>
                          </div>
                          
                        </div>

             </motion.div>
                )
           }
            </AnimatePresence>
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
              <input className="flex w-full h-full p-4 items-center justify-center outline-none" />
            </div>
          </div>

          {/* name */} 
          <div className="flex w-full items-center justify-center" >
            {
              editProfile === false &&
              <a className="font-poppins text-2xl flex  font-medium mt-[10px]" >{username}</a>
            }
            {
              editProfile === true && 
              <input className="flex items-center justify-center p-4 text-xl font-poppins bg-TitleDot/20 outline-none rounded-e-2xl rounded-xl  m-4" onChange={(e)=>{
                // change the input username in current state and check with the database
              
                setUsername(e.target.value)
              
              }}
              onKeyDown={(e)=>{
                if(e.key === "Enter"){
                  
                 setEditProfile(false);
                }
              }}
              />
            }
            
          </div>

          {/* editButton */} 
          <div className="flex w-full items-center justify-center" >
            <button
            className={`flex items-center justify-center w-[80px] h-[30px] mt-[10px] shadow-gray-950/30 shadow-xl  bg-[#f2f2f2]  dark:bg-[#5b5b5b]/80 rounded-full hover:scale-[1.2] transition-all  `}
            onClick={()=>{
              setEditProfile(!editProfile);
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
              router.push("/myElections")
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
      

      {/* Navbar */} 
      <div className="flex w-full items-center justify-center  dark:bg-[#2c2c2c]" >
        <NavBar2  className="absolute z-30 mt-[24px]"  navMenuOpen={navMenuOpen} setNavMenuOpen={setNavMenuOpen} button2Img='/search.png' setButton2State={setOpen} button2State={open} button3Img={">"} button3State={navMenuOpen} setButton3State={setNavMenuOpen}  />
      </div>
      
      {/* page parent container */}
      <div className="relative flex flex-col w-full h-full items-center justify-center p-[50px]  dark:bg-[#2c2c2c] " >
        
        <div className="grid grid-cols-[20%_80%] w-full h-full flex-row items-center gap-8 relative justify-start">

          

          {/* sub parent 1 : 20% container */}
          <div className="flex w-full h-full relative z-10">
            <WalletsCard   />
          </div>

          {/*sub parent 2 : 80% container */}
          <div className="grid-cols-[50%_50%] items-center justify-between w-full h-full gap-8 ">
              {/* row 1 */}
              <div className="flex w-full items-center justify-between h-full/50 " >
              
                  {/* card 1 : highlighted election */}
                  <div className="w-[62%] h-[350px] bg-[#d9d9d9]/60 rounded-[25px] flex flex-col  items-center justify-center relative z-10 " >
                    <div className={`flex w-full h-full absolute z-20 ${editDisplayElection?"blockz":"hidden"} bg-emerald-400/10 rounded-[25px]`} ></div>
                    <div className="absolute z-20 w-[97%] h-[95%] rounded-[20px]  grid grid-cols-[70%_25%] items-center justify-between " >
                      {/* staggering candidates shows top 3 */}
                      <AnimatePresence mode='wait'>
                        { editDisplay !== true && 
                        <motion.div 
                        key={"normal"}
                      variants={container}
                      initial="hidden"
                      animate="show"
                      
                      className="flex w-full h-full " >
                        
                        <motion.div 
                        variants={itemUp}
                        initial={"initial"}
                        animate={"show"}
                        exit={"exit"}
                        className="relative z-20 flex flex-col items-center justify-end  w-[25%] h-full bg-red-500/20 mx-1 rounded-bl-[20px] rounded-tl-[20px] " >
                          {/* picture */}
                          <Image className="absolute z-30 w-full h-full rounded-bl-[20px] rounded-tl-[20px]" src={""} alt={""} width={80} height={130} ></Image>
                          {/* score */}
                          <div className="flex items-center justify-center bg-TitleDot/60 rounded-full m-2" >
                           <a className="font-poppins text-6xl italic p-1" >1</a></div>
                         
                        </motion.div>
                        <motion.div 
                        variants={itemDown}
                        initial={"hidden"}
                        animate={"show"}
                        exit={"exit"}
                        className="relative z-20 flex flex-col items-center justify-end   w-[25%] h-full bg-red-500/20  mx-1" >
                          {/* picture */}
                          <Image className="absolute z-30 w-full h-full rounded-bl-[20px] rounded-tl-[20px]" src={""} alt={""} width={80} height={130} ></Image>
                          {/* score */}
                          <div className="flex items-center justify-center bg-TitleDot/60 rounded-full m-2" >
                           <a className="font-poppins text-6xl italic p-1" >2</a></div>
                        </motion.div>
                        <motion.div 
                        variants={itemUp}
                        initial={"initial"}
                        animate={"show"}
                        exit={"exit"}
                        className="relative z-20 flex flex-col items-center justify-end  w-[25%] h-full bg-red-500/20  mx-1" >
                          {/* picture */}
                          <Image className="absolute z-30 w-full h-full rounded-bl-[20px] rounded-tl-[20px]" src={""} alt={""} width={80} height={130} ></Image>
                          {/* score */}
                          <div className="flex items-center justify-center bg-TitleDot/60 rounded-full m-2" >
                           <a className="font-poppins text-6xl italic p-1" >3</a></div>
                        </motion.div>
                      </motion.div>}
                      {
                        editDisplay === true &&
                        <motion.div 
                        variants={editMenu}
                        initial={"hidden"}
                        animate={"show"}
                        exit={"exit"}
                        key={"edit"}
                        className="flex flex-col  overflow-y-scroll w-full h-full rounded-xl " >
                          {
                            elections.map((election)=><DisplayElectionCard id={election.id} title={election.name} selected={false} />)
                          }
                        </motion.div>
                      }
                      </AnimatePresence>
                      <div className="flex flex-row w-full h-full items-end justify-end" >
                        <div className="flex-col flex  justify-between w-full h-full   " >
                        <div className="flex flex-row items-center justify-end p-4" >
                          {/* swap button */}
                          <div className="flex w-[50px] h-[50px] rounded-full bg-[#d9d9d9] hover:bg-TitleDot/70" >
                            <button 
                              className="flex w-full h-full rounded-full"
                              onClick={()=>{ setEditDisplay(!editDisplay) }}
                            >
                              <Image src={"/swap.png"} alt={""} height={80} width={80} className="flex w-full h-full p-2" />
                            </button>
                          </div>
                        </div>
                        {/* election name */}
                        <div className="flex w-full items-center justify-center font-poppins text-4xl font-medium p-4">Election Title</div>
                      </div>
                      </div>
                      
                    </div>
                  </div> 
                 
                  {/* card 2 highlighted election*/}
                  <div className=" w-[35%] h-[350px] bg-[#d9d9d9]/60 rounded-[25px] flex flex-col  items-center justify-between " >
                    <div className="flex w-full items-center justify-between p-[24px]" >
                          {/* Text carousel */}
                          <a className=" w-[300px] font-poppins font-normal italic text-[16px] ">Press add button to create a new Election</a>
                          <motion.button 
                              onClick={()=>{
                                router.push("/createElectionPage")
                              }}
                              className="flex items-center justify-center rounded-full w-[80px] h-[80px] bg-[#fff6cc]/60 hover:bg-TitleDot/40 dark:bg-[#d9d9d9]/60 cursor-pointer hover:dark:bg-[#d9d9d9]" >
                                <Image src={"/addElec.png"} alt='' width={50} height={50} className="hover:scale-[1.1] flex w-full h-full items-center justify-center p-5" />
                              </motion.button>
                    </div>
                    <div className="flex w-full flex-row items-center p-[24px] justify-start" >
                          <a className="font-poppins font-bold italic text-[40px]" >Create Election</a>
                    </div>
                  </div>
              </div>

              {/* row 2 */}
              <div className="flex flex-row items-center justify-end" >
                <HostedElections2 title="Pinned Election's" description={`Election's you pinned as important`} width={"w-full"} height={"h-[350px]"} />
              </div>
       
              </div>
            </div> 
        
       
            
      </div>
    </div>
  )
}

export default page
