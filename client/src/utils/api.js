import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Remove auth; open API

// Comments API
export const commentsAPI = {
  // Get all comments
  getAllComments: async () => {
    try {
      const response = await api.get('/comments');
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Create a new comment
  createComment: async (commentData) => {
    try {
      const response = await api.post('/comments', commentData);
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  // Like a comment
  likeComment: async (commentId) => {
    try {
      const response = await api.post(`/comments/${commentId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  },

  // Reply to a comment
  replyToComment: async (commentId, replyData) => {
    try {
      const response = await api.post(`/comments/${commentId}/reply`, replyData);
      return response.data;
    } catch (error) {
      console.error('Error replying to comment:', error);
      throw error;
    }
  },
};

export default api;
