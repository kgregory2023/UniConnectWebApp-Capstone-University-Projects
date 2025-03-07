/**
 * Login page to handle submitting a login form with a user's email and password, with a link
 * to change to registration page.
 */


import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './Login.css'

function Login () {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('email: ', email, 'Password:', password);
    }

    return (
        <div>
            <h1>
                Log in
            </h1>
        <form onSubmit={handleSubmit}  className = 'loginForm'>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              className='fancy-input'
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aaa@students.uwf.edu"
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
            />
          </div>
          <button type="submit">Login</button>
          <div>
            <Link to ="/register">
                Don't have an account? Click here
            </Link>
        </div>
        </form>

    </div>
    )
}

export default Login