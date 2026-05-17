import { motion } from "framer-motion";
import { useState } from "react";
import { FaSignInAlt, FaBars, FaTimes, FaUser } from "react-icons/fa";
import { BsCoin } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../../config/backendUrl";
import { setUSerData } from "../../redux/userslice";
import Brightness from "./Brightness";

export default function Header({ isDarkMode, setIsDarkMode, onLoginClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [avatarError2, setAvatarError2] = useState(false);
  const [avatarError3, setAvatarError3] = useState(false);

  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const Logout = async () => {
    try {
      await axios.get(`${ServerUrl}/api/auth/logout`, {
        withCredentials: true
      });
      dispatch(setUSerData(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-2xl transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-black/50 border-b border-white/10' 
          : 'bg-white/80 border-b border-black/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* LOGO */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/")}
            className={`text-2xl font-extrabold bg-linear-to-r bg-clip-text text-transparent cursor-pointer ${
              isDarkMode 
                ? 'from-white to-gray-400' 
                : 'from-gray-800 to-black'
            }`}
          >
            Weblix
          </motion.div>

       
          <div className="hidden md:flex items-center gap-6">
            
            <div className="relative">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setPricingOpen(!pricingOpen);
                  navigate('/pricing')
                }}
                className={`text-sm cursor-pointer ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                Pricing
              </div>
            </div>

            {!userData ? (
              <motion.button
                onClick={onLoginClick}
                className={`flex cursor-pointer items-center gap-2 px-5 py-2 rounded-xl border text-sm ${
                  isDarkMode 
                    ? 'bg-black border-zinc-700' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <FaSignInAlt className="text-purple-400" />
                Login
              </motion.button>
            ) : (
              <div className="relative">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileOpen(!profileOpen);
                  }}
                  className={`flex items-center gap-3 px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
                    isDarkMode 
                      ? 'bg-white/5 border border-white/10' 
                      : 'bg-black/5 border border-black/10'
                  }`}
                >
                  {userData.avatar && !avatarError ? (
                    <img
                      src={userData.avatar}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                      {userData.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm">{userData.name}</span>
                </div>

                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`fixed top-full right-0 mt-1 mr-1 w-[90vw] max-w-xs sm:max-w-sm md:max-w-xs rounded-xl overflow-hidden shadow-xl z-50 backdrop-blur-xl border ${
                      isDarkMode 
                        ? 'bg-black/90 border-white/10' 
                        : 'bg-white/90 border-black/10'
                    }`}
                  >
                    <div className={`px-4 py-4 border-b flex items-center gap-3 ${
                      isDarkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'
                    }`}>
                      {userData?.avatar && !avatarError2 ? (
                        <img
                          src={userData.avatar}
                          alt={userData.name}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={() => setAvatarError2(true)}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-base font-bold">
                          {userData?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {userData?.name}
                        </p>
                        <p className={`text-xs truncate ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {userData?.email || "user@weblix.com"}
                        </p>
                      </div>
                    </div>

                    <div className={`px-4 py-3 flex justify-between border-b ${
                      isDarkMode ? 'border-white/10' : 'border-black/10'
                    }`}>
                      <div className="flex items-center gap-2">
                        <BsCoin className="text-yellow-400" />
                        Credits
                      </div>
                      <span className="text-yellow-400 font-bold">
                        {userData.credits}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate("/dashboard")}
                      className={`w-full cursor-pointer px-4 py-3 text-left ${
                        isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'
                      }`}
                    >
                      Dashboard
                    </button>

                    <button
                      onClick={() => navigate("/contact")}
                      className={`w-full cursor-pointer px-4 py-3 text-left ${
                        isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'
                      }`}
                    >
                      Contact Us
                    </button>

                    <button
                      onClick={() => navigate("/About")}
                      className={`w-full cursor-pointer px-4 py-3 text-left ${
                        isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'
                      }`}
                    >
                      About
                    </button>

                    <div className={`border-t ${
                      isDarkMode ? 'border-white/10' : 'border-black/10'
                    }`} />

                    <button 
                      onClick={Logout} 
                      className="w-full cursor-pointer px-4 py-3 text-red-400 hover:bg-red-500/20 text-left"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            <Brightness isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </div>

         
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      
      {menuOpen && (
        <motion.div className={`md:hidden px-5 py-5 border-t ${
          isDarkMode ? 'bg-black/90 border-white/10' : 'bg-white/90 border-black/10'
        }`}>
          <button className="block py-2">Pricing</button>

          {!userData ? (
            <button
              onClick={onLoginClick}
              className={`w-full mt-3 py-3 rounded-lg ${
                isDarkMode ? 'bg-zinc-900' : 'bg-gray-100'
              }`}
            >
              Login
            </button>
          ) : (
            <div className="space-y-4 mt-3">
              <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
              }`}>
                {userData?.avatar && !avatarError3 ? (
                  <img
                    src={userData.avatar}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={() => setAvatarError3(true)}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-base font-bold">
                    {userData?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {userData?.name}
                  </p>
                  <p className={`text-xs truncate ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {userData?.email || "user@weblix.com"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between px-1">
                <span>Credits</span>
                <span className="text-yellow-400">{userData.credits}</span>
              </div>

              <button className="w-full text-left">Dashboard</button>
              <button className="w-full text-left">Profile</button>
              <button className="w-full text-left">About</button>
              <button className="w-full text-left text-red-400" onClick={Logout}>Logout</button>
            </div>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}