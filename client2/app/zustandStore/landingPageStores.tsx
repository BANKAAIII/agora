import { create } from "zustand";

type ScrollStore = {
  activeSection: string;
  setActiveSection: (sectionId: string) => void;
  scrollToSection: (sectionId: string) => void;
};

export const useScrollStore = create<ScrollStore>((set) => ({
  activeSection: "section1",

  setActiveSection: (id) =>
    set({ activeSection: id }),

  scrollToSection: (id) => {
    console.log("Scrolling to section:", id);
    const currentSection = document.getElementById(id);
    if (!currentSection) {
      console.warn("useScrollStore: section not found", id);
      return;
    }

    currentSection.scrollIntoView({
      behavior: "smooth",
     
    });

   
    set({ activeSection: id });
  },
}));


export default useScrollStore;