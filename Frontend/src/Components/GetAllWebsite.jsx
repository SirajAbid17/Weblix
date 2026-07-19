import React, { useEffect, useState } from "react";
import axios from "axios";
import { ServerUrl } from "../../config/backendUrl";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCode,
  FaEye,
  FaPlus,
  FaMoon,
  FaSun,
  FaRocket,
  FaEdit,
  FaDownload,
  FaCopy,
  FaCheck,
  FaTrash,
} from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GetAllWebsite({
  isDarkMode: externalDarkMode,
  onThemeToggle,
}) {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deployingId, setDeployingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [internalDarkMode, setInternalDarkMode] = useState(true);
  const isDarkMode =
    externalDarkMode !== undefined ? externalDarkMode : internalDarkMode;

  useEffect(() => {
    fetchAllWebsites();
  }, []);

  const fetchAllWebsites = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await axios.get(`${ServerUrl}/api/website/all`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("API Response:", result.data);

      if (Array.isArray(result.data)) {
        setWebsites(result.data);
      } else if (result.data && Array.isArray(result.data.websites)) {
        setWebsites(result.data.websites);
      } else if (
        result.data &&
        result.data.data &&
        Array.isArray(result.data.data)
      ) {
        setWebsites(result.data.data);
      } else {
        setWebsites([]);
        console.warn("Unexpected API response format:", result.data);
      }
    } catch (error) {
      console.error("Error fetching websites:", error);
      let errorMessage = "Failed to load websites";
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
        if (error.response.status === 401) {
          errorMessage = "Please login again to view your websites";
        }
      }
      setError(errorMessage);
      toast.error(errorMessage);
      setWebsites([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAllWebsites();
  };

  const handlePreviewWebsite = (id) => {
    navigate(`/code/${id}`);
  };

  const handleEditWebsite = (id) => {
    navigate(`/code/${id}`);
  };

  const handleCreateNew = () => {
    navigate("/generate");
  };

  const handleDeployWebsite = async (id) => {
    try {
      setDeployingId(id);

      console.log(" Deploying website:", id);

      const response = await axios.post(
        `${ServerUrl}/api/websitedeploy/deploy/${id}`,
        {},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );

      console.log("Deploy response:", response.data);

      if (response.data.success) {
        setWebsites((prevWebsites) =>
          prevWebsites.map((website) =>
            website._id === id
              ? {
                  ...website,
                  deploy: true,
                  deployedUrl: response.data.url,
                  deployedAt: response.data.deployedAt,
                }
              : website,
          ),
        );

        toast.success(
          <div>
            <strong>Website deployed successfully!</strong>
            <br />
            <span style={{ fontSize: "12px", wordBreak: "break-all" }}>
              URL: {response.data.url}
            </span>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
          },
        );
      } else {
        throw new Error(response.data.message || "Deployment failed");
      }
    } catch (error) {
      console.error("Error deploying website:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to deploy website";
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 4000,
      });
      setError(errorMsg);
      setTimeout(() => setError(""), 3000);
    } finally {
      setDeployingId(null);
    }
  };

  const viewLiveWebsite = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      toast.warning(
        "Deployed URL not available. Please deploy the website first.",
        {
          position: "top-right",
          autoClose: 3000,
        },
      );
    }
  };

  const handleDownloadWebsite = (website) => {
    try {
      let cleanHtml = website.lcode;

      if (!cleanHtml.includes("<meta charset")) {
        cleanHtml = cleanHtml.replace(
          "<head>",
          '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">',
        );
      }

      const blob = new Blob([cleanHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${website.title?.replace(/[^a-z0-9]/gi, "-") || "website"}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("✅ Website downloaded successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download website", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCopyUrl = async (url, id) => {
    if (!url) {
      toast.warning("No URL available", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast.success(" URL copied to clipboard!", {
        position: "top-right",
        autoClose: 1500,
      });
    } catch (err) {
      toast.error("Failed to copy URL", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // REMOVED: handleDeleteWebsite function completely

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleTheme = () => {
    if (onThemeToggle) {
      onThemeToggle();
    } else {
      setInternalDarkMode(!internalDarkMode);
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-[400px] flex flex-col items-center justify-center gap-5 rounded-xl ${isDarkMode ? "bg-[#0F0F0F]" : "bg-gray-50"}`}
      >
        <BeatLoader color={isDarkMode ? "#ffffff" : "#000000"} size={20} />
        <p className={isDarkMode ? "text-white" : "text-black"}>
          Loading your websites...
        </p>
      </div>
    );
  }

  if (error && websites.length === 0) {
    return (
      <div
        className={`min-h-[400px] flex items-center justify-center rounded-xl ${isDarkMode ? "bg-[#0F0F0F]" : "bg-gray-50"}`}
      >
        <div
          className={`p-6 sm:p-10 rounded-xl text-center shadow-lg max-w-md mx-4 ${isDarkMode ? "bg-[#1a1a1a]" : "bg-white"}`}
        >
          <h2 className="text-red-500 mb-2.5 text-xl font-semibold">Error</h2>
          <p
            className={`mb-5 text-sm sm:text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            {error}
          </p>
          <div className="flex gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchAllWebsites}
              className="bg-purple-600 hover:bg-purple-700 transition-colors px-5 py-2.5 rounded-md text-white cursor-pointer"
            >
              Try Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 transition-colors px-5 py-2.5 rounded-md text-white cursor-pointer"
            >
              Create Website
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />

      <div
        className={`py-8 px-4 sm:px-6 lg:px-8 ${isDarkMode ? "bg-[#0F0F0F] text-white" : "bg-gray-50 text-gray-900"}`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 max-w-7xl mx-auto">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold m-0">My Websites</h1>
            <p
              className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              {websites.length} website{websites.length !== 1 ? "s" : ""}{" "}
              created
            </p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateNew}
              className="bg-white text-black hover:bg-gray-100 px-5 py-2.5 rounded-lg cursor-pointer flex items-center gap-2 border border-gray-300"
            >
              <FaPlus size={14} />
              Create New
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg transition-colors ${isDarkMode ? "bg-[#1a1a1a] hover:bg-gray-800 border border-gray-800" : "bg-white hover:bg-gray-100 border border-gray-200"}`}
            >
              {isDarkMode ? (
                <FaSun className="text-yellow-400" size={18} />
              ) : (
                <FaMoon className="text-gray-700" size={18} />
              )}
            </motion.button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {websites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center py-12 sm:py-16 px-4 sm:px-5 rounded-xl border ${isDarkMode ? "bg-[#1a1a1a] border-gray-800" : "bg-white border-gray-200"}`}
            >
              <FaCode
                size={60}
                className={`mx-auto mb-5 ${isDarkMode ? "text-gray-700" : "text-gray-300"}`}
              />
              <h2 className="text-xl sm:text-2xl mb-2.5">No websites yet</h2>
              <p
                className={`mb-5 text-sm sm:text-base ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Create your first website using AI
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateNew}
                className="bg-white text-black hover:bg-gray-100 transition-colors px-6 py-3 rounded-lg cursor-pointer text-sm sm:text-base border border-gray-300"
              >
                Generate Website
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {websites.map((website, index) => (
                <motion.div
                  key={website._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className={`rounded-xl border overflow-hidden transition-all duration-300 ${isDarkMode ? "bg-[#1a1a1a] border-gray-800" : "bg-white border-gray-200 shadow-sm hover:shadow-md"}`}
                >
                  <div
                    className={`h-48 sm:h-52 relative overflow-hidden border-b cursor-pointer ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}
                    onClick={() => handlePreviewWebsite(website._id)}
                  >
                    {website.lcode ? (
                      <iframe
                        title={website.title || "Website Preview"}
                        srcDoc={website.lcode}
                        className="w-full h-full border-none pointer-events-none overflow-hidden scale-95 rounded-md"
                        sandbox="allow-same-origin allow-scripts"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                        onLoad={(e) => {
                          const iframe = e.target;
                          try {
                            const iframeDoc =
                              iframe.contentDocument ||
                              iframe.contentWindow.document;
                            const style = iframeDoc.createElement("style");
                            style.textContent = `*::-webkit-scrollbar { display: none !important; } * { scrollbar-width: none !important; -ms-overflow-style: none !important; }`;
                            iframeDoc.head.appendChild(style);
                          } catch (err) {
                            console.log("Iframe style error:", err);
                          }
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FaCode
                          size={40}
                          className={
                            isDarkMode ? "text-gray-700" : "text-gray-300"
                          }
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium bg-black/70 px-3 py-1.5 rounded-lg">
                        Click to Preview
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex justify-between items-start gap-2 mb-2.5">
                      <h3 className="text-base sm:text-lg font-semibold m-0 line-clamp-1 flex-1">
                        {website.title || "Untitled Website"}
                      </h3>
                      <span
                        className={`text-white text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap ${website.deploy ? "bg-green-500" : "bg-amber-500"}`}
                      >
                        {website.deploy ? "Live" : "Draft"}
                      </span>
                    </div>

                    <p
                      className={`text-xs my-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Created: {formatDate(website.createdAt)}
                    </p>
                    <p
                      className={`text-xs my-1 mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Version: {website.conversion?.length || 1} updates
                    </p>

                    <div className="flex gap-2.5 mt-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleEditWebsite(website._id)}
                        className="flex-1 py-2 rounded-md cursor-pointer flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <FaEdit size={12} /> Edit
                      </motion.button>

                      {!website.deploy ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDeployWebsite(website._id)}
                          disabled={deployingId === website._id}
                          className={`flex-1 py-2 rounded-md cursor-pointer flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all ${deployingId === website._id ? "bg-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"}`}
                        >
                          {deployingId === website._id ? (
                            <>
                              <span>Deploying...</span>
                            </>
                          ) : (
                            <>
                              <FaRocket size={12} /> Deploy
                            </>
                          )}
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => viewLiveWebsite(website.deployedUrl)}
                          className="flex-1 py-2 rounded-md cursor-pointer flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all bg-green-600 hover:bg-green-700 text-white"
                        >
                          <FaRocket size={12} />
                        </motion.button>
                      )}
                    </div>

                    {website.deploy && website.deployedUrl && (
                      <div className="flex gap-2.5 mt-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDownloadWebsite(website)}
                          className={`flex-1 py-2 rounded-md cursor-pointer flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-500 hover:bg-gray-600 text-white"}`}
                        >
                          <FaDownload size={12} /> Download
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            handleCopyUrl(website.deployedUrl, website._id)
                          }
                          className={`flex-1 py-2 rounded-md cursor-pointer flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-500 hover:bg-gray-600 text-white"}`}
                        >
                          {copiedId === website._id ? (
                            <FaCheck size={12} />
                          ) : (
                            <FaCopy size={12} />
                          )}
                          {copiedId === website._id ? "Copied!" : "Copy URL"}
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}