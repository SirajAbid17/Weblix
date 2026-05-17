import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";

import Header from "../Components/Header";
import Footer from "../Components/Footer";
import LoginPopup from "../Components/LoginPopup";

export default function Contact() {
  const [openlogin, setlogin] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === null ? true : savedTheme === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const contactItems = [
    {
      icon: <FaEnvelope />,
      title: "Email",
      value: "sirajabid641@gmail.com",
      link: "sirajabid641@gmail.com",
      color: "text-purple-500",
    },
    {
      icon: <FaWhatsapp />,
      title: "WhatsApp",
      value: "+92 328 7303593",
      link: "https://wa.me/923287303593",
      color: "text-green-500",
    },
    {
      icon: <FaPhone />,
      title: "Phone",
      value: "+92 328 7303593",
      link: "tel:+923287303593",
      color: "text-blue-500",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Location",
      value: "Muzaffargarh, Pakistan",
      link: <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.9802249039103!2d71.18138437390715!3d30.06610131754725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x393ad7f9b41ec373%3A0x66c11abdddd2132b!2sIdeal%20Science%20Academy%20%26%20Ideal%20Degree%20College!5e0!3m2!1sen!2s!4v1779008734585!5m2!1sen!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>,
      color: "text-red-500",
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-[#040404] text-white" : "bg-white text-black"
      }`}
    >
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onLoginClick={() => setlogin(true)}
      />

     
      <div className="pt-28 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-6xl font-bold"
        >
          Get in{" "}
          <span className={isDarkMode ? "text-white/70" : "text-black/70"}>
            Touch
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
          className={`mt-4 max-w-xl mx-auto ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Feel free to contact us anytime. We’re always here to help you 🚀
        </motion.p>
      </div>

  
      <div className="mt-12 max-w-5xl mx-auto grid sm:grid-cols-2 gap-6 px-4">
        {contactItems.map((item, i) => (
          <motion.a
            key={i}
            href={item.link}
            target={item.title === "WhatsApp" ? "_blank" : "_self"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className={`p-6 rounded-2xl backdrop-blur-xl border transition-all cursor-pointer ${
              isDarkMode
                ? "bg-white/5 border-white/10 hover:bg-white/10"
                : "bg-black/5 border-black/10 hover:bg-black/10"
            }`}
          >
            <div className={`text-3xl mb-3 ${item.color}`}>
              {item.icon}
            </div>

            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p
              className={`mt-1 text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {item.value}
            </p>
          </motion.a>
        ))}
      </div>

      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-14 text-center"
      >
        <div
          className={`max-w-2xl mx-auto p-6 rounded-2xl border backdrop-blur-xl ${
            isDarkMode
              ? "bg-white/5 border-white/10"
              : "bg-black/5 border-black/10"
          }`}
        >
          <h2 className="text-2xl font-bold">Quick Response</h2>
          <p
            className={`mt-2 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            We usually reply within a few hours on WhatsApp & Email 
          </p>

          <a
            href="https://wa.me/923287303593"
            target="_blank"
            className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
          >
            Chat on WhatsApp
          </a>
        </div>
      </motion.div>

      <div className="mt-10">
        <Footer isDarkMode={isDarkMode} />
      </div>

      {openlogin && (
        <LoginPopup open={openlogin} onClose={() => setlogin(false)} />
      )}
    </div>
  );
}