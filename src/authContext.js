// AuthContext.js
import React from 'react';

export const AuthContext = React.createContext({
  isLoggedIn: false,
  isAdmin: false,
  user: null,
  setIsLoggedIn: () => {},
  setIsAdmin: () => {},
  setUser: () => {},
});
