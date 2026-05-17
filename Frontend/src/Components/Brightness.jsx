import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";

export default function Brightness({ isDarkMode, setIsDarkMode }) {
  const [isHovered, setIsHovered] = useState(false);
  const [ripple, setRipple] = useState(false);

  const toggleBrightness = () => {
    setRipple(true);
    setTimeout(() => setRipple(false), 500);

    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    
   
    if (newMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === null ? true : savedTheme === "dark";
    if (isDark !== isDarkMode) {
      setIsDarkMode(isDark);
    }
   
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
  }, []);

  return (
    <div className="relative">
      <AnimatePresence>
        {ripple && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute w-10 h-10 rounded-full bg-white/20 pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleBrightness}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative flex items-center gap-2 px-3 py-2.5 rounded-xl 
          backdrop-blur-md border text-sm cursor-pointer 
          transition-all duration-300 overflow-hidden
          ${
            isDarkMode
              ? "bg-white/5 border-white/10 hover:bg-white/10"
              : "bg-black/5 border-black/10 hover:bg-black/10"
          }
        `}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        <motion.div
          className={`absolute inset-0 rounded-xl ${
            isDarkMode ? "bg-white/5" : "bg-black/5"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />

        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: isDarkMode ? 0 : 360 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 180 }}
        >
          {isDarkMode ? (
            <FaSun className="text-yellow-300 text-sm sm:text-base drop-shadow" />
          ) : (
            <FaMoon className="text-indigo-400 text-sm sm:text-base drop-shadow" />
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.span
            key={isDarkMode ? "light" : "dark"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:inline text-xs sm:text-sm font-medium"
          >
            {isDarkMode ? "Light" : "Dark"}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}