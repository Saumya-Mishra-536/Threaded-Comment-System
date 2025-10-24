import React, { useState } from 'react';
import { commentsAPI } from '../utils/api';

const CommentForm = ({ onCommentAdded }) => {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    setError(null);
    setIsSubmitting(true);
    try {
      await commentsAPI.createComment({
        text: text.trim(),
        author: author.trim() || 'Guest',
      });
      
      setText('');
      setAuthor('');
      onCommentAdded(); // Refresh comments
    } catch (error) {
      const message = error?.response?.data?.error || (error?.response?.status === 401 ? 'Unauthorized: please log in again.' : 'Error creating comment');
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-2 text-sm text-red-700 mb-3">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-40 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />
        <input
          type="text"
          placeholder="Add a comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={!text.trim() || !author.trim() || isSubmitting}
          className="px-4 py-2 bg-gray-100 text-gray-800 text-sm rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
