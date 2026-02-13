"use client"

import React from 'react'
import { addCandidateCompInterface } from '../utils/addCandidate'
import {motion} from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence } from 'framer-motion'
import { useRef } from 'react'

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
    image:File | null
}

function payloadCheck(payload:payloadInterface) : boolean {
   const check =  payload.name !== "" && payload.description !== "" &&payload.image !== null ?  
    true : false;

    return check;
}

const AddCandidatePfp = ({name,className,description,complete,id,stage,deletingMode}:addCandidateCompInterface) => {

    const [payloadComplete,setPayloadComplete] = useState<boolean>(false);
    const [payload,setPayload] = useState<payloadInterface>({
        name:"",
        description:"",
        image: null
    });

    const [deleteCard,setDeleteCard] = useState(false);
    const [editMode,setEditMode] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [img,setImg] = useState<File|null>(null);
  return (
    <motion.div 
    key={stage}
    variants={cardVariants}
    initial="initial"
    animate="acitve"
    exit="deleted"
    transition={{type:"spring",stiffness:100,damping:20,duration:0.5}}
    className={`flex flex-none w-[85%] h-[150px] rounded-2xl bg-amber-50/70 flex-row items-center justify-between p-4`}
    >
        <div className="flex flex-row w-full items-center justify-start h-full " >
            <div className='flex h-full aspect-square rounded-tl-2xl rounded-bl-2xl bg-TitleDot items-center justify-center' >
                <button 
                className="flex items-center justify-center h-[60%] aspect-square rounded-full bg-amber-50/30"
                onClick={()=>{fileInputRef.current?.click()}} 
                 >
                    <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setImg(file);
                // here save the file in the local state payload
            }}
          />
                <Image src={"/plus.png"} alt={""} className="p-3 flex w-[80%] h-[80%]" width={90} height={90} /></button>
            </div>
            <div className="flex flex-col w-full h-full items-center justify-between  " >
                <div className="flex w-full h-[50%]" >
                <a className="flex flex-row items-center justify-center w-full h-full rounded-tr-2xl bg-TitleDot/40" >candidate</a></div>
                <div className="flex flex-row w-full h-[50%] bg-red-500/20 rounded-br-2xl items-center justify-end p-2" >
                <div className="flex h-full aspect-square bg-TitleDot/10 items-center justify-center" >
                    {
                    deletingMode === true &&
                    <div className="flex flex-row gap-3 h-[80%] aspect-square rounded-full bg-amber-50 items-center justify-center"
                    onClick={()=>{setDeleteCard(!deleteCard)}}
                    >
                        {
                            deleteCard === true && <div
                                className={`flex w-full h-full rounded-full ${ deletingMode === true && deleteCard === true ? "bg-red-500 ":"bg-amber-50"}`}
                            >
                                </div>
                        }
                        
                        </div>
                        
                }
                </div>
                <div className="flex h-full aspect-square bg-TitleDot/10 items-center justify-center" >
                {
                    img &&
                    <button className="flex h-[80%] aspect-square rounded-full items-center bg-amber-50 justify-center"
                    onClick={()=>{fileInputRef.current?.click()}} 
                     >
                        <Image src={"/swap.png"} alt='' width={60} height={60} className='flex w-full h-full p-2' />

                    </button>
                }
                    
                </div>
                
                </div>
            </div>
        </div>
    </motion.div>
  )
}

export default AddCandidatePfp;
