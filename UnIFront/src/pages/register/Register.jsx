/**
 * Register page to handle submitting a register form with a user's email, username, password, 
 */


import React, { useState } from 'react';
import './Register.css'

function Register () {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [username, setUsername] = useState('');
    const [school, setSchool] = useState('');


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Email: ', email, 'Password:', password, 'Password2:', password2, 'Username: ', username, 'School attending', school);
    }

    return (
        <div>
        <form onSubmit={handleSubmit}  className = 'registerForm'>

          {/* Email field */}
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


          {/* Username field */}
          <div>
            <label htmlFor="username">Username:</label>
            <input
              className='fancy-input'
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="enter your username"
            />
          </div>

          {/* Dropdown School field */}
          <div>
            <label htmlFor="schoolOptions">Select a school:</label>
            <select
                id="school"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="fancy-select"
            >
                <option value="UWF">University of West Florida</option>
                <option value="OTHER">Other</option>
            </select>
          </div>


          {/* Password field */}
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

             {/* Password2 field */}
            <div>
            <label htmlFor="password2">Re-enter your Password:</label> 
            <input
              className='fancy-input'
              type="password2"
              id="password2"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </div>
          <button type="submit">Register</button>
        </form>

    </div>
    )
}

export default Register