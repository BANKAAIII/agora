import React from 'react'
import { dynamicInputInterface } from '../utils/dynamicInput'

const DynamicInput = (props:dynamicInputInterface) => {
  return (
    <div className={`${props.className} rounded-3xl p-3 `} >
      <input type={props.type} placeholder={props.placeholder} value={props.value} className="w-full h-full outline-none bg-transparent " onChange={(e)=> props.onChange?.(e.target.value)}/>
    </div>
  )
}

export default DynamicInput
