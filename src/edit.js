import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import {firestore} from './firebase';
import {collection, getDoc,setDoc,doc} from 'firebase/firestore';
import Button from './components/button';

const Edit = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [subloading,setSubLoading]=useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = await getDoc(doc(firestore,'Blogs',id));
        setBlog(docRef.data());
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (event) => {
    setBlog({ ...blog, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
        setSubLoading(true);
        await setDoc(doc(firestore,'Blogs',id),blog);
        setSubLoading(false);
        console.log('Submitting edited blog:', blog); // For now, just log the data
    }
    catch(error){
        setSubLoading(false);
        setError(error);
    }
    // ... handle success or failure of submission
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
          <div className="w-full flex justify-start items-start p-4 mt-4">  <Button onClick={() => window.history.back()}>Back</Button>
</div>
      {isLoading && <p>Loading blog data...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {blog && (
        <div className="flex justify-center">  <div className="p-8 flex flex-col justify-center items-center bg-black text-white shadow hover:shadow-purple-500 h-80vh w-1/2 mx-8">
        <form onSubmit={handleSubmit} className="bg-black text-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Edit Blog Post</h2>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="shadow-sm bg-gray-50 text-black border focus:ring-indigo-500 focus:border-indigo-500 w-full sm:text-sm rounded-md px-3 py-2"
              value={blog.title}
              onChange={(e)=>handleChange(e)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block mb-2 text-sm font-medium">
              Content
            </label>
            <textarea
              id="content"
              name="Content"
              className="shadow-sm bg-gray-50 text-black border focus:ring-indigo-500 focus:border-indigo-500 w-full sm:text-sm rounded-md px-3 py-2"
              value={blog.Content}
              onChange={(e)=>handleChange(e)}
              required
            />
          </div>
          <Button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-indigo-500 text-white font-bold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={subloading?true:false}
          >
            {subloading?'Saving...':'Save Changes'}
          </Button>
        </form>
        </div>
        </div>
      )}
    </div>
  );
};

export default Edit;
