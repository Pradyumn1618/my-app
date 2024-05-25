import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { firestore, storage } from './firebase';
import Button from './components/button';
import { v4 } from 'uuid';
import { AuthContext } from './authContext';
import ReactQuill from 'react-quill';
import axios from 'axios';
import ErrorPopup from './error';
import 'react-quill/dist/quill.snow.css';
import './admin.css';

const Create = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isloading, setLoading] = useState(false);
  const [isGenerating, setGenerating] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const apikey = process.env.REACT_APP_GEMINI_API_KEY;

  const handleClose = () => {
    setShowErrorPopup(false);
  };


  const generateBlogContent = async () => {

    if (!title) {
      alert("Please provide title!");
      return;
    }

    setGenerating(true);

    try{
    const response = await axios({
      url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apikey,
      method: 'POST',
      data: {
        contents: [
          { parts: [{ text: "Generate a nicely formatted blog in HTML on " + title }] },
        ],
      },
    });
    setGenerating(false);
    if(response.data.candidates.length > 0){
    console.log(response.data.candidates[0].content.parts[0].text);
    let content = response.data.candidates[0].content.parts[0].text;
  
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
    setContent(content);
    }
  }catch (e) {
    console.error('Error generating blog content: ', e);
    setGenerating(false);
    setErrorMsg('Error generating blog content. Please try again later.');
    setShowErrorPopup(true);
  }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!content){
      window.alert("Please provide content!");
      return;
    }
    if(isGenerating)return;
    try {
      setLoading(true);
      const docRef = await addDoc(collection(firestore, 'Blogs'), {
        title,
        Content: content,
        Owner: user.displayName,
        email: user.email,
        imageUrl: '',
        createdAt: new Date(),
      });

      console.log('Document written with ID: ', docRef.id);

      if (imageFile !== null) {
        const storageRef = ref(storage, `blogs/${imageFile.name + v4()}`);
        await uploadBytes(storageRef, imageFile);
        const url = await getDownloadURL(storageRef);

        await updateDoc(doc(firestore, 'Blogs', docRef.id), {
          imageUrl: url,
        });

        console.log('Image URL updated: ', url);
      }



      setLoading(false);
      navigate('/admin');
    } catch (e) {
      setLoading(false);
      setErrorMsg('Error creating blog. Please try again later.');
      setShowErrorPopup(true);
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
      {showErrorPopup && <ErrorPopup message={errorMsg} onClose={handleClose} />}
      <header className='justify-between items-center'>
        <div className="w-full flex justify-start items-start p-4 mt-4">
        </div>
        <h2 className="text-3xl font-bold mb-6">Create New Blog</h2>
      </header>
      <div className="bg-black flex justify-center mt-0">  <div className="p-8 flex flex-col justify-center items-center bg-black text-white shadow hover:shadow-purple-500 h-auto w-full mx-8">
        <form onSubmit={handleSubmit} className="bg-black text-white sm:p-8 md:p-8 lg:p-8 rounded-lg shadow-lg w-full ">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog Title"
            required
            className="w-full p-2 mb-4 rounded bg-white text-black"
          />
          <ReactQuill
            value={content}
            onChange={setContent}
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
            // style={{ whiteSpace: 'pre-wrap' }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            placeholder="Image URL (optional)"
            className="w-full p-2 mb-4 rounded bg-white text-black"
          />
          <div className='justify-center items-center'>
            <div className='container flex flex-row justify-center items-center'>
              <Button type="submit" style={{ marginRight: '10px' }} disabled={isloading}>{isloading ? "Creating..." : "Create Blog"}</Button>
              <Button onClick={(event) => { event.preventDefault(); generateBlogContent(); }} disabled={isGenerating}>{isGenerating ? "Generating..." : "Generate Content"}</Button>
            </div>
          </div>
        </form>
      </div>
      </div>
    </div>

  );
};

export default Create;
