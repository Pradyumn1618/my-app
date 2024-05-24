import React, { useState, useEffect, useContext } from 'react';
import { collection, deleteDoc, doc, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { firestore } from './firebase';
import { AuthContext } from './authContext';
import './App.css';

const EditBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = () => {
      const userId = user.displayName; 
      const blogsQuery = query(collection(firestore, 'Blogs'), where('Owner', '==', userId));
      const unsubscribe = onSnapshot(blogsQuery, (snapshot) => {
        const fetchedBlogs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        fetchedBlogs.sort((a,b)=>b.createdAt.toDate()-a.createdAt.toDate());
        setIsLoading(false);
        setBlogs(fetchedBlogs);
      });
      return () => unsubscribe();
    };

    fetchBlogs();
  }, [user.displayName]);

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    const blogDoc = doc(firestore, 'Blogs', blogId);
    await deleteDoc(blogDoc);
    setBlogs(blogs.filter(blog => blog.id !== blogId));
  };

  const handleEdit = async (id) => {
    navigate(`/edit/${id}`)
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-black text-white text-center'>
        Loading...
      </div>
    );
  }
  return (

    <div className="min-h-screen flex flex-col bg-black text-white w-full px-4 py-8 h-auto">
      <header className='flex flex-row justify-center items-center'>
        <div className='w-full flex flex-col justify-center items-center'> <h1 className="text-4xl text-center font-bold mb-4 font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent">Your Blogs</h1></div></header>

      {blogs.length > 0 ? (
        <>
          <div className='w-full flex flex-col h-auto'>
            <table className="table-auto sm:w-4/5 md:w-4/5 lg:w-4/5 mx-auto shadow-md rounded-md overflow-hidden">
              <thead>
                <tr className="bg-gray-100 w-full bg-black font-medium flex flex-row justify-between items-center">
                  <th className="px-4 py-2 sm:text-2xl md:text-2xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent w-1/2">Title</th>
                  <th className="px-4 py-2 sm:text-2xl md:text-2xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent w-1/4">Date</th>
                  <th className="px-4 py-2 sm:text-2xl md:text-2xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent w-1/4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map(blog => (
                  <tr key={blog.id} className="w-full flex flex-row justify-between items-center" style={{ boxShadow: '4px 4px 0px rgba(255, 255,255,0.3)', hover: { boxShadow: '0 8px 10px rgba(255,255,255,1)' } }}>  <td className="py-4 w-1/2 sm:text-base md:text-base text-xs">  <h3 className="text-lg font-medium mb-1 sm:text-base md:text-base text-xs">{blog.title.substring(0, 30) + "..."}</h3>  <p
                    className="text-gray-700 text-base leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{ __html: blog.Content.substring(0, 100) + '...' }}
                  />               </td>
                    <td className="px-4 py-4 sm:text-base md:text-base text-xs flex justify-center items-center w-1/4">  {blog.createdAt.toDate().toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4  flex justify-center items-center w-1/4">
                      <button
                        className="px-3 py-1 sm:mx-1 md:mx-1 sm:text-base md:text-base text-xs font-medium text-center text-white flex flex-row bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => handleEdit(blog.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 sm:mx-1 md:mx-1 sm:text-base md:text-base text-xs font-medium text-center text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => handleDelete(blog.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div></>) :
        <>
          <tr className="w-full flex flex-row justify-center items-center"><td className="py-4 text-center" colSpan="3">No blogs found</td></tr></>
      }

    </div>
  );
};

export default EditBlog;
