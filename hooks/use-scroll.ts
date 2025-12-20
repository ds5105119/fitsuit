import { useEffect, useState } from "react";

export function useScroll(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => {
      // Check if page is scrollable enough to matter, or just check scrollY
      const isScrolled = window.scrollY > threshold;
      setScrolled(isScrolled);
    };

    updateScrolled();
    window.addEventListener("scroll", updateScrolled);
    window.addEventListener("resize", updateScrolled);

    return () => {
      window.removeEventListener("scroll", updateScrolled);
      window.removeEventListener("resize", updateScrolled);
    };
  }, [threshold]);

  return scrolled;
}
