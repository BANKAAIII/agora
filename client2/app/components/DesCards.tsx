"use client"

import React from 'react'
import { motion } from "framer-motion"
import { easeIn } from "framer-motion"
import { DesCardsInterface } from '../utils/DesCardsInterface'

const scrollVariants = {
  hidden: {
    opacity: 0,
    y: 40
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeIn
    }
  }
}

const DesCards = ({ title, subTitle }:DesCardsInterface) => {
  return (
    <motion.div
      variants={scrollVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{
        scale: 1.04,
        boxShadow: "0px 12px 28px rgba(0,0,0,0.20)"
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="min-w-[250px] max-w-[417px] max-h-[525px] min-h-[340px] rounded-[40px] bg-[#D9D9D9]/35 xl:m-10 flex items-center justify-center hover:bg-TitleDot/35 hover:dark:bg-TitleDot/60"
    >
      <motion.div
        whileHover={{ scale: 1.03  }}
        transition={{ duration: 0.25 }}
        className="min-w-[190px] min-h-[300px] max-w-[341px] max-h-[481px] rounded-[32px] bg-[#d9d9d9]/60 flex flex-col p-[40px] xl:p-[35px] m-[10px] xl:m-[41px] items-center justify-center hover:bg-TitleDot/50 hover:dark:bg-TitleDot/80"
      >
        <h1 className="font-OpenSans text-[18px] xl:text-[34px] font-medium italic mt-[20px] xl:mt-[62px]">
          {title}
        </h1>
        <h1 className="font-OpenSans italic font-light text-[12px] xl:text-[22px] mt-[12px] mb-[40px] xl:mb-[101px]">
          {subTitle}
        </h1>
      </motion.div>
    </motion.div>
  )
}

export default DesCards
