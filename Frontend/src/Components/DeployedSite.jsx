import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ServerUrl } from '../../config/backendUrl';

export default function DeployedSite() {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { slug } = useParams();

    useEffect(() => {
        const fetchDeployedSite = async () => {
            try {
                setLoading(true);
                
                const result = await axios.get(`${ServerUrl}/api/websitedeploy/website/${slug}`);
                console.log("Fetched website:", result.data);
                
                if (result.data.success && result.data.website && result.data.website.lcode) {
                    setCode(result.data.website.lcode);
                } else if (result.data && result.data.lcode) {
                    setCode(result.data.lcode);
                } else {
                    setError("Website not found or not deployed");
                }
            } catch (error) {
                console.error("Error fetching deployed site:", error);
                setError(error.response?.data?.message || "Failed to load website");
            } finally {
                setLoading(false);
            }
        };
        
        if (slug) {
            fetchDeployedSite();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-white text-xl">Loading website...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-red-500 text-xl text-center px-4">
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <iframe 
            title="Live Website" 
            srcDoc={code} 
            className="w-full min-h-screen border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
        />
    );
}