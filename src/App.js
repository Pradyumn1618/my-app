import React,{useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import AdminPage from './admin';
import LoginPage from './login';
import Home from './home';
import UserPage from './user';
import SignupPage from './signup';
import BlogPage from './blog';
import Create from './createBlog';
import EditBlog from './editBlog';
import Edit from './edit';
import { AuthContext } from './authContext';
// import {auth} from './firebase'
// import { getAuth,onAuthStateChanged } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';

function App() {
  // const [user, setUser] = useState(null);
  // const auth = getAuth();
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser);
  //   });

  //   // Cleanup subscription on unmount
  //   return () => unsubscribe();
  // }, [auth]);

  // const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin }}>
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={isLoggedIn && isAdmin ? <AdminPage /> : <Navigate to="/login" replace />} />
        <Route path="/user" element={isLoggedIn && !isAdmin ? <UserPage /> : isLoggedIn && isAdmin ? <AdminPage /> : <Navigate to="/login" replace />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/blog/:id" element={isLoggedIn ? <BlogPage />: <Navigate to="/login" replace />} />
        <Route path="/createBlog" element={isLoggedIn && isAdmin ? <Create/>  : <Navigate to="/login" replace />}/>
        <Route path="/editBlog" element={isLoggedIn && isAdmin ? <EditBlog/>  : <Navigate to="/login" replace />}/>
        <Route path="/edit/:id" element={isLoggedIn&&isAdmin ? <Edit/>:<Navigate to="/login" replace/>}/>
        </Routes>
      </div>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;