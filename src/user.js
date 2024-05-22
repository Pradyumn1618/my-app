import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { firestore, auth } from './firebase';
import { signOut } from 'firebase/auth';
import Button from './components/button';
import { AuthContext } from './authContext';
import './App.css';

const UserPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  const [user, setUser] = useState(null);
  const [loading, setIsLoading] = useState(true); // Add loading state
  const { setIsLoggedIn } = React.useContext(AuthContext);
  const [name, setName] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 900);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await auth.currentUser;
      if (user) {
        setUser(user);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchName = async () => {
      const user = await auth.currentUser;
      if (user) {
        // const docRef=doc(collection, 'Users', user.uid);
        const docSnap = await getDoc(doc(firestore, 'Users', user.uid));
        setName(docSnap.data().name);
      }
    };

    fetchName();
  }, []);


  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'Blogs'));
      const blogsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlogs(blogsData);
      setFilteredBlogs(blogsData);
    };

    fetchBlogs();

  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterBlogs(query);
  };

  const filterBlogs = (query) => {
    if (!query) {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(blog =>
        blog.title.toLowerCase().includes(query.toLowerCase()) ||
        blog.Content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  };

  if (loading) return <div className="text-center text-white bg-black h-screen w-full">Loading...</div>;

  const handleLogout = () => {
    setSidebarOpen(false);
    setIsLoggedIn(false);
    signOut(auth);
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className='min-h-screen bg-black text-white overflow-hidden flex flex-col'>
      <header className="bg-black text-white shadow-md w-full px-6 py-4 fixed justify-center items-center">
        {/* <div className="container mx-auto px-6 py-4 flex justify-between items-center"> */}
        <div className='flex items-center justify-between'>
          <div className='hidden sm:flex md:flex lg:flex'>
            <button onClick={toggleSidebar} className="bg-white text-black px-4 py-2 rounded hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-500 hover:to-red-500 hover:text-white transition-all duration-500">
              Profile
            </button>
          </div>
          
          <div className='w-1/2 hidden sm:flex md:flex lg:flex'>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder=" Search blogs..."
              className={`px-4 py-2 rounded text-black w-1/2`}
            />

            </div>
            <div className='flex sm:hidden md:hidden lg:hidden'>
            <div>
            <button onClick={toggleSidebar} className="bg-white text-black px-4 py-2 rounded hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-500 hover:to-red-500 hover:text-white transition-all duration-500">
              Profile
            </button>
          </div>
          
          <div className='w-1/2'>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search blogs..."
              className='px-4 py-2 rounded text-black w-1/2'
            />
            </div>

            </div>
            <div className="md:text-5xl lg:text-6xl sm:text-4xl text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent text-center">BlogSite
          </div>


          {/* </div> */}

        </div>
      </header>
      <hr className='solid border-purple-500'></hr>

      <div className={`fixed top-0 left-0 w-64 h-full bg-black text-white transform ${sidebarOpen ? 'translate-x-0 shadow-right' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-20`}>
        <div className="p-4 mt-2">
          <div className="flex items-center justify-between">
            <div></div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent">{name}</h2>
            <button onClick={toggleSidebar} className="text-white">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <hr className='my-4 border-gray-500'></hr>
          <div className="mt-4 mb-8">
            <p className="text-sm">{user?.email}</p>
          </div>
          <button
            className="bg-black text-white font-bold mb-4 px-4 py-2 rounded transition-all duration-500 hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-500 hover:to-red-500 shadow-md shadow-white-500 hover:shadow:lg button w-48"
            onClick={handleLogout}
            style={{ boxShadow: '0 4px 6px rgba(255, 255,255,0.3)', hover: { boxShadow: '0 8px 10px rgba(255,255,255,1)' } }}
          >
            Logout
          </button>           </div>
      </div>

      <div className={`${sidebarOpen ? 'md:ml-40 lg:ml-40' : ''} transition-margin duration-300 ease-in-out w-full flex flex-col items-center justify-center mt-24 px-4 ${sidebarOpen ? 'sm:bg-transparent bg-black bg-opacity-50' : ''}`}>
        <div className='grid md:grid-cols-2 gap-6 w-2/3'>
          {filteredBlogs.map(blog => (
            <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden blog-card mx-auto w-full">
              <Link to={`/blog/${blog.id}`}>
                <img
                  src={blog.imageUrl || 'https://www.patterns.dev/img/reactjs/react-logo@3x.svg'}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </Link>
              <div className="p-4">
                <div className="flex flex-col mb-2">
                  <div className="text-gray-500 text-left font-medium mb-2">{blog.Owner}</div>
                  <h3 className="text-2xl font-bold text-black">{blog.title}</h3>
                </div>
                <p className="text-gray-700 text-base leading-relaxed mb-4">{blog.Content.substring(0, 100)}...</p>
                <Link to={`/blog/${blog.id}`} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-700">
                  Read More
                  <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns
                    ="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                </Link>
                <p className="text-right text-gray-400 text-sm mt-4">
                  {new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default UserPage;
