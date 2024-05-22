// AuthContext.js
import React from 'react';

export const AuthContext = React.createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  isAdmin: false,
  setIsAdmin: () => {},
});
