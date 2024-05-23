import React,{useEffect, useState} from 'react';
import { HashRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import AdminPage from './admin';
import LoginPage from './login';
import Home from './home';
import UserPage from './user';
import SignupPage from './signup';
import BlogPage from './blog';
import Create from './createBlog';
import EditBlog from './editBlog';
import Edit from './edit';
import AllUsers from './AllUsers';
import { AuthContext } from './authContext';
// import {auth} from './firebase'
// import { getAuth,onAuthStateChanged } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user,setUser]=useState(null);
  

  useEffect(() => {
    setIsLoggedIn(JSON.parse(localStorage.getItem('isLoggedIn')) || false);
    setIsAdmin(JSON.parse(localStorage.getItem('isAdmin')) || false);
    setUser(JSON.parse(localStorage.getItem('user')) || null);
    setIsLoading(false);
  }, []);
  
  if (isLoading) {
    return <div>Loading...</div>; // Replace this with your actual loading component
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn, isAdmin, user, setIsLoggedIn, setIsAdmin, setUser
    }}>
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
        <Route path="/AllUsers" element={isLoggedIn&&isAdmin? <AllUsers/>:<Navigate to="/login" replace/>}/>
        </Routes>
      </div>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;