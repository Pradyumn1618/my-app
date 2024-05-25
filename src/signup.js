import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile,sendEmailVerification } from "firebase/auth";
import { auth, firestore, provider } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import Button from './components/button';
import ErrorPopup from './error';
import AOS from 'aos'

AOS.init({
  duration: 800,
});

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [subloading, setSubLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const handleVisibility = (event) => {
    event.preventDefault();
    setIsVisible(!isVisible);
  };

  const navigate = useNavigate();

  const handleClose = () => {
    setShowErrorPopup(false);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setSubLoading(false);
      const user = userCredential.user;
      await sendEmailVerification(user).then(() => {
        console.log('Email verification sent');
        alert('Email Verification Sent');
      });
      await updateProfile(user, {
        displayName: name
      });
      const docRef = doc(firestore, 'Users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        navigate('/login');
        console.log('User already exists');
      } else {
        await setDoc(docRef, {
          name: name,
          email: email,
          isAdmin: false
        });
        navigate('/login');
        console.log('User created');

      }

    }
    catch (error) {
      setSubLoading(false);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('Email already in use');
        setShowErrorPopup(true);
      }
      console.error(error);
    }
  };

  const signUpWithGoogle = async () => {
    try {
      signInWithPopup(auth, provider).then((result) => {
        const user = result.user;
        const docRef = doc(firestore, 'Users', user.uid);
        getDoc(docRef).then((docSnap) => {

          if (docSnap.exists()) {
            if (docSnap.data().isAdmin) {
              navigate('/admin');
            } else {
              navigate('/user');
            }
          } else {
            setDoc(docRef, {
              isAdmin: false,
              email: user.email,
              name: user.displayName
            });
            navigate('/user');
          }
        }
        )
          .catch((error) => {
            setErrorMsg('Unexpected Error Occured')
            console.error(error);
          });
        console.log('User signed in');
      }
      ).catch((error) => {
        setErrorMsg('Unexpected Error Occured')
        console.error(error);
      });

    }
    catch (error) {
      setErrorMsg('Unexpected Error Occured')
      console.error(error);
    }
  }

  return (
    <div className='min-h-screen flex sm:flex-row md:flex-row lg:flex-row flex-col items-center justify-center bg-black text-white overflow-hidden'>
      {showErrorPopup && <ErrorPopup message={errorMsg} onClose={handleClose} />}

      <div className="container mx-auto px-6 py-4 flex-col justify-between items-center" data-aos='fade-right'>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent mb-8">BlogSite</h1>
        <p className="text-xl text-white mb-8">Join a community of passionate readers and writers!</p>
        <Button className='w-full mb-6' onClick={() => navigate('/')}>Back To Home</Button>
      </div>

      <div className='p-8 flex flex-col justify-center items-center bg-black text-white shadow hover:shadow-purple-500 h-80vh w-full mx-8 overflow-hidden' data-aos='fade-up'>
        <form onSubmit={handleSubmit} className='p-8 rounded-lg'>
          <h2 className='text-3xl font-bold mb-6'>Sign Up</h2>
          <input type="text" value={name} onChange={handleNameChange} placeholder='  Name' required className='w-full p-2 mb-4 rounded bg-white text-black' />

          <input type="email" value={email} onChange={handleEmailChange} placeholder='  Email' required className='w-full p-2 mb-4 rounded bg-white text-black' />

          <div className='relative'>
            <input
              type={isVisible ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              placeholder='Password'
              required
              className='p-2 mb-6 rounded bg-white text-black w-full'
            />
            <button type="button" className='absolute right-0 bottom-2.5 text-black bg-white mb-6 mx-2 text-sm' onClick={handleVisibility}>{isVisible ? 'HIDE' : 'SHOW'}</button>
          </div>      <div className='flex flex-col justify-center items-center'>
            <Button className='w-full mb-6' type="submit">{subloading ? 'Signing Up...' : 'Sign Up'}</Button>
            <div className='text-left w-full'>
              <p className='text-sm mb-6'>Already an user? <Link to="/login" className='text-blue-500'>Sign In</Link></p></div>
            <p className='mb-6'>Or</p>
          </div>
        </form>

        <Button className='w-full' onClick={() => signUpWithGoogle()}>Sign Up With Google</Button>
      </div>

    </div>
  );
}

export default SignupPage;

