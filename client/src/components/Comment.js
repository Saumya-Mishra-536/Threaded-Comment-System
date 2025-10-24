import React, { useState } from 'react';
import { formatTimeAgo, generateAvatar } from '../utils/timeUtils';
import { commentsAPI } from '../utils/api';

const Comment = ({ comment, onCommentUpdate, depth = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [showMoreReplies, setShowMoreReplies] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const avatar = generateAvatar(comment.author);
  const maxDepth = 3; // Limit nesting depth for better UX

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    setIsLiked(true); // Set liked state immediately for visual feedback
    setIsAnimating(true); // Trigger animation
    
    // Reset animation after animation completes
    setTimeout(() => setIsAnimating(false), 300);
    
    try {
      await commentsAPI.likeComment(comment.id);
      onCommentUpdate(); // Refresh comments
    } catch (error) {
      console.error('Error liking comment:', error);
      setIsLiked(false); // Reset on error
    } finally {
      setIsLiking(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await commentsAPI.replyToComment(comment.id, {
        text: replyText,
        author: replyAuthor.trim() || 'Guest',
      });
      setReplyText('');
      setReplyAuthor('');
      setIsReplying(false);
      onCommentUpdate(); // Refresh comments
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

  const toggleShowMoreReplies = () => {
    setShowMoreReplies(!showMoreReplies);
  };

  const hasReplies = comment.children && comment.children.length > 0;
  const visibleReplies = showMoreReplies ? comment.children : comment.children.slice(0, 2);
  const hiddenRepliesCount = comment.children.length - 2;

  return (
    <div className={`comment-item bg-white rounded-lg shadow-sm border border-comment-border transition-all duration-200 ${
      depth > 0 ? 'ml-8 comment-connector-curve' : ''
    }`}>
      <div className="p-4">
        {/* Comment Header */}
        <div className="flex items-start space-x-3 mb-3">
          {/* Avatar */}
          <div className={`w-8 h-8 rounded-full ${avatar.colorClass} flex items-center justify-center text-white text-sm font-medium flex-shrink-0`}>
            {avatar.letter}
          </div>
          
          {/* Comment Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-gray-900 text-sm">{comment.author}</span>
              <span className="text-secondary-gray text-xs">•</span>
              <span className="text-secondary-gray text-xs">{formatTimeAgo(comment.timestamp)}</span>
            </div>
            
            {/* Comment Text */}
            <p className="text-gray-800 text-sm leading-relaxed mb-3">
              {comment.text}
            </p>
            
            {/* Comment Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center space-x-1 transition-colors ${
                  isLiked 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-secondary-gray hover:text-primary-blue'
                } ${
                  isLiking ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <svg className={`w-4 h-4 ${isAnimating ? 'heart-animation' : ''}`} fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className={`text-xs ${isLiked ? 'text-red-500' : ''}`}>{comment.likes}</span>
              </button>
              
              {depth < maxDepth && (
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="text-secondary-gray hover:text-primary-blue transition-colors text-xs font-medium"
                >
                  Reply
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {isReplying && (
          <div className="ml-11 mb-4 animate-fade-in">
            <form onSubmit={handleReply} className="bg-comment-bg rounded-lg p-3">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={replyAuthor}
                  onChange={(e) => setReplyAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  required
                />
                <textarea
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent resize-none"
                  required
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsReplying(false)}
                    className="px-3 py-1 text-sm text-secondary-gray hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!replyText.trim() || !replyAuthor.trim()}
                    className="px-4 py-1 bg-primary-blue text-white text-sm rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Nested Replies */}
        {hasReplies && (
          <div className="ml-11 space-y-4">
            {visibleReplies.map((childComment) => (
              <Comment
                key={childComment.id}
                comment={childComment}
                onCommentUpdate={onCommentUpdate}
                depth={depth + 1}
              />
            ))}
            
            {/* Show More Replies */}
            {!showMoreReplies && hiddenRepliesCount > 0 && (
              <button
                onClick={toggleShowMoreReplies}
                className="text-primary-blue hover:text-blue-600 text-sm font-medium transition-colors"
              >
                + {hiddenRepliesCount} more repl{hiddenRepliesCount === 1 ? 'y' : 'ies'}
              </button>
            )}
            
            {showMoreReplies && hiddenRepliesCount > 0 && (
              <button
                onClick={toggleShowMoreReplies}
                className="text-secondary-gray hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Show less
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
