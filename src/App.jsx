import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Squares from "./Components/Squares.jsx";
import MainPage from "./Components/MainPage.jsx";
import AboutSection from "./Components/AboutSection.jsx";
import "./index.css";
import Mentor from "./Components/Mentor.jsx";
import Auth from "./Components/Auth.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";

function App() {
  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-black">
      {/* Squares always in the background */}
      <div className="fixed inset-0 -z-10">
        <Squares
          direction="diagonal"
          speed={0.5}
          borderColor="#271E37"
          squareSize={40}
          hoverFillColor="#222222"
        />
      </div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Auth />
                <MainPage />
                <AboutSection />
              </>
            }
          />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/mentor"
            element={
              <ProtectedRoute>
                <Mentor />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      {/* Footer or additional sections can be added here */}
    </div>
  );
}

export default App;