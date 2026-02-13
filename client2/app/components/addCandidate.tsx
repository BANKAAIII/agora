"use client"

import React from 'react'
import { addCandidateCompInterface } from '../utils/addCandidate'
import {motion} from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence } from 'framer-motion'

const cardVariants={
    initial:{
        x:-50,
        opacity:0,
    },
    acitve:{
        x:0,
        opacity:1
    },
    deleted:{
        opacity:0,
        scale:0.7
    }
}
interface payloadInterface{
    name:string;
    description:string;
}
function payloadCheck(payload:payloadInterface) : boolean {
   const check =  payload.name !== "" && payload.description !== "" ?  
    true : false;
    return check;
}

const AddCandidate = ({name,className,description,complete,id,stage,key,deletingMode}:addCandidateCompInterface) => {
    const [hover,setHover] = React.useState(false);

    const [cardDelete,setCardDelete] = useState(false); 
    const [payloadComplete,setPayloadComplete] = useState<boolean>(false);
    const [payload,setPayload] = useState<payloadInterface>({
        name:"",
        description:""
    });

    
  return (
    <motion.div 
    key={stage}
    variants={cardVariants}
    initial="initial"
    animate="acitve"
    exit="deleted"
    transition={{type:"spring",stiffness:100,damping:20,duration:0.5}}
    className={`flex w-[85%] ${hover? "h-[180px]":"h-[80px]"} rounded-2xl ${deletingMode?"bg-amber-50/40":"bg-amber-50/70"} flex-row items-center justify-between p-4`}
    onMouseEnter={()=>   setHover(true)}
    onMouseLeave={()=>   setHover(false)}
    >
        
            <motion.div 
            className="flex flex-col items-center justify-start space-y-4 "
             >
           <div className="flex flex-row items-center justify-between w-full gap-4 " >
            <div className="flex flex-row gap-2" >
                <div className="w-[30px] aspect-square rounded-full bg-amber-50 font-poppins flex items-center justify-center" >{id}</div>
                <input 
                    type="text" 
                    placeholder="Name" 
                    className="flex rounded-md w-[50%] outline-none  bg-amber-50 placeholder:font-poppins  placeholder:text-xl p-2 font-poppins text-xl "
                    onChange={(e)=>{
                        setPayload({
                            ...payload,
                            name:e.target.value
                        });
                        payloadCheck(payload) ? setPayloadComplete(true) : setPayloadComplete(false);
                    }
                    
                }
                    />
            </div>
                
                <button 
                onClick={()=>{
                    if(deletingMode !== true) return;
                    setCardDelete((prev)=>!prev)
                }}
                className={`flex w-[15%] aspect-square rounded-full ${cardDelete === true ? "bg-red-500":payloadComplete? "bg-green-500" : "bg-amber-50"} `} >
                    {/* done icon */}
                    {payloadComplete &&
                    <motion.div>
                        <Image src={cardDelete ? "/delete.png":"/tick.png" } alt={""} width={40} height={40} className="p-2 w-full h-full flex" ></Image>
                        </motion.div>}
                </button>
            </div>
            { hover &&
            <div className="flex flex-row items-center justify-between w-full gap-4 " >
                <input type="text" value={payload.description} placeholder="description" className="flex rounded-md w-[80%] h-[80px] outline-none  bg-amber-50 placeholder:font-poppins  placeholder:text-xl p-2 font-poppins text-xl " 
                    onChange={(e)=>{
                        setPayload({
                            ...payload,
                            description:e.target.value
                        });
                        payloadCheck(payload) ? setPayloadComplete(true) : setPayloadComplete(false);
                    }
                    
                }
                />
                
            </div>}
        </motion.div>
        
      
    </motion.div>
  )
}

export default AddCandidate
