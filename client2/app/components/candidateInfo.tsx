import React from 'react'
import { candidateInfoInterface } from '../utils/candidateInfoInterface'

const CandidateInfo = ({name,description,totalCandidates,imageUrl,votesReceived}:candidateInfoInterface) => {
    // total candidates for determining the size of the component required.
    // screen widths  : small- 640px , medium-768px , large-1024px , xl-1280px , 2xl-1536px

    // component width : 
    // 2 Candidates = per component width = 25%
    // 3 Candidates = per component width = 20%
    // 4 Candidates = per component width = 15%
    // 5 and more Candidates = rectangle expandable component .

    const candidateCount = totalCandidates;
    const componentWidth = candidateCount === 2 ? 'w-[45%]' : candidateCount === 3 ? 'w-[20%]' : candidateCount === 4 ? 'w-[15%]' : 'w-[12%]';


  return (
  <div className="flex flex-col w-full items-center justify-center " >
     {/* Image */}
        <div className={`flex flex-col items-center justify-center ${componentWidth} aspect-square bg-TitleDot/20 rounded-xl`} >
        </div>
     
     {/* Name & description*/}
     <div className={`flex ${componentWidth} font-2xl font-poppins items-center justify-center p-4 flex-col `} >
        <a>{name}</a>
        <div className={`flex w-full flex-row ${componentWidth} rounded-2xl text-xl font-inter items-center justify-center p-8 bg-TitleDot/20 mt-4 `} >{description}</div>
        <div className="flex items-center justify-center" ></div>
     </div>
     
     {/* Vote button */}
   </div>
  )
}

export default CandidateInfo;
