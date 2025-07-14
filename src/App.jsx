import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./Components/MainPage.jsx";
import ScrollToTop from "./Components/UI/ScrollToTop.jsx";
import AboutSection from "./Components/AboutSection.jsx";
import "./index.css";
import Mentor from "./Components/Mentor.jsx";
import Auth from "./Components/Auth.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";

function App() {
  return (
    <div className="relative w-full h-full min-h-screen overflow-x-hidden bg-white">
      {/* Squares always in the background */}
      
   
      <Router>
           <ScrollToTop />
        <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<MainPage />} />
            <Route
      path="/interview"
      element={
        <ProtectedRoute>
          <Mentor />
        </ProtectedRoute>
      }
    />
          {/* Add other routes as needed */}
        </Routes>
      </Router>
      {/* Footer or additional sections can be added here */}
    </div>
  );
}

export default App;