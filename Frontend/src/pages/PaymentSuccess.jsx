import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ServerUrl } from "../../config/backendUrl";
import { setUSerData } from "../../redux/userslice";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [creditsAdded, setCreditsAdded] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        const plan = searchParams.get("plan");
        const credits = searchParams.get("credits");

        console.log(" Payment success params:", { sessionId, plan, credits });

        if (!sessionId) {
          setMessage("Invalid payment session");
          setTimeout(() => navigate("/pricing"), 3000);
          return;
        }

        // Confirm payment and add credits
        const response = await axios.get(
          `${ServerUrl}/api/billing/confirm-payment`,
          { 
            params: {
              session_id: sessionId,
              plan: plan,
              credits: credits
            },
            withCredentials: true 
          }
        );

        console.log("📡 Payment confirmation response:", response.data);

        if (response.data.success) {
          const added = response.data.creditsAdded || parseInt(credits);
          setCreditsAdded(added);
          setMessage(` Payment successful! ${added} credits added to your account.`);
          
        
          const userResponse = await axios.get(`${ServerUrl}/api/auth/current-user`, {
            withCredentials: true
          });
          
          console.log("👤 Updated user data:", userResponse.data);
          
       
          dispatch(setUSerData(userResponse.data));
          
          
          setTimeout(() => navigate("/dashboard"), 3000);
        } else {
          setMessage("Payment verification failed: " + (response.data.message || "Unknown error"));
          setTimeout(() => navigate("/pricing"), 3000);
        }
      } catch (error) {
        console.error("Payment error:", error);
        const errorMsg = error.response?.data?.message || error.message || "Error confirming payment";
        setMessage(` ${errorMsg}`);
        setTimeout(() => navigate("/pricing"), 3000);
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-white">Verifying your payment...</p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">
              {message.includes("successful") ? "success" : "something error"}
            </div>
            <p className="text-white text-lg">{message}</p>
            {creditsAdded > 0 && (
              <p className="text-purple-400 mt-2 font-bold">
                +{creditsAdded} credits added!
              </p>
            )}
            <p className="text-gray-400 mt-4">Redirecting to dashboard...</p>
          </>
        )}
      </div>
    </div>
  );
}