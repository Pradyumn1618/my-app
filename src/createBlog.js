import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { firestore, auth, storage } from './firebase';
import Button from './components/button';
import { v4 } from 'uuid';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './admin.css';

const Create = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [owner, setOwner] = useState('');
  const [imageFile, setImageFile] = useState(null);
  // const [url,setImageUrl]=useState('');
  const [isloading, setLoading] = useState(false);
  const navigate = useNavigate();
  const uid = auth.currentUser.uid;


  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const docRef = doc(firestore, 'Users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOwner(docSnap.data().name);
        } else {
          console.log('No such document!');
        }
      } catch (e) {
        console.error('Error getting document: ', e);
      }
    };
    fetchOwner();
  }
    , [uid]);




  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const docRef = await addDoc(collection(firestore, 'Blogs'), {
        title,
        Content: content,
        Owner: owner,
        imageUrl: '', // Initially empty
        createdAt: new Date(),
      });

      console.log('Document written with ID: ', docRef.id);

      // Step 2: If there's an image, upload it and get the URL
      if (imageFile !== null) {
        const storageRef = ref(storage, `blogs/${imageFile.name + v4()}`);
        await uploadBytes(storageRef, imageFile); // Wait for upload to complete
        const url = await getDownloadURL(storageRef); // Get the URL after upload

        // Step 3: Update the document with the imageUrl
        await updateDoc(doc(firestore, 'Blogs', docRef.id), {
          imageUrl: url,
        });

        console.log('Image URL updated: ', url);
      }



      setLoading(false);
      // console.log('Document written with ID: ', docRef.id);
      navigate('/admin'); // Redirect to user page after submission
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
      <header className='justify-between items-center'>
      <div className="w-full flex justify-start items-start p-4 mt-4">  <Button onClick={() => window.history.back()}>Back</Button>
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
          />
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            placeholder="Image URL (optional)"
            className="w-full p-2 mb-4 rounded bg-white text-black"
          />
          <Button type="submit" >{isloading ? "Creating..." : "Create Blog"}</Button>
        </form>
      </div>
      </div>
    </div>

  );
};

export default Create;