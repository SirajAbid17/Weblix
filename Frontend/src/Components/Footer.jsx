import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub, FaInstagram, FaFacebook } from "react-icons/fa";

export default function Footer({ isDarkMode }) {
  const currentYear = new Date().getFullYear();

  const iconClass = `w-[30px] h-[30px] rounded-full flex items-center justify-center transition-all ${
    isDarkMode
      ? "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-purple-500/20 hover:border-purple-400"
      : "bg-black/5 border border-black/10 text-gray-600 hover:text-black hover:bg-purple-200/50 hover:border-purple-400"
  }`;

  return (
    <footer
      className={`border-t transition-colors duration-300 ${
        isDarkMode ? "bg-[#040404] border-white/10" : "bg-white border-black/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          
         
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
            <span
              className={`text-base font-bold bg-linear-to-r bg-clip-text text-transparent ${
                isDarkMode
                  ? "from-white via-purple-200 to-blue-200"
                  : "from-black via-gray-500 to-gray-600"
              }`}
            >
              Weblix AI
            </span>
          </motion.div>

        
          <div className="flex flex-wrap justify-center gap-5 text-xs">
            <Link
              to="/about"
              className={`transition ${
                isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              About
            </Link>

            <Link
              to="/pricing"
              className={`transition ${
                isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Pricing
            </Link>

            <Link
              to="/contact"
              className={`transition ${
                isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Contact
            </Link>

           
          </div>

        
          <div className="flex gap-3">
            <motion.a whileHover={{ scale: 1.15, y: -2 }} className={iconClass} href="#">
              <FaLinkedin />
            </motion.a>

            <motion.a whileHover={{ scale: 1.15, y: -2 }} className={iconClass} href="#">
              <FaGithub />
            </motion.a>

            <motion.a whileHover={{ scale: 1.15, y: -2 }} className={iconClass} href="#">
              <FaInstagram />
            </motion.a>

            <motion.a whileHover={{ scale: 1.15, y: -2 }} className={iconClass} href="#">
              <FaFacebook />
            </motion.a>
          </div>
        </div>

        <div
          className={`mt-4 pt-3 border-t text-center transition-colors ${
            isDarkMode ? "border-white/5" : "border-black/5"
          }`}
        >
          <p className={`text-[11px] ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
            © {currentYear} Weblix AI — Made with{" "}
            <span className="text-purple-400">❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
}