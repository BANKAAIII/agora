import React from 'react'

interface candidateInterface{
    name:string;
    rank:number;
}

const Candidate = ({name , rank}:candidateInterface) => {
  return (
    <div className="flex w-full h-[10%] flex-row gap-3 pl-[3%] " >
            <div className='flex h-full  aspect-square rounded-full font-inter justify-center bg-TitleDot/20 items-center font-inter' >{rank}</div>
            <div className="flex w-[60%] h-full rounded-xl bg-amber-300/50 items-center p-4" >
      {name}
    </div>
    </div>

  )
}

export default Candidate
