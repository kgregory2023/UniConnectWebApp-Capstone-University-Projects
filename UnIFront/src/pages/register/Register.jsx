/**
 * Register page to handle submitting a register form with a user's email, username, password, and school attending,
 * with a link to return to login page
 * Author: @MMcClure313
 */


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Register.css'

function Register () {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [username, setUsername] = useState('');
    const [uni, setUni] = useState('UWF');
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState(''); 

    const navigate = useNavigate();
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(!(password == password2)){
          setError('The passwords must match');
          return;
        }

        

        setError('');
        setIsLoading(true);

        //This is where the api call
        console.log('Email: ', email, 'Password:', password, 'Password2:', password2, 'Username: ', username, 'uni attending', uni);

        try{
          console.log(JSON.stringify({
            email,
            password,
            username,
            uni,
        }));

        const response = await fetch('http://localhost:5000/users/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email,
              password,
              username,
              uni,
          }),
      });


      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occured during registration');
      } else{
        navigate('/login'); 
      }

    } catch (error){
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }

  }

    return (
        <div>
            <h1 style={{ marginBottom: '20px'}}>
                Register
            </h1>
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
              required
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
              required
            />
          </div>

          {/* Dropdown School field */}
          <div>
            <label htmlFor="uni">Select a school:</label>
            <select
                id="uni"
                value={uni}
                onChange={(e) => setUni(e.target.value)}
                className="fancy-select"
                required
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
              required
            />
          </div>

             {/* Password2 field */}
            <div>
            <label htmlFor="password2">Re-enter your Password:</label> 
            <input
              className='fancy-input'
              type="password"
              id="password2"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>
        {/* conditionally only shows the error message if there even is one. */}
        {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={isLoading}>{isLoading ? 'Registering...' : 'Register'}</button>
          <div>
            <Link to ="/login">
                Already have an account? Click here
            </Link>
        </div>
        </form>




    </div>
    )
}

export default Register