import React, { useState, useEffect } from 'react';
import CommentForm from './components/CommentForm';
import Comment from './components/Comment';
import { commentsAPI } from './utils/api';
import './index.css';

function App() {
  // Auth removed; always allow posting
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await commentsAPI.getAllComments();
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleCommentAdded = () => fetchComments();
  const handleCommentUpdate = () => fetchComments();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comments...</p>
        </div>
      </div>
    );
  }

  const Home = (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Threaded Comments System</h1>
          <p className="text-gray-600">Share your thoughts and engage in meaningful discussions</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}
        <CommentForm onCommentAdded={handleCommentAdded} />
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Comments ({comments.length})</h2>
            <button onClick={fetchComments} className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">Refresh</button>
          </div>
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
              <p className="text-gray-600">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <Comment key={comment.id} comment={comment} onCommentUpdate={handleCommentUpdate} depth={0} />
              ))}
            </div>
          )}
        </div>
        <footer className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">Built with React, Express, and Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );

  return Home;
}

export default App;
