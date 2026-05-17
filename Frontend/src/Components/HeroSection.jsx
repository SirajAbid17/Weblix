import { motion } from "framer-motion";
import { FaPlay, FaBolt, FaCode, FaRocket } from "react-icons/fa";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

export default function HeroSection({ isDarkMode }) {  
 const navigate=useNavigate()
  return (
    <section className={`px-4 sm:px-6 overflow-hidden transition-colors duration-300 ${
      isDarkMode ? 'bg-[#040404] text-white' : 'bg-white text-black'
    }`}>

     
      <div className="mt-6 md:mt-20 flex items-center justify-center text-center">
        <div className="max-w-3xl mx-auto">

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight"
          >
            Build smarter with{" "}
            <span className={isDarkMode ? "text-white/70" : "text-black/70"}>
              AI that actually works
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
            Weblix AI gives your team the intelligence layer it needs —
            from automation to insights, deployed in minutes, not months.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 cursor-pointer"
          >
            <button onClick={()=>navigate('/dashboard')} className={`w-full cursor-pointer sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all ${
              isDarkMode 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}>
              Start for free
            </button>

          </motion.div>

        </div>
      </div>

      
      <div className="mt-12 sm:mt-16 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">

        {[{
          icon: <FaBolt />,
          title: "Instant Website Generation",
          desc: "Just type your prompt and Weblix AI instantly builds a complete modern website for you."
        },
        {
          icon: <FaCode />,
          title: "Full Code Control",
          desc: "Edit, customize and export clean production-ready code anytime you want."
        },
        {
          icon: <FaRocket />,
          title: "One Click Deploy",
          desc: "Deploy your website instantly on a single platform without any setup hassle."
        }].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`p-5 sm:p-6 rounded-2xl backdrop-blur-xl border transition-all ${
              isDarkMode 
                ? 'bg-white/5 border-white/10' 
                : 'bg-black/5 border-black/10'
            }`}
          >
            <div className={`text-lg mb-3 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {item.icon}
            </div>
            <h3 className="text-base sm:text-lg font-semibold">{item.title}</h3>
            <p className={`mt-2 text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {item.desc}
            </p>
          </motion.div>
        ))}

      </div>

  
      <section className="mt-16 sm:mt-24 max-w-5xl mx-auto">

        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold">
            How it works
          </h2>
          <p className={`mt-3 sm:mt-4 text-sm sm:text-base ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            From idea to live site in 3 steps.
          </p>
        </div>

     
        <div className={`mt-10 sm:mt-16 relative border-l ${
          isDarkMode ? 'border-white/10' : 'border-black/10'
        }`}>

          {[
            {
              color: "bg-purple-500",
              step: "01",
              title: "Describe your vision",
              desc: "Tell Weblix AI what you want — your brand, audience, and goals."
            },
            {
              color: "bg-blue-500",
              step: "02",
              title: "AI builds your site",
              desc: "In seconds, Weblix generates a fully designed, responsive website."
            },
            {
              color: "bg-green-500",
              step: "03",
              title: "Customize & deploy",
              desc: "Fine-tune your site and deploy with one click."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="mb-10 sm:mb-12 ml-6"
            >
              <div className={`absolute -left-3 w-5 h-5 sm:w-6 sm:h-6 ${item.color} rounded-full`} />

              <div className={`p-5 sm:p-6 rounded-xl backdrop-blur-xl border transition-all ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-black/5 border-black/10'
              }`}>
                <h3 className={`text-xs sm:text-sm font-semibold ${
                  isDarkMode ? 'text-white/70' : 'text-black/70'
                }`}>
                  {item.step}
                </h3>
                <h4 className="text-base sm:text-lg font-bold mt-1">
                  {item.title}
                </h4>
                <p className={`mt-2 text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}

        </div>

      </section>

      <div className="mb-16 sm:mb-20" />

  
    </section>
  );
}