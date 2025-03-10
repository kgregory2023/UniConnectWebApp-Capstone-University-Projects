import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

/* 
Create more pages in ./pages/<pagename folder>/<pagename that's exported> 
and import them below. Then create a route for that path to go down.
*/
import About from './pages/about/About'
import Profile from './pages/profile/Profile'
import CustomizeProfile from './pages/customizeProfile/CustomizeProfile'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Navbar from './components/navbar/Navbar';
import { UserProvider } from './components/userContext/UserContext';




//This was the pre made web page, wrapped it in a function to make the actuall App function look prettier :)
function DefaultApp() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      </div>
      <h1>Welcome to UnIConnect!</h1>
    </>
  )
}


function App() {
  return (

    <UserProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<DefaultApp />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/customizeProfile" element={<CustomizeProfile />} />
        </Routes>
    </UserProvider>

  )
}

export default App
