import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, browserSessionPersistence,updateProfile } from "firebase/auth";
import { auth, firestore,provider } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Button from './components/button';
import './admin.css';
import { AuthContext } from './authContext';
import ErrorPopup from './error';
import AOS from 'aos';

AOS.init({
  duration: 800,
});


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subloading, setSubLoading] = useState(false);
  const {setIsLoggedIn, setIsAdmin} = React.useContext(AuthContext);
  const [showErrorPopup,setShowErrorPopup] = useState(false);
  const [errorMsg,setErrorMsg]=useState('');

  const navigate = useNavigate();

  const handleClose = () => {
    setShowErrorPopup(false);
  };

  const handleEmailChange = async (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = async (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
try{
        setSubLoading(true);
        const userCredential = await signInWithEmailAndPassword(auth, email, password,{ persistence: browserSessionPersistence });
        const user = userCredential.user;
        const docRef = doc(firestore, 'Users', user.uid);
        const docSnap = await getDoc(docRef);

        if(user.displayName==null){
        await updateProfile(user, {
          displayName: docSnap.data().name
      });
    }
       
        setSubLoading(false);
          if (docSnap.exists()) {
            setIsLoggedIn(true);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', JSON.stringify(user));
            if (docSnap.data().isAdmin) {
              setIsAdmin(true);
              localStorage.setItem('isAdmin', 'true');
              console.log('Admin signed in');
              navigate('/admin');
            } else {
              setIsAdmin(false);
              localStorage.setItem('isAdmin', 'false');
              console.log('User signed in');
              console.log(user)
              navigate('/user');
            }
          } else {
            console.log('No such document!');
            navigate('/signup');
          }
}catch(error){
  setSubLoading(false);
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      console.log('Invalid user or password');
      setErrorMsg('Invalid user or password');
      setShowErrorPopup(true);
      navigate('/login');
      // Handle invalid user error
    } else {
      console.log(error);
      setErrorMsg('An error occurred');
      // Handle other errors
    }
    setShowErrorPopup(true);
}
  };

  const signInWithGoogle = async () => {
    try {
      
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const docRef = doc(firestore, 'Users', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      if (docSnap.data().isAdmin) {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin');
      } else {
        setIsAdmin(false);
        localStorage.setItem('isAdmin', 'false');
        navigate('/user');
      }
    } else {
      await setDoc(docRef, {
        isAdmin: false,
        email: user.email,
        name: user.displayName
      });
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/user');
    }
  
} catch (error) {
    console.error("Error signing in with Google", error);
    setErrorMsg('An error occurred');
    setShowErrorPopup(true);
  }
};

  return (
    <div className='min-h-screen flex sm:flex-row md:flex-row lg:flex-row flex-col items-center justify-center bg-black text-white overflow-hidden'>
      {showErrorPopup && <ErrorPopup message={errorMsg} onClose={handleClose} />}
       <div className="container mx-auto px-6 py-4 flex-col justify-between items-center" data-aos='fade-right'>
       <p className="text-4xl text-white mb-4">Welcome back!</p><p className="text-xl mb-12">Sign in to explore new content.</p>
          <Button className='w-full mb-6' onClick={() => navigate('/')}>Back To Home</Button>
</div>

        <div className='p-8 flex flex-col justify-center items-center bg-black text-white shadow hover:shadow-purple-500 h-80vh w-full mx-8 overflow-hidden' data-aos='fade-up'>
      <form onSubmit={handleSubmit} className='p-8 rounded-lg '>
        <h2 className='text-3xl font-bold mb-6'>Sign In</h2>
        <input 
          type="email" 
          value={email} 
          onChange={handleEmailChange} 
          placeholder='Email' 
          required 
          className='w-full p-2 mb-4 rounded bg-white text-black'
        />
        <input 
          type="password" 
          value={password} 
          onChange={handlePasswordChange} 
          placeholder='Password' 
          required 
          className='w-full p-2 mb-6 rounded bg-white text-black'
        />
        <div className='flex flex-col justify-center items-center'>
        <Button className='w-full mb-6' type="submit">{subloading ? 'Signing In...' : 'Sign In'}</Button>
        <div className='text-left w-full'>
        <p className='text-sm mb-6'>Don't have an account? <a href="/signup" className='text-blue-500'>Sign Up</a></p></div>
        <p className='mb-6'>Or</p>
        </div>
      </form>
        <Button className='w-full' onClick={() => signInWithGoogle()}>Sign In With Google</Button>
      </div>
        
    </div>
  );
}

export default LoginPage;
