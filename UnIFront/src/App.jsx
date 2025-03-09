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
import Navbar from './components/navbar/Navbar';
import { UserProvider } from './components/userContext/UserContext';



//This was the pre made web page, wrapped it in a function to make the actuall App function look prettier :)
function DefaultApp() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div>
        <p>
          <a href="/about">
            Click me to go to the about page!
          </a>
        </p>
      </div>
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
        </Routes>
    </UserProvider>
  )
}

export default App
