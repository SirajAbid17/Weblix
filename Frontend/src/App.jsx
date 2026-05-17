import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "./pages/Home";
import CurrentUser from "../CurrentUser/CurrentUser";
import { useSelector } from "react-redux";
import Generate from "./pages/Generate";
import EditorCode from "./pages/EditorCode";
import DeployedSite from "./Components/DeployedSite";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/PaymentSuccess";
import About from "./pages/About";
import Contact from "./pages/Contact";


const Dashboard = lazy(() => import("./pages/Dashboard"));


const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
    </div>
  </div>
);

export default function App() {
  const { userData } = useSelector(state => state.user);
  
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