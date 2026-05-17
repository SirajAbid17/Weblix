import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import {
  FiPlus,
  FiBarChart2,
  FiGlobe,
  FiTrendingUp,
  FiClock,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import GetAllWebsite from "../Components/GetAllWebsite";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import axios from "axios";
import { ServerUrl } from "../../config/backendUrl";

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(true); 
  const [stats, setStats] = useState({
    totalWebsites: 0,
    activeDeployments: 0,
    totalVisits: 0,
    averageLoadTime: 0,
    performanceScore: 0,
  });
  const [pieData, setPieData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const fetchDashboardStats = async () => {
    try {
      setError(null);
      
      console.log("Fetching dashboard stats from:", `${ServerUrl}/api/website/dashboard/stats`);
      
      const response = await axios.get(
        `${ServerUrl}/api/website/dashboard/stats`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Dashboard stats response:", response.data);

      if (response.data.success) {
        setStats(response.data.stats);
        setPieData(response.data.charts?.websiteDistribution || []);
        setRecentActivity(response.data.recentActivity || []);
      } else {
        throw new Error(response.data.message || "Failed to fetch stats");
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setError(error.response?.data?.message || error.message || "Failed to load dashboard stats");
      
    
      setPieData([
        { name: "Portfolio", value: 35, color: "#3B82F6" },
        { name: "E-commerce", value: 25, color: "#10B981" },
        { name: "Blog", value: 20, color: "#F59E0B" },
        { name: "Other", value: 20, color: "#8B5CF6" },
      ]);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const handleCreateNew = () => {
    navigate("/generate");
  };

  const statCards = [
    {
      title: "Total Websites",
      value: stats.totalWebsites,
      icon: <FiGlobe size={24} />,
      color: "text-blue-500",
    },
    {
      title: "Active Deployments",
      value: stats.activeDeployments,
      icon: <FiTrendingUp size={24} />,
      color: "text-green-500",
    },
    {
      title: "Total Visits",
      value: stats.totalVisits,
      icon: <FiBarChart2 size={24} />,
      color: "text-purple-500",
    },
    {
      title: "Performance Score",
      value: `${stats.performanceScore}%`,
      icon: <FiClock size={24} />,
      color: "text-yellow-500",
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode ? "bg-[#0F0F0F] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={toggleTheme}
        onLoginClick={() => {}}
      />

      <div className="flex-1">
        <div className="pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              >
                Welcome to your{" "}
                <span className={isDarkMode ? "text-white/80" : "text-gray-800"}>
                  Dashboard
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className={`mt-4 sm:mt-6 text-sm sm:text-base md:text-lg max-w-2xl mx-auto ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Manage and monitor all your websites from one place. Track
                performance, analyze traffic, and grow your online presence.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              >
                <motion.button
                  onClick={handleCreateNew}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex cursor-pointer items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200 ${
                    isDarkMode
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  <motion.span whileTap={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                    <FiPlus className="text-base sm:text-lg" />
                  </motion.span>
                  Create New Website
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowStats(!showStats)}
                  className={`px-6 cursor-pointer sm:px-8 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                >
                  {showStats ? "Hide Analytics" : "View Analytics"}
                </motion.button>
              </motion.div>
            </motion.div>

            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              {statCards.map((card, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-6 ${
                    isDarkMode
                      ? "bg-[#1a1a1a] border border-gray-800"
                      : "bg-white border border-gray-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-2xl ${card.color}`}>
                      {card.icon}
                    </span>
                    <span className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {card.value}
                    </span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {card.title}
                  </p>
                </div>
              ))}
            </motion.div>

            {error && (
              <div className="text-center py-8">
                <p className="text-red-500">⚠️ {error}</p>
                <button
                  onClick={fetchDashboardStats}
                  className="mt-4 px-4 cursor-pointer py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Retry
                </button>
              </div>
            )}

           
            <AnimatePresence>
              {showStats && pieData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-8"
                >
                
                  <div
                    className={`rounded-xl p-6 ${
                      isDarkMode
                        ? "bg-[#1a1a1a] border border-gray-800"
                        : "bg-white border border-gray-200 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <FiBarChart2 className="text-purple-500" />
                          Website Distribution
                        </h3>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Types of websites you've created
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex flex-col justify-center gap-3">
                        {pieData.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm">{item.name}</span>
                            </div>
                            <span className="text-sm font-semibold">
                              {item.value}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                
                  <div
                    className={`rounded-xl p-6 ${
                      isDarkMode
                        ? "bg-[#1a1a1a] border border-gray-800"
                        : "bg-white border border-gray-200 shadow-sm"
                    }`}
                  >
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    {recentActivity.length > 0 ? (
                      <div className="space-y-3">
                        {recentActivity.slice(0, 5).map((activity, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center justify-between py-2 border-b last:border-0 ${
                              isDarkMode ? "border-gray-700" : "border-gray-200"
                            }`}
                          >
                            <div>
                              <p className="text-sm font-medium">{activity.title}</p>
                              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {activity.type === "deployed" ? "Deployed" : "Created"} •{" "}
                                {new Date(activity.date).toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                activity.status === "Live"
                                  ? "bg-green-500/20 text-green-500"
                                  : "bg-yellow-500/20 text-yellow-500"
                              }`}
                            >
                              {activity.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                          No recent activity. Start by creating a website!
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <GetAllWebsite isDarkMode={isDarkMode} onThemeToggle={toggleTheme} />
      </div>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}