"use client"
import { useMemo, useRef } from "react";
import {  motion, useInView } from "framer-motion";

export default function Sprinkler({ count = 40 }) {
  const colors = ["#FDE047", "#FB7185", "#60A5FA", "#34D399", "#F97316"];
   const cardRef = useRef(null);
    const isVisible = useInView(cardRef,{once:true});

  const particles = useMemo(() => {

   

    return Array.from({ length: count }).map(() => {
      const x = (Math.random() - 0.5) * 1300;   // wider spread
      const y = (Math.random() - 0.5) * 1000;   // taller spread
      const delay = Math.random() * 0.2;
      const scale = Math.random() * 2 + 0.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      return { x, y, delay, scale, color };
    });
  }, [count]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" ref={cardRef} >
      { isVisible && particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: "8px",
            height: "8px",
            backgroundColor: p.color,
          }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ opacity: 0, x: p.x, y: p.y, scale: p.scale }}
          transition={{ duration: 3, ease: "easeOut", delay: p.delay }}
        />
      ))}
    </div>
  );
}
