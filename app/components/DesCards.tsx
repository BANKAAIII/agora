import React from 'react'
import { DesCardsInterface } from '../utils/DesCardsInterface';

const DesCards = ({title,subTitle}:DesCardsInterface) => {
  return <div className="w-[417px] h-[545px] rounded-[40px] bg-amber-300/30 m-10 flex  items-center justify-center" >
      <div className="w-[341px] h-[481px] rounded-[32px] bg-amber-300/50 flex flex-col p-[35px] items-center justify-center " >
        {/* title */}
        <h1 className="font-OpenSans text-[36px] font-medium italic" >{title}</h1>
        {/* description */}
        <h1 className="font-OpenSans italic font-light text-[24px] mt-[12px]" >{subTitle}</h1>
      </div>
    </div>
}

export default DesCards;
