"use client";
import Section1 from "./sections/landingPage/section1";
import Section2 from "./sections/landingPage/section2";
import Section3 from "./sections/landingPage/section3";
import Footer from "./components/Footer";

export default function Home() {

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };
  
  return <>
    <div id="section1" ><Section1 scrollToSection={scrollToSection} /></div>
    <div id="section2" ><Section2/></div>
    <div id="section3" ><Section3/></div>
    <Footer/>
    </>
  
}
