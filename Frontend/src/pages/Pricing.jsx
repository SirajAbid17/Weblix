import React from "react";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { ServerUrl } from "../../config/backendUrl";

export default function Pricing({ isDarkMode = true }) {
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);

  const plans = [
    {
      key: "free",
      name: "Free",
      price: "0",
      credits: 100,
      description: "For beginners & casual users",
      features: [
        "Basic generation",
        "Limited credits",
        "Standard speed processing",
        "Access to basic templates"
      ],
      button: "Get Started"
    },
    {
      key: "pro",
      name: "Pro",
      price: "10",
      credits: 500,
      description: "For serious creators & freelancers",
      features: [
        "Everything in Free",
        "Download source code",
        "Edit & regenerate",
        "Priority support"
      ],
      popular: true,
      button: "Upgrade to Pro",
    },
    {
      key: "enterprise",
      name: "Enterprise",
      price: "30",
      credits: 1000,
      description: "For teams & power users",
      features: [
        "Everything in Pro",
        "Unlimited iterations",
        "Priority support",
        "Team access",
      
      ],
      button: "Contact Sales",
    },
  ];

  const HandlePricing = async (planKey) => {
    
    if (!userData) {
      navigate('/');
      return;
    }

   
    if (planKey === "free") {
      navigate('/dashboard');
      return;
    }

    try {
      const response = await axios.post(
        `${ServerUrl}/api/billing/checkout`,
        { plantype: planKey },
        { withCredentials: true }
      );
      
      
      if (response.data.sessionUrl) {
        window.location.href = response.data.sessionUrl;
      } else if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className={`py-6 px-4 sm:px-6 lg:px-12 ${
        isDarkMode ? "bg-black text-white" : "bg-gray-50 text-black"
      }`}
    >
      <div className="flex justify-start p-4">
        <button
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-center gap-2 px-2 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 shadow-md"
        >
          <FaArrowLeft className="text-sm" />
          Back Home
        </button>
      </div>
      
     
      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03 }}
            className={`relative h-full flex flex-col overflow-hidden rounded-2xl p-6 border transition-all duration-300 ${
              isDarkMode
                ? "bg-[#111] border-gray-800"
                : "bg-white border-gray-200 shadow-sm"
            } ${plan.popular ? "ring-2 ring-purple-500" : ""}`}
          >
           
            {plan.popular && (
              <span className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full bg-purple-600 text-white">
                Popular
              </span>
            )}

          
            <h2 className="text-xl font-bold">{plan.name}</h2>

           
            <p
              className={`text-sm mt-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {plan.description}
            </p>

           
            <div className="mt-5 flex items-end gap-1">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span
                className={`text-sm mb-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                /month
              </span>
            </div>

           
            <p className="mt-2 text-sm text-purple-400 font-medium">
              {plan.credits} Credits
            </p>

            <div
              className={`my-5 h-px ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            />

           
            <ul className="space-y-3 text-sm flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

           
            <button
              onClick={() => HandlePricing(plan.key)}
              className={`w-full cursor-pointer mt-6 py-3 rounded-xl font-medium transition ${
                plan.popular
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : isDarkMode
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-black text-white hover:bg-black/80"
              }`}
            >
              {plan.button || "Get Started"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}