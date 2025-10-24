// Utility functions for time formatting

export const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const commentTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now - commentTime) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hr ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  // For older comments, show the actual date
  return commentTime.toLocaleDateString();
};

export const generateAvatar = (name) => {
  // Generate a simple avatar based on the first letter of the name
  const firstLetter = name.charAt(0).toUpperCase();
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  
  const colorIndex = name.charCodeAt(0) % colors.length;
  return {
    letter: firstLetter,
    colorClass: colors[colorIndex],
  };
};
