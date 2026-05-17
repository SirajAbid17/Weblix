import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaRobot, FaUsers, FaShieldAlt, FaGlobe, FaCode, FaRocket,
  FaArrowRight, FaCheckCircle, FaHeart, FaStar
} from "react-icons/fa";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import LoginPopup from "../Components/LoginPopup";

export default function About() {
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
    <div className={`relative min-h-screen overflow-x-hidden transition-colors duration-300 ${
      isDarkMode ? 'bg-[#040404] text-white' : 'bg-white text-black'
    }`}>
      <Header 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        onLoginClick={() => setlogin(true)}
      />
      
      <div className="pt-20">
     
        <div className="px-4 sm:px-6 overflow-hidden">
          <div className="mt-6 md:mt-20 flex items-center justify-center text-center">
            <div className="max-w-3xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight"
              >
                About{" "}
                <span className={isDarkMode ? "text-white/70" : "text-black/70"}>
                  Weblix AI
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`mt-4 sm:mt-5 text-sm sm:text-base ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                We're on a mission to revolutionize how websites are built — 
                making AI-powered development accessible to everyone.
              </motion.p>
            </div>
          </div>

        
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`mt-12 sm:mt-16 max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl backdrop-blur-xl border transition-all ${
              isDarkMode 
                ? 'bg-white/5 border-white/10' 
                : 'bg-black/5 border-black/10'
            }`}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4">
              Our Mission
            </h2>
            <p className={`text-sm sm:text-base text-center leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              At Weblix AI, we believe that creating a professional website should be fast, 
              intuitive, and accessible to everyone — not just developers. Our AI-powered 
              platform transforms your ideas into stunning, production-ready websites in seconds, 
              democratizing web development for the modern era.
            </p>
          </motion.div>

       
          <div className="mt-12 sm:mt-16 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { number: "10K+", label: "Websites Created", icon: <FaCode /> },
              { number: "50K+", label: "Happy Users", icon: <FaUsers /> },
              { number: "99.9%", label: "Uptime Guarantee", icon: <FaShieldAlt /> },
              { number: "24/7", label: "Support Available", icon: <FaHeart /> }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`text-center p-4 sm:p-5 rounded-xl backdrop-blur-xl border transition-all ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                    : 'bg-black/5 border-black/10 hover:bg-black/10'
                }`}
              >
                <div className={`text-2xl sm:text-3xl mb-3 flex justify-center ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {stat.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  {stat.number}
                </h3>
                <p className={`text-xs sm:text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

        
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`mt-12 sm:mt-16 max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl backdrop-blur-xl border transition-all ${
              isDarkMode 
                ? 'bg-white/5 border-white/10' 
                : 'bg-black/5 border-black/10'
            }`}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4">
              Our Story
            </h2>
            <div className={`space-y-4 text-sm sm:text-base leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <p>
                Founded in 2023, Weblix AI started with a simple idea: what if anyone could create a professional website 
                just by describing what they want? Our team of AI researchers, developers, and designers came together 
                to make this vision a reality.
              </p>
              <p>
                Today, we're proud to help thousands of entrepreneurs, creators, and businesses bring their ideas to life 
                without writing a single line of code. But we're just getting started. We're constantly innovating to make 
                web development even more accessible, powerful, and delightful.
              </p>
            </div>
          </motion.div>

          
          <div className="mt-12 sm:mt-16 max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">
              Our Values
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  icon: <FaRobot />,
                  title: "Innovation First",
                  desc: "We constantly push boundaries to bring you cutting-edge AI technology.",
                  color: "text-purple-500"
                },
                {
                  icon: <FaUsers />,
                  title: "User-Centric",
                  desc: "Every feature is designed with our users' needs and experience in mind.",
                  color: "text-blue-500"
                },
                {
                  icon: <FaShieldAlt />,
                  title: "Security & Privacy",
                  desc: "Your data and code are protected with enterprise-grade security.",
                  color: "text-green-500"
                },
                {
                  icon: <FaGlobe />,
                  title: "Accessibility",
                  desc: "Making web development accessible to everyone, everywhere.",
                  color: "text-yellow-500"
                },
                {
                  icon: <FaCode />,
                  title: "Quality Code",
                  desc: "We deliver clean, production-ready code that follows best practices.",
                  color: "text-red-500"
                },
                {
                  icon: <FaRocket />,
                  title: "Fast Execution",
                  desc: "From idea to deployment in minutes, not weeks or months.",
                  color: "text-pink-500"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-5 sm:p-6 rounded-2xl backdrop-blur-xl border transition-all cursor-pointer ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                      : 'bg-black/5 border-black/10 hover:bg-black/10'
                  }`}
                >
                  <div className={`text-3xl mb-3 ${item.color}`}>
                    {item.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        

         
     
       <div className="mt-5"></div>
        </div>
      </div>

      <Footer isDarkMode={isDarkMode} />

      {openlogin && (
        <LoginPopup open={openlogin} onClose={() => setlogin(false)} />
      )}
    </div>
  );
}