// UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context
const UserContext = createContext();

//This is weird, and I may not entirely understand what it's doing.
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);



  //For local storage, whenever the page is loaded, the saved user is in.
   useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    const savedToken = sessionStorage.getItem('token');

    if(savedUser){
      try{
        setUser(JSON.parse(savedUser));
      } catch(error){
        console.error("Error parsing user data:", error);
        sessionStorage.removeItem('user');
      }

      if(savedToken){
        setToken(savedToken)
      }
    }
   }, []);


  // A method to update user info (for example, after login)
  const login = (userData, token ) => {
    setUser(userData);
    setToken(token);
    //This is where the local storage on the browser is so that you aren't 'logged out' on page refresh
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('token', token);

  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('user');
    localStorage.removeItem('token'); 
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout}}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the UserContext
export const useUser = () => useContext(UserContext);