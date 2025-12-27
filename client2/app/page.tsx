"use client";

import { useRef } from "react";
import Section1 from "./sections/landingPage/section1";
import Section2 from "./sections/landingPage/section2";
import Section3 from "./sections/landingPage/section3";
import Footer from "./components/Footer";

export default function Home() {
  const section3Ref = useRef<HTMLDivElement | null>(null);

  const scrollToSection3 = () => {
    console.log("CLICKED: scrolling to section3");
    section3Ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <Section1 scrollToSection={scrollToSection3} />
      <Section2 />
      <div ref={section3Ref}>
        <Section3 />
      </div>
      <Footer />
    </>
  );
}
