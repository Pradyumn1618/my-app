// AuthContext.js
import React, { useState } from 'react';

const isLoggedInFromStorage = JSON.parse(localStorage.getItem('isLoggedIn')) || false;
const isAdminFromStorage = JSON.parse(localStorage.getItem('isAdmin')) || false;

export const AuthContext = React.createContext({
  isLoggedIn: isLoggedInFromStorage,
  setIsLoggedIn: (value) => {
    localStorage.setItem('isLoggedIn', JSON.stringify(value));
  },
  isAdmin: isAdminFromStorage,
  setIsAdmin: (value) => {
    localStorage.setItem('isAdmin', JSON.stringify(value));
  },
});