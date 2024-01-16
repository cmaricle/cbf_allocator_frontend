// AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(() => {
    // Attempt to retrieve the authentication status from local storage
    const storedAuthStatus = localStorage.getItem('authenticated');
    return storedAuthStatus ? JSON.parse(storedAuthStatus) : false;
  });

  const login = () => {
    setAuthenticated(true);
  };

  const logout = () => {
    setAuthenticated(false);
  };

  // Store the authentication status in local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('authenticated', JSON.stringify(authenticated));
  }, [authenticated]);

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
