"use client"

import NavBar2 from '../components/navbar2'
import {useState} from 'react';
import { useTheme } from '../themeProvider';
import {easeInOut, motion} from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import {Toggle} from '../components/toggle';
import ElectionsSearchBar from '../components/electionsSearchBar';
import ElectionCard from '../components/ElectionCard';
import { useRouter } from 'next/navigation';


const page = () => {

     const [DarkMode , setDarkMode] = useState(false);
     const [statusfilter,setStatusFilter] = useState(false);
     const [participatedFilter,setParticipatedfilter] = useState(false);
        const router = useRouter();

      // hardcoding for now

      const ElectionsData =[
        {
          id:1,
          title:"election 1",
          description:"description 1",
          status:"ongoing",
          pinned:true,
          bookmarked:false,
          participated:false
        },
        {
          id:2,
          title:"election 2",
          description:"description 2",
          status:"ongoing",
          pinned:true,
          bookmarked:false,
          participated:false
        },
        {
          id:3,
          title:"election 3",
          description:"description 3",
          status:"ongoing",
          pinned:true,
          bookmarked:false,
          participated:false
        },
        {
          id:4,
          title:"election 4",
          description:"description 4",
          status:"ongoing",
          pinned:true,
          bookmarked:false,
          participated:false
        },
        {
          id:5,
          title:"election 5",
          description:"description 5",
          status:"upcoming",
          pinned:true,
          bookmarked:false,
          participated:false
        },
        {
          id:6,
          title:"election 6",
          description:"description 6",
          status:"upcoming",
          pinned:true,
          bookmarked:false,
          participated:false
        }
      ]

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
    

  return (
    <div className="flex flex-col w-full h-screen dark:bg-[#2c2c2c]" >

      {/* sliding menu */}
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
            <button className="w-[70%] h-[20%] rounded-[20px] bg-[#d9d9d9]/60 m-[10px] flex items-center justify-start pl-[10%] p-[10px]  " >
            History
            </button>
            <button className="w-[70%] h-[20%] rounded-[20px] bg-[#d9d9d9]/60 m-[10px] flex items-center justify-start pl-[10%] p-[10px]  " >
            MyElections
            </button>
          </div> 

          {/* day Night mode button */}
          <div className="relative z-10 flex flex-row items-center justify-center w-full h-[10%]  text-md font-poppins" >
            <a className="" >Day</a>
            <div className="  w-[100px] h-[50px] bg-[#f2f2f2]  dark:bg-[#2c2c2c] ml-2 mr-2 rounded-full flex items-center " >
              <span className="relative z-20 flex flex-row h-full w-full text-2xl items-center ml-2 mr-2 justify-between" >
                <div>☀️</div>
                <div>🌙</div>
              </span>
              <Toggle className={` absolute z-30 h-[90%] aspect-square rounded-full bg-amber-700/20 ${DarkMode? `translate-x-[118%]`:`translate-x-0`}` } onClick={()=>{ setDarkMode(!DarkMode); toggleTheme()}} ></Toggle>
            </div>
            <a  >Night</a>
          </div>
          </div>
        </motion.div>
}
      </AnimatePresence>

      {/* Nav Bar */}
      <div className="flex w-full items-center justify-center items-center  dark:bg-[#2c2c2c]" >
        <NavBar2 className="absolute z-30 mt-[24px]" navMenuOpen={navMenuOpen} setNavMenuOpen={setNavMenuOpen} />
      </div>



        <div className=" flex w-full h-[70%] items-center justify-center dark:bg-[#2c2c2c]" >
           
        </div>

    </div>
  )
}

export default page
