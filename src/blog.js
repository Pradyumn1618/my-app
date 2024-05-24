import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, onSnapshot, getDocs } from 'firebase/firestore';
import { firestore, auth } from './firebase';
import Button from './components/button';
import './App.css';
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos'; // Import AOS library

// Initialize AOS (optional, can be placed in a global configuration file)
AOS.init({
  duration: 800,
});


const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [successfullSubmit, setSuccessfullSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayedCommentsCount, setDisplayedCommentsCount] = useState(2);
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState({});
  const [replyVisibility, setReplyVisibility] = useState({});


  const user = auth.currentUser;

  useEffect(() => {
    const fetchComments = () => {
      const commentsCollection = collection(firestore, 'Blogs', id, 'Comments');
      const unsubscribe = onSnapshot(commentsCollection, (snapshot) => {
        let commentsData = snapshot.docs.map(async doc => {
          const commentId = doc.id;
          const commentData = doc.data();

          const repliesCollection = collection(firestore, 'Blogs', id, 'Comments', commentId, 'Replies');
          const replySnapshot = await getDocs(repliesCollection);
          const replies = replySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          return {
            id: commentId,
            replies,
            ...commentData
          };

        });
        Promise.all(commentsData).then(commentsWithReplies => {
          const commentObjects = commentsWithReplies.map(comment => {
            const { id, replies, ...commentData } = comment;
            return { id, replies, ...commentData };
          });

          commentObjects.sort((a, b) => b.createdAt - a.createdAt);

          setComments(commentObjects);
          const initialShowReplyInput = commentsData.reduce((acc, comment) => {
            acc[comment.id] = false;
            return acc;
          }, {});
          setShowReplyInput(initialShowReplyInput);
          setReplyVisibility(initialShowReplyInput);
          setLoading(false);
        });
      });

      return () => {
        unsubscribe();
        setSuccessfullSubmit(false);
      };
    };

    fetchComments();
  }, [id, successfullSubmit]);

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

  const toggleReplyInput = (commentId) => {
    setShowReplyInput({
      ...showReplyInput,
      [commentId]: !showReplyInput[commentId],
    });
  };
  const toggleReplyVisibility = (commentId) => {
    setReplyVisibility({
      ...replyVisibility,
      [commentId]: !replyVisibility[commentId],
    });
  };

  const handleSubmitReply = async (e, commentId) => {
    e.preventDefault();
    if (showReplyInput[commentId]) {
      console.log("here");
      console.log(replyText);
      if (!replyText) return;
      console.log("here2");
      const newReply = {
        User: auth.currentUser.displayName,
        comment: replyText,
        createdAt: new Date(), 
      };
      try {
        await addDoc(collection(firestore, 'Blogs', id, 'Comments', commentId, 'Replies'), newReply);
        setReplyText('');
        setSuccessfullSubmit(true);
        setLoading(false);
        setShowReplyInput({
          ...showReplyInput,
          [commentId]: false,
        });
      } catch (error) {
        console.error('Error adding reply:', error);
      }
    }
    else {
      toggleReplyInput(commentId);
    }
  }


  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText) return; // Handle empty comment

    setLoading(true);
    const newComment = {
      User: auth.currentUser.displayName,
      comment: commentText,
      createdAt: new Date(), // Assuming you want timestamp for comments
    };
    console.log(commentText);

    try {
      await addDoc(collection(firestore, 'Blogs', id, 'Comments'), newComment);
      setCommentText(''); // Clear comment input after submission
      setSuccessfullSubmit(true);
      setLoading(false);

    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-black text-white' >
      <div className="flex flex-col bg-black text-white p-6 sm:w-4/5 md:w-4/5 lg:w-4/5">
        <div className='flex flex-col items-center justify-center w-full'>
          <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
          <img
            src={blog.imageUrl || 'https://www.patterns.dev/img/reactjs/react-logo@3x.svg'}
            alt={blog.title}
            className="sm:w-3/5 md:w-3/5 lg:w-3/5 h-auto object-cover rounded mb-4"
          />
        </div>
        <div className="text-lg text-gray-400 text-left mb-4"><i>Author: {blog.Owner}</i></div>
        <div className="mb-4 text-left text-white blog-content" style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: blog.Content }} />        <div className="text-right mt-4">
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
                    <div key={comment.id} className="border-b border-gray-400 p-2 mb-4 bg-black-700 rounded h-auto">
                      <p className="font-bold mb-2 text-white text-left">{comment.User || user.name || 'Anonymous'}</p>
                      <div style={{ whiteSpace: 'pre-wrap' }}><p className='text-white text-left'>{comment.comment}</p></div>
                      <div className="text-right text-gray-400 text-sm">
                        {comment.createdAt.toDate().toLocaleDateString()}
                      </div>

                      <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-4" key={comment.id}>
                        {showReplyInput[comment.id] && (
                          <div className='relative'>
                            <textarea
                              value={replyText}
                              onChange={(e) => {
                                setReplyText(e.target.value);
                              }}
                              placeholder="Write your reply here..."
                              className="p-2 mb-6 rounded bg-white text-black w-full overflow-auto"
                            />
                            <button onClick={() => toggleReplyInput(comment.id)} className="absolute right-2 top-2 text-black">
                              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          </div>
                        )}
                        <div className='container flex justify-end'>
                          <button
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-1 px-4 rounded hover:from-blue-600 hover:to-purple-600 transition-all duration-500 shadow-lg"
                            type='submit'
                          >
                            {showReplyInput[comment.id] ? 'Submit Reply' : 'Reply'}
                          </button>
                        </div>
                      </form>
                      <button
                        onClick={() => toggleReplyVisibility(comment.id)}
                        className="bg-black text-gray-500 px-4 rounded mt-4"
                      >
                        {replyVisibility[comment.id] ? 'Hide Replies' : comment.replies.length > 0 ? `Show ${comment.replies.length} Replies` : 'No Replies'}
                      </button>
                      {replyVisibility[comment.id] && comment.replies.map(reply => (
                        <div className='container flex justify-end'>
                          <div key={reply.id} className="border-b border-gray-400 p-2 mb-2 bg-gray-900 rounded h-auto w-4/5 items-center text-sm">
                            <p className="font-bold mb-1 text-white text-left">{reply.User || user.name || 'Anonymous'}</p>
                            <div style={{ whiteSpace: 'pre-wrap' }}><p className='text-white text-left'>{reply.comment}</p></div>
                            <div className="text-right text-gray-400 text-xs">
                              {reply.createdAt.toDate().toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>


                  ))}
                  <div className='container flex flex-col justify-center items-center'>
                    {displayedCommentsCount > 4 && (
                      <button onClick={() => setDisplayedCommentsCount(displayedCommentsCount - 3)} className='mb-1 text-gray-500'>
                        Show Less
                      </button>
                    )}
                    {comments.length > displayedCommentsCount && (
                      <button onClick={() => setDisplayedCommentsCount(displayedCommentsCount + 3)} className='mt-1 text-gray-500'>
                        Load More
                      </button>
                    )}
                  </div>
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
