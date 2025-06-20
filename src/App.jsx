import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./Components/MainPage.jsx";
import AboutSection from "./Components/AboutSection.jsx";
import "./index.css";
import Mentor from "./Components/Mentor.jsx";
import Auth from "./Components/Auth.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import SelectDemo from "./Components/SelectDemo";
import BadgeDemo from "./Components/BadgeDemo";

function App() {
  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-black">
      {/* Squares always in the background */}
      
   
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/interview" element={<Mentor />} />
          {/* Add other routes as needed */}
        </Routes>
      </Router>
      {/* Footer or additional sections can be added here */}
    </div>
  );
}

export default App;