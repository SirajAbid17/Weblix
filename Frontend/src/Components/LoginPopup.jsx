import { signInWithPopup } from "firebase/auth";
import { motion } from "framer-motion";
import { FaTimes, FaGoogle } from "react-icons/fa";
import { auth, provider } from "../../config/firebase";
import axios from "axios"
import { ServerUrl } from "../../config/backendUrl";
import { useDispatch } from "react-redux";
import { setUSerData } from "../../redux/userslice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPopup({ open, onClose }) {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState(null);

   if (!open) return null;

   const GoogleAuth = async () => {
     if (isLoading) return;
     
     try {
       setIsLoading(true);
       setError(null);
       
       
       const result = await signInWithPopup(auth, provider);
       console.log("Google sign in success:", result.user.displayName);
       
       
       const res = await axios.post(`${ServerUrl}/api/auth/google`, {
         name: result.user.displayName,
         email: result.user.email,
         avatar: result.user.photoURL
       }, {
         withCredentials: true
       });
       
       console.log("Backend response:", res.data);
       
      
       dispatch(setUSerData(res.data));
       
      
       onClose();
       
     
       navigate("/", { replace: true });
       
       
       setTimeout(async () => {
         try {
           const verifyUser = await axios.get(`${ServerUrl}/api/user/me`, {
             withCredentials: true
           });
           if (verifyUser.data) {
             dispatch(setUSerData(verifyUser.data));
           }
         } catch (err) {
           console.log("Verification error:", err);
         }
       }, 500);
       
     } catch (error) {
       console.error("Login error:", error);
       setError(error.message || "Login failed. Please try again.");
       setIsLoading(false);
     }
   };
   
  return (
    <div className="fixed inset-0 right-0 z-50 flex items-center justify-center p-4 sm:p-6">
     
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

     
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[90%] sm:max-w-md md:max-w-lg p-[1] rounded-2xl 
                   bg-linear-to-br from-purple-500/40 via-transparent to-pink-500/40"
      >
        
        <div
          className="relative flex flex-col gap-4 sm:gap-6 p-5 sm:p-6 md:p-8 rounded-2xl 
                        bg-[#040404]/90 backdrop-blur-xl 
                        border border-white/10 text-center"
        >
         
          <div className="absolute inset-0 rounded-2xl shadow-[0_0_40px_sm_rgba(168,85,247,0.15)] sm:shadow-[0_0_60px_rgba(168,85,247,0.15)] pointer-events-none" />

         
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white transition p-1"
          >
            <FaTimes className="text-sm sm:text-base" />
          </button>

         
          <div className="flex flex-col gap-2 sm:gap-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wide">
              Welcome to{" "}
              <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Weblix
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed px-2 sm:px-4">
              Build smarter apps with AI-powered tools & modern workflows
            </p>
          </div>

       
          {error && (
            <div className="text-red-400 text-xs sm:text-sm bg-red-500/10 p-2 rounded-lg">
              {error}
            </div>
          )}
          
          <motion.button
            onClick={GoogleAuth}
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.97 }}
            className={`relative cursor-pointer w-full flex items-center justify-center gap-2 sm:gap-3 
                       px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl 
                       text-xs sm:text-sm font-semibold text-white
                       bg-linear-to-r from-white/10 to-white/5
                       backdrop-blur-xl
                       border border-white/10
                       shadow-[0_0_20px_rgba(255,255,255,0.05)]
                       overflow-hidden
                       transition-all duration-300
                       hover:border-white/30
                       hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]
                       ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <span className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-white/5 to-red-500/10 opacity-0 hover:opacity-100 transition duration-500" />

            <motion.div 
              animate={{ rotate: isLoading ? 360 : 0 }}
              transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
              className="relative z-10"
            >
              <FaGoogle className="text-red-400 text-base sm:text-lg" />
            </motion.div>

            <span className="relative z-10 tracking-wide">
              {isLoading ? "Connecting..." : "Continue with Google"}
            </span>

            <span className="absolute right-3 sm:right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400 blur-[2px] opacity-60" />
          </motion.button>

        
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
            <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest">
              or
            </span>
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
          </div>

        
          <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed px-2">
            By continuing, you agree to our{" "}
            <span className="text-purple-400 hover:text-purple-300 cursor-pointer transition">
              Terms
            </span>{" "}
            &{" "}
            <span className="text-purple-400 hover:text-purple-300 cursor-pointer transition">
              Privacy Policy
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}