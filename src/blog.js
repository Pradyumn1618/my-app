import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where, addDoc, Timestamp } from 'firebase/firestore';
import { firestore,auth } from './firebase';
import Button from './components/button';
import './App.css';

const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [successfullSubmit, setSuccessfullSubmit] = useState(false);
  const [loading, setLoading]=useState(false);
  const [displayedCommentsCount, setDisplayedCommentsCount] = useState(5);

  const user = auth.currentUser;

  // Fetch comments on initial render and whenever the blog post changes
  useEffect(() => {
    const fetchComments = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'Blogs', id, 'Comments'));
      const commentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      commentsData.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
      setComments(commentsData);
    };

    fetchComments();
    return () => {
      setSuccessfullSubmit(false);
    };
  }, [id,successfullSubmit]);

  useEffect(() => {
    const fetchBlog = async () => {
      const docRef = doc(firestore, 'Blogs', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBlog(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <div className="text-center text-white bg-black h-screen w-full">Loading...</div>;

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText) return; // Handle empty comment

    setLoading(true);
    // Create a new comment object
    // commentText.replace("/\n/g", '<br>');
    const newComment = {
        User: auth.currentUser.displayName,
      comment: commentText,
      createdAt: new Date(), // Assuming you want timestamp for comments
    };
    console.log(commentText);

    try {
        // const collectionRef = collection(firestore, 'Blogs', id, 'Comments');
      await addDoc(collection(firestore, 'Blogs', id, 'Comments'), newComment);
      setCommentText(''); // Clear comment input after submission
      setSuccessfullSubmit(true);
      setLoading(false);
    
    } catch (error) {
        console.error('Error adding comment:', error);
    }
    // fetchComments(); // Refetch comments to include the new one
};

  return (
    <div className='min-h-screen flex flex-row bg-black text-white'>
      <div className='w-1/5 bg-black text-white p-6'>
        <Button onClick={() => window.history.back()}>Back</Button>
      </div>
      <div className="flex flex-col bg-black text-white p-6 w-full">
        <div className='flex flex-col items-center justify-center w-full'>
        <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
        <img
          src={blog.imageUrl || 'https://www.patterns.dev/img/reactjs/react-logo@3x.svg'}
          alt={blog.title}
          className="sm:w-3/5 md:w-3/5 lg:w-3/5 h-auto object-cover rounded mb-4"
        />
        </div>
        <div className="text-lg text-gray-400 text-left mb-4"><i>Author: {blog.Owner}</i></div>
        <div className="mb-4 text-left text-white blog-content" style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: blog.Content }}/>        <div className="text-right mt-4">
          <span className="text-sm"><i>Dated: {new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}</i></span>
        </div>

        <hr className="w-full border-purple-700 mt-8 mb-4" />

        <div className='flex flex-col items-center justify-center'>
        
        <div className="sm:w-1/2 md:w-1/2 lg:w-1/2 mt-8 bg-black-800 flex flex-col items-center justify-center rounded p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Leave a Comment</h2>
          <form onSubmit={handleSubmitComment} className='w-full'>
            <textarea
              className="w-full p-8 rounded border border-gray-400 text-black bg-white"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment here..."
            />
            <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
          </div>
          <div className='w-full flex flex-col items-center justify-center'>

          {/* Displaying Comments */}
          <div className="mt-8 sm:w-4/5 md:w-4/5 lg:w-4/5">
  <h2 className='text-2xl font-bold mb-4 text-white'>Comments</h2>
  {comments.length > 0 ? (
    <>
      {comments.slice(0, displayedCommentsCount).map((comment) => (
        <div key={comment.id} className="border-b border-gray-400 p-4 mb-4 bg-black-700 rounded">
          <p className="font-bold mb-2 text-white text-left">{comment.User || user.name || 'Anonymous'}</p>
          <div style={{ whiteSpace: 'pre-wrap' }}><p className='text-white text-left'>{comment.comment}</p></div>
          <div className="text-right text-gray-400 text-sm">
            {comment.createdAt.toDate().toLocaleDateString()}
          </div>
        </div>
      ))}
      {comments.length > displayedCommentsCount && (
        <button onClick={() => setDisplayedCommentsCount(displayedCommentsCount + 5)}>
          Load More
        </button>
      )}
      {displayedCommentsCount === comments.length && (
        <button onClick={() => setDisplayedCommentsCount(5)}>
          Show Less
        </button>
      )}
    </>
  ) : (
    <p>No comments yet.</p>
  )}
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
