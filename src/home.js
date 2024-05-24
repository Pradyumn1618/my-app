import React from 'react';
import './App.css';
import { useNavigate, Link } from 'react-router-dom';

import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos'; // Import AOS library

// Initialize AOS (optional, can be placed in a global configuration file)
AOS.init({
  duration: 800,
});


const HomePage = () => {
  const navigate = useNavigate();
  const HandleLogin = () => {
    navigate('/login');
  }
  return (
    <div className="min-h-screen bg-black text-white" data-aos="zoom-out">
      {/* Header */}
      <header className="bg-black text-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent">BlogSite</h1>
          <button className="bg-white text-black px-4 py-2 rounded hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-500 hover:to-red-500 hover:text-white transition-all duration-500" onClick={HandleLogin}>
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-sky py-20 flex items-center justify-center">
        <div className="container mx-auto px-6 items-center w-3/5 my-12">
          <div className="" data-aos="zoom-out">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent">Welcome to BlogSite</h2>
            <p className="text-2xl mb-6">
              Discover amazing articles, stay updated with the latest trends, and
              join a community of passionate readers and writers.
            </p>
            <button className="bg-white text-black px-4 py-2 rounded hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-500 hover:to-red-500 hover:text-white transition-all duration-500" onClick={HandleLogin}>
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* <div className='separator'></div> */}
      {/* Featured Posts */}
      <section className="container mx-auto px-6 py-10 bg-black text-white">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent ">Featured Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 shadow-right gap-6">
          {/* Post 1 */}
          <Link to="/blog/VGTGtyIQ32w12X2PjbCF">
            <div className="bg-black text-white rounded-lg p-6">
              <img
                src="https://cdn.pixabay.com/photo/2017/02/14/03/03/ama-dablam-2064522_1280.jpg"
                alt="Post 1"
                className="rounded-lg mb-4"
              />
              <h3 className="text-2xl font-bold mb-2">A Tour to Himalayas!</h3>
              <p className="text-gray-200">A brief description of the blog post goes here.</p>
            </div>
          </Link>
          {/* Post 2 */}
          <Link to="/blog/L6U1mZfXJxJEY5pBdV8A">
            <div className="bg-black text-white rounded-lg p-6">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/blog-site-e4aad.appspot.com/o/blogs%2Fhow-to-pick-perfect-meal-plan-Large.jpeg87a98219-e0da-4ef0-b408-bdc6be8d34b3?alt=media&token=6cec6735-4e89-4789-b763-e50c80451254"
                alt="Post 2"
                className="rounded-lg mb-4"
              />
              <h3 className="text-2xl font-bold mb-2">How to Pick the Perfect Program</h3>
              <p className="text-gray-200">A brief description of the blog post goes here.</p>
            </div>
          </Link>
          {/* Post 3 */}
          <Link to="/blog/cG4TVLxiKIJWBi9XGcMR">
            <div className="bg-black text-white rounded-lg p-6">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/blog-site-e4aad.appspot.com/o/blogs%2Fhow-to-make-a-habit-stick-scaled.jpgb71d7a88-5692-4bb0-82fa-9e03f4c57106?alt=media&token=a0e3b223-8a3c-4307-824f-5df4c34d343d4c11-a71a-da6b39f884db"
                alt="Post 3"
                className="rounded-lg mb-4"
              />
              <h3 className="text-2xl font-bold mb-2">Achieving Optimal Health</h3>
              <p className="text-gray-200">A brief description of the blog post goes here.</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
