"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import metaMask from  "../../public/metaMask.png";
import aossie from "../../public/aossie.png";
import Gmail from "../../public/gmail2.png"
import x from "../../public/twitter 2.png"

const images = [
  aossie,
  Gmail,
  x,
];

const MotionImage = motion(Image);

const slideVariants = {
  enter: {
    x: "100%",
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: "-100%",
    opacity: 0,
  },
};

export default function HorizontalSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[420px] h-[260px] overflow-hidden rounded-xl ">
      <AnimatePresence mode="wait">
        <MotionImage
          key={index}
          src={images[index]}
          alt="loading image"
          className="absolute w-full h-full object-cover p-2 "
          fill
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 260, damping: 30 },
            opacity: { duration: 0.3 },
          }}
        />
      </AnimatePresence>
    </div>
  );
}