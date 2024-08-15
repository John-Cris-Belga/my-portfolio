import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

const VisibilityContext = createContext();

export const VisibilityProvider = ({ children }) => {
  const [inViewStates, setInViewStates] = useState({});
  const [activeSection, setActiveSection] = useState(null);
  const [previousActiveSection, setPreviousActiveSection] = useState(null);

  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibilityStates = {};
        let mostVisibleSection = null;
        let maxVisibilityRatio = 0;

        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          const { top, height } = entry.boundingClientRect;
          const intersectionRatio = entry.intersectionRatio;

          // Update visibility states
          visibilityStates[sectionId] = intersectionRatio;

          // Consider the section for being most visible if its intersectionRatio is above a threshold
          if (intersectionRatio > 0.2) {
            // Only consider sections with more than 10% visibility
            // Calculate visibility ratio adjusted for its size and distance from the top
            const distanceFromTop = Math.abs(top);
            const adjustedVisibility =
              intersectionRatio * (1 / (distanceFromTop + height));

            if (adjustedVisibility > maxVisibilityRatio) {
              maxVisibilityRatio = adjustedVisibility;
              mostVisibleSection = sectionId;
            }
          }
        });

        // Determine the active section
        const newActiveSection = mostVisibleSection || previousActiveSection;

        setInViewStates(visibilityStates);
        setActiveSection(newActiveSection);

        // Update previous active section if it changes
        if (newActiveSection !== activeSection) {
          setPreviousActiveSection(newActiveSection);
        }
      },
      { rootMargin: "0px 0px -30% 0px", threshold: [0, 0, 0.3, 1] } // Adjust thresholds as needed
    );

    Object.values(sectionRefs.current).forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      Object.values(sectionRefs.current).forEach((element) => {
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [activeSection, previousActiveSection]);

  const registerRef = (id, ref) => {
    sectionRefs.current[id] = ref.current;
  };

  return (
    <VisibilityContext.Provider
      value={{ inViewStates, registerRef, activeSection }}
    >
      {children}
    </VisibilityContext.Provider>
  );
};

export const useVisibility = () => useContext(VisibilityContext);
