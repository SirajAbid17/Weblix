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

  // Body scroll lock jab mobile menu open ho
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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
              className={`text-2xl font-extrabold bg-linear-to-r bg-clip-text text-transparent flex-shrink-0 ${
                isDarkMode ? "from-white to-gray-400" : "from-gray-800 to-black"
              }`}
            >
              Weblix
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <Link
                to="/pricing"
                className={`text-sm whitespace-nowrap ${
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
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl border text-sm whitespace-nowrap ${
                    isDarkMode
                      ? "bg-black border-zinc-700 text-white"
                      : "bg-white border-gray-300 text-black"
                  }`}
                >
                  <FaSignInAlt className="text-purple-400" />
                  Login
                </button>
              ) : (
                /* ✅ PROFILE — proper right alignment ke liye flex-shrink-0 */
                <div className="relative flex-shrink-0" ref={profileRef}>
                  <div
                    onClick={() => setProfileOpen((v) => !v)}
                    className={`flex items-center gap-3 px-3 py-1.5 rounded-full cursor-pointer transition-all ${
                      isDarkMode
                        ? "bg-white/5 border border-white/10 hover:bg-white/10"
                        : "bg-black/5 border border-black/10 hover:bg-black/10"
                    }`}
                  >
                    {userData.avatar && !avatarError ? (
                      <img
                        src={userData.avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {userData.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm max-w-[100px] truncate hidden lg:inline">
                      {userData.name}
                    </span>
                  </div>

                  {/* ✅ DROPDOWN — right-aligned, viewport-safe */}
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute top-full right-0 mt-2 rounded-xl overflow-hidden shadow-2xl z-[70] border ${
                        isDarkMode
                          ? "bg-[#0a0a0a] border-white/10"
                          : "bg-white border-black/10"
                      }`}
                      style={{
                        width: "min(18rem, calc(100vw - 2rem))",
                      }}
                    >
                      {/* User info header */}
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
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            onError={() => setAvatarError2(true)}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-base font-bold flex-shrink-0">
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

                      {/* Credits */}
                      <div
                        className={`px-4 py-3 flex justify-between items-center border-b ${
                          isDarkMode ? "border-white/10" : "border-black/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <BsCoin className="text-yellow-400" />
                          Credits
                        </div>
                        <span className="text-yellow-400 font-bold text-sm">
                          {userData.credits}
                        </span>
                      </div>

                      {/* Menu items */}
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className={`block w-full px-4 py-3 text-sm transition-colors ${
                          isDarkMode
                            ? "hover:bg-white/10 text-gray-200"
                            : "hover:bg-black/5 text-gray-800"
                        }`}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/contact"
                        onClick={() => setProfileOpen(false)}
                        className={`block w-full px-4 py-3 text-sm transition-colors ${
                          isDarkMode
                            ? "hover:bg-white/10 text-gray-200"
                            : "hover:bg-black/5 text-gray-800"
                        }`}
                      >
                        Contact Us
                      </Link>
                      <Link
                        to="/about"
                        onClick={() => setProfileOpen(false)}
                        className={`block w-full px-4 py-3 text-sm transition-colors ${
                          isDarkMode
                            ? "hover:bg-white/10 text-gray-200"
                            : "hover:bg-black/5 text-gray-800"
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
                        className={`w-full px-4 py-3 text-sm text-left text-red-400 transition-colors ${
                          isDarkMode
                            ? "hover:bg-red-500/10"
                            : "hover:bg-red-500/10"
                        }`}
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
            <div className="md:hidden flex items-center gap-2">
              {userData && (
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="relative flex items-center"
                  aria-label="Profile"
                >
                  {userData.avatar && !avatarError3 ? (
                    <img
                      src={userData.avatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                      onError={() => setAvatarError3(true)}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                      {userData.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
              )}
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

      {/* ✅ MOBILE PROFILE DROPDOWN — fixed right-aligned, viewport-safe */}
      {userData && profileOpen && (
        <div
          className="md:hidden fixed top-16 right-3 left-3 z-[80]"
          ref={profileRef}
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className={`ml-auto rounded-xl overflow-hidden shadow-2xl border ${
              isDarkMode
                ? "bg-[#0a0a0a] border-white/10"
                : "bg-white border-black/10"
            }`}
            style={{ width: "min(18rem, calc(100vw - 1.5rem))" }}
          >
            {/* User info */}
            <div
              className={`px-4 py-4 border-b flex items-center gap-3 ${
                isDarkMode
                  ? "border-white/10 bg-white/5"
                  : "border-black/10 bg-black/5"
              }`}
            >
              {userData?.avatar && !avatarError3 ? (
                <img
                  src={userData.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  onError={() => setAvatarError3(true)}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-base font-bold flex-shrink-0">
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

            {/* Credits */}
            <div
              className={`px-4 py-3 flex justify-between items-center border-b ${
                isDarkMode ? "border-white/10" : "border-black/10"
              }`}
            >
              <div className="flex items-center gap-2 text-sm">
                <BsCoin className="text-yellow-400" />
                Credits
              </div>
              <span className="text-yellow-400 font-bold text-sm">
                {userData.credits}
              </span>
            </div>

            {/* Menu items */}
            <Link
              to="/dashboard"
              onClick={() => setProfileOpen(false)}
              className={`block w-full px-4 py-3 text-sm ${
                isDarkMode
                  ? "hover:bg-white/10 text-gray-200"
                  : "hover:bg-black/5 text-gray-800"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/contact"
              onClick={() => setProfileOpen(false)}
              className={`block w-full px-4 py-3 text-sm ${
                isDarkMode
                  ? "hover:bg-white/10 text-gray-200"
                  : "hover:bg-black/5 text-gray-800"
              }`}
            >
              Contact Us
            </Link>
            <Link
              to="/about"
              onClick={() => setProfileOpen(false)}
              className={`block w-full px-4 py-3 text-sm ${
                isDarkMode
                  ? "hover:bg-white/10 text-gray-200"
                  : "hover:bg-black/5 text-gray-800"
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
              className="w-full px-4 py-3 text-sm text-left text-red-400 hover:bg-red-500/10"
            >
              Logout
            </button>
          </motion.div>
        </div>
      )}

      {/* ✅ MOBILE MENU — full nav (profile already alag handle ho raha) */}
      {menuOpen && (
        <div
          className={`fixed top-16 left-0 w-full z-[60] md:hidden px-5 py-5 shadow-xl overflow-y-auto ${
            isDarkMode
              ? "bg-black border-b border-white/10"
              : "bg-white border-b border-black/10"
          }`}
          style={{ maxHeight: "calc(100vh - 4rem)" }}
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