// UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context
const UserContext = createContext();

//This is weird, and I may not entirely understand what it's doing.
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);


  //For local storage, whenever the page is loaded, the saved user is in.
   useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if(savedUser){
        setUser(JSON.parse(savedUser));
    }
   }, []);


  // A method to update user info (for example, after login)
  const login = (userData) => {
    setUser(userData);
    //This is where the local storage on the browser is so that you aren't 'logged out' on page refresh
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  const deleteUser = () => {
    setUser(null); // Clear user from context
    sessionStorage.removeItem('user'); // Remove user from sessionStorage
    localStorage.removeItem('authToken'); // Optionally clear authToken from localStorage
  };

  return (
    <UserContext.Provider value={{ user, login, logout, deleteUser}}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the UserContext
export const useUser = () => useContext(UserContext);