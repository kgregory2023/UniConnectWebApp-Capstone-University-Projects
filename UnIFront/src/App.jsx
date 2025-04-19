import { useState } from 'react'
import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import './App.css'  

/* 
Create more pages in ./pages/<pagename folder>/<pagename that's exported> 
and import them below. Then create a route for that path to go down.
*/
import About from './pages/about/About'
import Profile from './pages/profile/Profile'
import CustomizeProfile from './pages/customizeProfile/CustomizeProfile'
import Login from './pages/login/Login'
import Navbar from './components/navbar/Navbar'
import Register from './pages/register/Register'
import Discover from './pages/discover/Discover'
import Connect from './pages/connect/Connect'

import { UserProvider } from './components/userContext/UserContext';

const videoList = [
  '/campus.mp4',
  '/campus2.mp4'
];

function DefaultApp() {

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videoList.length);
  };

  return (
    <div className="home-container">
    <video
        key={videoList[currentVideoIndex]} // 🔁 re-renders on change
        className="background-video"
        autoPlay
        muted
        onEnded={handleVideoEnd}
      >
        <source src={videoList[currentVideoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

    <div className="home-content">
      <h1>Welcome to UnIConnect!</h1>
      <p>Meet. Match. Mingle.</p>
      <p className="built-by-tag">👨‍🎓 Built for students, by students.</p>
      <p>✅ Trusted by over <strong>14,000+ students</strong> at UWF</p>  
      <a href="/register">
        <button className="home-btn">Connect Now!</button>
      </a>
    </div>
  </div>
)
}


function App() {
  const location = useLocation();

  useEffect(() => {
    const root = document.getElementById('root');

    if (location.pathname === '/') {
      document.body.style.background = 'none';
      if (root) root.style.background = 'none';
    } else {
      document.body.style.background = '#2d4181';
      if (root) root.style.background = '#2d4181';
    }
  }, [location.pathname]);

  return (

    <UserProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<DefaultApp />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/discover" element={<Discover />} />

        {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/customizeProfile"element={<ProtectedRoute element={<CustomizeProfile />} />} />
          <Route path ="/connect" element={<ProtectedRoute element={<Connect />} />} />
        </Routes>
    </UserProvider>

  );
}

export default App
