
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import CurrentUser from "../CurrentUser/CurrentUser";
import { useSelector } from "react-redux";

// Lazy load all pages and components
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Generate = lazy(() => import("./pages/Generate"));
const EditorCode = lazy(() => import("./pages/EditorCode"));
const DeployedSite = lazy(() => import("./Components/DeployedSite"));
const Pricing = lazy(() => import("./pages/Pricing"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

// Modern loading animation
const LoadingFallback = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#09090b]">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-purple-200 dark:border-purple-950"></div>

        <div className="absolute w-16 h-16 rounded-full border-4 border-transparent border-t-purple-600 border-r-purple-500 animate-spin"></div>

        <div className="absolute w-8 h-8 rounded-full bg-purple-600/10 animate-pulse"></div>
      </div>

      <h2 className="mt-6 text-lg font-semibold text-gray-800 dark:text-white">
        Loading...
      </h2>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Preparing your experience
      </p>

      <div className="mt-5 w-36 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div className="h-full w-1/2 rounded-full bg-purple-600 animate-[loading_1.5s_ease-in-out_infinite]"></div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default function App() {
  const { userData } = useSelector((state) => state.user);

  return (
    <>
      <CurrentUser />

      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/dashboard"
            element={userData ? <Dashboard /> : <Home />}
          />

          <Route
            path="/generate"
            element={userData ? <Generate /> : <Home />}
          />

          <Route
            path="/code/:id"
            element={userData ? <EditorCode /> : <Home />}
          />

          <Route path="/site/:slug" element={<DeployedSite />} />

          <Route path="/about" element={<About />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/pricing" element={<Pricing />} />

          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </Suspense>
    </>
  );
}
