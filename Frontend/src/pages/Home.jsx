import { useState, useEffect } from "react";
import HeroSection from "../Components/HeroSection";
import LoginPopup from "../Components/LoginPopup";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function Home() {
  const [openlogin, setlogin] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === null ? true : savedTheme === 'dark';
  });


  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  
  useEffect(() => {
    const handleStorageChange = () => {
      const savedTheme = localStorage.getItem('theme');
      setIsDarkMode(savedTheme === null ? true : savedTheme === 'dark');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
      isDarkMode ? 'bg-[#040404] text-white' : 'bg-white text-black'
    }`}>
      <Header 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        onLoginClick={() => setlogin(true)}
      />
      
      <div className="pt-20">
        <HeroSection isDarkMode={isDarkMode} />
      </div>

      <Footer isDarkMode={isDarkMode} />

      {openlogin && (
        <LoginPopup open={openlogin} onClose={() => setlogin(false)} />
      )}
    </div>
  );
}