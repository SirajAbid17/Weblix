import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { BeatLoader } from "react-spinners";
import { ServerUrl } from "../../config/backendUrl";

export default function PublicSite() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [website, setWebsite] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchWebsite();
    }
  }, [slug]);

  const fetchWebsite = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("Fetching website with slug:", slug);
      
     
      const response = await axios.get(`${ServerUrl}/api/websitedeploy/website/${slug}`);
      
      console.log("Response:", response.data);
      
      if (response.data.success && response.data.website) {
        setWebsite(response.data.website);
      } else {
        setError("Website not found or not deployed");
      }
    } catch (error) {
      console.error("Error fetching website:", error);
      setError(error.response?.data?.message || "Failed to load website");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <BeatLoader color="#667eea" size={20} />
          <p className="text-white mt-4">Loading website...</p>
        </div>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center bg-white/10 backdrop-blur-md p-8 rounded-2xl max-w-md mx-4">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <p className="text-gray-300 mb-6">{error || "Website not found"}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <iframe
      srcDoc={website.lcode}
      title={website.title || "Website"}
      className="w-full min-h-screen border-none"
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 'none'
      }}
    />
  );
}