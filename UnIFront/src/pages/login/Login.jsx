/**
 * Login page to handle submitting a login form with a user's email and password, with a link
 * to change to registration page.
 * Author: @MMcClure313
 */


import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../components/userContext/UserContext'
import './Login.css'

function Login() {
  const { user, token, login } = useUser();
  const navigate = useNavigate();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(''); 

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setIsLoading(true);


    try {

      const response = await fetch('http://localhost:5000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occured during login');
      } else {
        const data = await response.json()
        login(data.user, data.token);
        navigate('/'); 
      }

    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }

  }

  return (
    <div className="login-page">
      <h1>
        Log in
      </h1>
      <form onSubmit={handleSubmit} className='loginForm'>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            className='fancy-input'
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="aaa@students.uwf.edu"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            className='fancy-input'
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="enter your password"
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Log in'}</button>
        <div>
          <Link to="/register">
            Don't have an account? Click here
          </Link>
        </div>
      </form>

    </div>
  )
}

export default Login