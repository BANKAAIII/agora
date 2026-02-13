import React, { useState } from 'react'

import {elections} from "../zustandStore/hardcodedStore";
import { electionInterface } from '../zustandStore/newStore';

interface DisplayElectionCardInterface{
    title:string;
    selected?:boolean
    id?:string
}

const DisplayElectionCard = ({id,title}:DisplayElectionCardInterface) => {
    const [electionsState,setElectionsState] = useState(elections);
    const [selected,setSelected] = useState(false);
  return (
    <div className="flex flex-row items-center justify-between text-2xl w-[70%] min-h-[100px] m-2 rounded-xl bg-amber-50/60 p-3"  >
        <div className="" >{title}</div>
        <div><button 
                className={`flex w-[50px] h-[50px] rounded-full ${selected?"bg-amber-950/70": "bg-amber-50 "}`}
                onClick={()=>{ 
                    setSelected(!selected);
                    
                }}
                ></button></div>
    </div>
  )
}

export default DisplayElectionCard
