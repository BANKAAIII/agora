import { useState } from 'react'
import { hostedElectionInterface } from '../utils/hostedElectionInterface'
import MiniCards from './miniCards';

const HostedElections2 = ({width,height,title,description}:hostedElectionInterface) => {


   const [hoverState,setHoverState] = useState(false);

   // hardcoded mini cards
   const pinnedElections = [
      { 
         id:1,
         name:"Election 1",
         description:"description 1",
         status:false,
         hoverState:hoverState,
         onHoverEnter:()=>{setHoverState(true)},
         onHoverLeave:()=>{setHoverState(false)}
      },
      { 
         id:2,
         name:"Election 2",
         description:"description 2",
         status:false,
         hoverState:hoverState,
         onHoverEnter:()=>{setHoverState(true)},
         onHoverLeave:()=>{setHoverState(false)}
      },
      { 
         id:3,
         name:"Election 3",
         description:"description 3",
         status:false,
         hoverState:hoverState,
         onHoverEnter:()=>{setHoverState(true)},
         onHoverLeave:()=>{setHoverState(false)}
      },
      { 
         id:4,
         name:"Election 4",
         description:"description 4",
         status:false,
         hoverState:hoverState,
         onHoverEnter:()=>{setHoverState(true)},
         onHoverLeave:()=>{setHoverState(false)}
      }
   ]

  return <div className={`${width} ${height} bg-[#d9d9d9]/60 rounded-[25px] flex flex-row  items-center justify-between pr-[24px] mt-8 `} >
     {/* part 1 */}
     <div className="flex w-full h-full rounded-[25px] items-start p-[24px] justify-between flex-col " >
        <a className=" w-[300px] font-poppins font-normal italic text-[16px] ">{description}</a>
        <a className="font-poppins font-bold italic text-[40px]" >{title}</a>
     </div>
     {/* part 2 */}
     <div className="flex  w-full h-full rounded-[25px] items-center justify-end" >
        {/* container div */}
        <div className="flex w-[90%] h-[85%]  justify-end gap-x-[9px]" >
          { 
            pinnedElections.map( (election)=> <MiniCards key={election.id} title={election.name} description={election.description}  status={election.status}  /> )
          }
          </div>
     </div>
    
    </div>
}

export default HostedElections2;
