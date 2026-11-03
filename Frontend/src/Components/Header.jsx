import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";
import { BsCoin } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../../config/backendUrl";
import { setUSerData } from "../../redux/userslice";
import Brightness from "./Brightness";

export default function Header({ isDarkMode, setIsDarkMode, onLoginClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [avatarError2, setAvatarError2] = useState(false);
  const [avatarError3, setAvatarError3] = useState(false);

  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const Logout = async () => {
    try {
      await axios.get(`${ServerUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUSerData(null));
      setProfileOpen(false);
      setMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // 👇 KEY FIX: navigation ke baad menu band karo, pehle nahi
  const closeMenuAfterNav = () => {
    setTimeout(() => setMenuOpen(false), 150);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 md:backdrop-blur-2xl ${
          isDarkMode
            ? "bg-black/80 md:bg-black/50 border-b border-white/10"
            : "bg-white/90 md:bg-white/80 border-b border-black/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* LOGO */}
            <Link
              to="/"
              onClick={closeMenuAfterNav}
              className={`text-2xl font-extrabold bg-linear-to-r bg-clip-text text-transparent ${
                isDarkMode ? "from-white to-gray-400" : "from-gray-800 to-black"
              }`}
            >
              Weblix
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/pricing"
                className={`text-sm ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Pricing
              </Link>

              {!userData ? (
                <button
                  onClick={onLoginClick}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl border text-sm ${
                    isDarkMode
                      ? "bg-black border-zinc-700 text-white"
                      : "bg-white border-gray-300 text-black"
                  }`}
                >
                  <FaSignInAlt className="text-purple-400" />
                  Login
                </button>
              ) : (
                <div className="relative" ref={profileRef}>
                  <div
                    onClick={() => setProfileOpen((v) => !v)}
                    className={`flex items-center gap-3 px-3 py-1.5 rounded-full cursor-pointer ${
                      isDarkMode
                        ? "bg-white/5 border border-white/10"
                        : "bg-black/5 border border-black/10"
                    }`}
                  >
                    {userData.avatar && !avatarError ? (
                      <img
                        src={userData.avatar}
                        alt="avatar"
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
                      className={`absolute top-full right-0 mt-1 w-72 rounded-xl overflow-hidden shadow-xl z-50 border ${
                        isDarkMode
                          ? "bg-black/95 border-white/10"
                          : "bg-white/95 border-black/10"
                      }`}
                    >
                      <div
                        className={`px-4 py-4 border-b flex items-center gap-3 ${
                          isDarkMode
                            ? "border-white/10 bg-white/5"
                            : "border-black/10 bg-black/5"
                        }`}
                      >
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
                          <p
                            className={`text-xs truncate ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {userData?.email || "user@weblix.com"}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`px-4 py-3 flex justify-between border-b ${
                          isDarkMode ? "border-white/10" : "border-black/10"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <BsCoin className="text-yellow-400" />
                          Credits
                        </div>
                        <span className="text-yellow-400 font-bold">
                          {userData.credits}
                        </span>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className={`block w-full px-4 py-3 ${
                          isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"
                        }`}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/contact"
                        onClick={() => setProfileOpen(false)}
                        className={`block w-full px-4 py-3 ${
                          isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"
                        }`}
                      >
                        Contact Us
                      </Link>
                      <Link
                        to="/about"
                        onClick={() => setProfileOpen(false)}
                        className={`block w-full px-4 py-3 ${
                          isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"
                        }`}
                      >
                        About
                      </Link>
                      <div
                        className={`border-t ${
                          isDarkMode ? "border-white/10" : "border-black/10"
                        }`}
                      />
                      <button
                        onClick={Logout}
                        className="w-full px-4 py-3 text-red-400 hover:bg-red-500/20 text-left"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              <Brightness
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
              />
            </div>

            {/* MOBILE HAMBURGER */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className={isDarkMode ? "text-white" : "text-black"}
                aria-label="Toggle menu"
              >
                {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ✅ MOBILE MENU — OUTSIDE motion.nav, alag stacking context */}
      {menuOpen && (
        <div
          className={`fixed top-16 left-0 w-full z-[60] md:hidden px-5 py-5 shadow-xl ${
            isDarkMode
              ? "bg-black border-b border-white/10"
              : "bg-white border-b border-black/10"
          }`}
        >
          <Link
            to="/pricing"
            onClick={closeMenuAfterNav}
            className={`block py-3 w-full text-left ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Pricing
          </Link>

          {!userData ? (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onLoginClick?.();
              }}
              className={`w-full mt-3 py-3 rounded-lg ${
                isDarkMode ? "bg-zinc-900 text-white" : "bg-gray-100 text-black"
              }`}
            >
              Login
            </button>
          ) : (
            <div className="space-y-3 mt-3">
              <div
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-white/5 border-white/10"
                    : "bg-black/5 border-black/10"
                }`}
              >
                {userData?.avatar && !avatarError3 ? (
                  <img
                    src={userData.avatar}
                    alt="avatar"
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
                  <p
                    className={`text-xs truncate ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {userData?.email || "user@weblix.com"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between px-1">
                <span>Credits</span>
                <span className="text-yellow-400">{userData.credits}</span>
              </div>

              <Link
                to="/dashboard"
                onClick={closeMenuAfterNav}
                className={`block py-3 px-1 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/contact"
                onClick={closeMenuAfterNav}
                className={`block py-3 px-1 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Contact Us
              </Link>
              <Link
                to="/about"
                onClick={closeMenuAfterNav}
                className={`block py-3 px-1 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                About
              </Link>
              <button
                type="button"
                onClick={Logout}
                className="w-full text-left text-red-400 py-3 px-1"
              >
                Logout
              </button>
            </div>
          )}

          <div
            className={`flex items-center justify-between mt-4 pt-4 border-t ${
              isDarkMode ? "border-white/10" : "border-black/10"
            }`}
          >
            <span className="text-sm">Theme</span>
            <Brightness isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </div>
        </div>
      )}
    </>
  );
}