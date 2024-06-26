import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firestore, storage } from './firebase';
import { getDoc, setDoc, doc, updateDoc} from 'firebase/firestore';
import { ref,uploadBytes, getDownloadURL} from 'firebase/storage';
import Button from './components/button';
import { useNavigate } from 'react-router-dom';
import ErrorPopup from './error';
import { v4 } from 'uuid';
import Popup from './popup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';



const Edit = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [subloading, setSubLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const nav = useNavigate();



  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = await getDoc(doc(firestore, 'Blogs', id));
        setBlog(docRef.data());
      } catch (error) {
        setErrorMsg(error.message);
        setShowErrorPopup(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleClose = () => {
    setShowErrorPopup(false);
  };

  const handleChange = (event) => {
    setBlog({ ...blog, [event.target.name]: event.target.value });
  };

  const handleChangeContent = (event) => {
    setBlog({ ...blog, Content: event }); // Update Content state with entire event object
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubLoading(true);
      const updatedBlog = {...blog, createdAt: new Date()};
      // const docRef = await getDoc(doc(firestore, 'Blogs', id));
      await setDoc(doc(firestore, 'Blogs', id), updatedBlog);
      if (imageFile !== null) {
        const storageRef = ref(storage, `blogs/${imageFile.name + v4()}`);
        await uploadBytes(storageRef, imageFile);
        const url = await getDownloadURL(storageRef);

        await updateDoc(doc(firestore, 'Blogs', id), {
          imageUrl: url,
        });

        console.log('Image URL updated: ', url);
      }
      setSubLoading(false);
      setPopupMessage('Blog updated successfully!');
      setIsPopupOpen(true);
      setTimeout(() => {
        setIsPopupOpen(false);
        nav('/admin');
      }, 1000);
      console.log('Submitting edited blog:', blog); // For now, just log the data
    }
    catch (error) {
      setSubLoading(false);
      setErrorMsg(error.message);
      setShowErrorPopup(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className='justify-between items-center'>
        <div className="w-full flex justify-start items-start p-4 mt-4">
        </div>
        <h2 className="text-2xl font-bold mb-4">Edit Blog Post</h2>
      </header>
      {isLoading && <p>Loading blog data...</p>}
      {showErrorPopup && <ErrorPopup message={errorMsg} onClose={handleClose} />}
      {blog && (
        <div className="flex justify-center">  <div className="p-8 flex flex-col justify-center items-center bg-black text-white shadow hover:shadow-purple-500 h-auto w-full mx-8">
          <form onSubmit={handleSubmit} className="bg-black text-white p-8 rounded-lg shadow-lg w-full">
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
                onChange={(e) => handleChange(e)}
                required
              />
            </div>
            <div className="mb-12">
              <label htmlFor="content" className="block mb-2 text-sm font-medium">
                Content
              </label>
              <ReactQuill
                value={blog.Content}
                name="Content"
                id='Content'
                onChange={(e) => handleChangeContent(e)}
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                    ['blockquote', 'code-block'],

                    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                    [{ 'direction': 'rtl' }],                         // text direction

                    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                    [{ 'font': [] }],
                    [{ 'align': [] }],

                    ['clean'],                                         // remove formatting button

                    ['link', 'image', 'video']                         // link and image, video
                  ]
                }}
                className="w-full p-2 mb-6 rounded bg-white text-black h-60vh overflow-scroll"
              />
              <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            placeholder="Image URL (optional)"
            className="w-full p-2 mb-4 rounded bg-white text-black"
          />
            </div>
            <Button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-indigo-500 text-white font-bold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={subloading ? true : false}
            >
              {subloading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </div>
        </div>
      )}
      <Popup isOpen={isPopupOpen} message={popupMessage} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
};

export default Edit;
