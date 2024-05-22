import React from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Post 1 */}
          <div className="bg-black text-white rounded-lg shadow-md p-6">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Post 1"
              className="rounded-lg mb-4"
            />
            <h3 className="text-2xl font-bold mb-2">Post Title 1</h3>
            <p className="text-gray-200">A brief description of the blog post goes here.</p>
          </div>
          {/* Post 2 */}
          <div className="bg-black text-white rounded-lg shadow-md p-6">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Post 2"
              className="rounded-lg mb-4"
            />
            <h3 className="text-2xl font-bold mb-2">Post Title 2</h3>
            <p className="text-gray-200">A brief description of the blog post goes here.</p>
          </div>
          {/* Post 3 */}
          <div className="bg-black text-white rounded-lg shadow-md p-6">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Post 3"
              className="rounded-lg mb-4"
            />
            <h3 className="text-2xl font-bold mb-2">Post Title 3</h3>
            <p className="text-gray-200">A brief description of the blog post goes here.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
