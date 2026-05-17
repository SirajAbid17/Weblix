import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import axios from "axios";
import { ServerUrl } from "../../config/backendUrl";

export default function Generate() {
  const navigate = useNavigate(); 

  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
const [isDarkMode, setIsDarkMode] = useState(() => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme === null ? true : savedTheme === 'dark';
});

  const HandleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter your website idea");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await axios.post(
        `${ServerUrl}/api/website/generate`,
        { prompt },
        { withCredentials: true }
      );
      
      console.log("Generation result:", result.data);
      
      
      if (result.data.websiteId) {
        navigate(`/code/${result.data.websiteId}`);
      } else {
        setError("Failed to generate website. Please try again.");
      }
      
    } catch (error) {
      console.error("Generation error:", error);
      
      if (error?.response?.status === 402) {
        setError("Insufficient credits. Please purchase more credits to generate websites.");
      } else if (error?.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
    
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onLoginClick={() => {}}
      />

  
      <div className="flex-1 flex mt-15 flex-col items-center justify-center px-6 py-12">

      
        <div className="text-center max-w-3xl mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            Generate Your Website
          </h1>

          <p className={`mt-4 text-base sm:text-lg ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            Write your idea and AI will generate a modern website for you.
          </p>
        </div>

        <div className="w-full p-3 max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-start border-2 border-gray-800/30 rounded-xl">

          <div className="space-y-6">

            <div>
              <label className={`block ms-2 text-xs tracking-wide uppercase mb-2 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                Your Website Idea
              </label>

              <textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setError(""); 
                }}
                placeholder="Generate a website using AI prompts..."
                className={`w-full h-48 p-4 rounded-xl outline-none border resize-none ${
                  isDarkMode
                    ? "bg-black border-gray-700 text-white placeholder:text-gray-600 focus:border-blue-500"
                    : "bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-blue-500"
                }`}
                disabled={isLoading}
              />
            </div>

         
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm"
              >
                {error}
              </motion.div>
            )}

          
            <motion.button
              onClick={HandleGenerate}
              whileHover={{ scale: isLoading ? 1 : 1.03 }}
              whileTap={{ scale: isLoading ? 1 : 0.97 }}
              disabled={isLoading}
              className={`w-full cursor-pointer sm:w-auto px-8 py-3 rounded-xl font-semibold transition-all ${
                isDarkMode
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-black text-white hover:bg-gray-800"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Generating...
                </div>
              ) : (
                "Generate Website"
              )}
            </motion.button>

           
            <div className="flex flex-wrap gap-2">
              {["AI-Powered", "Fast", "Modern", "Responsive"].map((item) => (
                <span
                  key={item}
                  className={`text-xs px-3 py-1 rounded-full ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>

          
            <div className={`text-xs text-center mt-4 ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            }`}>
               Costs 5 credits to generate a website
            </div>

          </div>

         
          <div
            className={`rounded-2xl p-5 border w-full md:max-w-md mx-auto ${
              isDarkMode
                ? "bg-black border-gray-800"
                : "bg-white border-gray-200"
            }`}
          >
            <h3 className="text-xl font-bold mb-4 text-center">
              How it works
            </h3>

            <div className="space-y-4">

            
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Describe Idea</h4>
                  <p className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Tell your website idea (portfolio, blog, business etc.)
                  </p>
                </div>
              </div>

          
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-sm">AI Generates</h4>
                  <p className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    AI creates clean and modern website structure
                  </p>
                </div>
              </div>

            
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Edit & Customize</h4>
                  <p className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Use AI chat to modify and improve your website
                  </p>
                </div>
              </div>

            
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Preview Design</h4>
                  <p className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    See live preview of your generated website
                  </p>
                </div>
              </div>

           
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-sm">
                  5
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Go Live</h4>
                  <p className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Your website can be published instantly on any platform
                  </p>
                </div>
              </div>
            </div>

           
            <div className="mt-4 pt-3 border-t border-gray-700">
              <p className={`text-[10px] text-center ${
                isDarkMode ? "text-gray-500" : "text-gray-500"
              }`}>
                No coding • AI powered • Instant generation
              </p>
            </div>

          </div>

        </div>
      </div>

<div> 
  
</div>
    
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}