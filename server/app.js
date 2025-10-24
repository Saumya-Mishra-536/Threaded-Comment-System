const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (in production, use a database)
let users = [
  // Demo user
  { id: 'u1', username: 'demo', password: 'demo' }
];
// token -> userId
const sessions = new Map();
// Track which users have liked which comments
// Format: { commentId: Set of userIds }
const commentLikes = new Map();

let comments = [
  {
    id: '1',
    parentId: null,
    text: 'This is a great article! Really enjoyed reading it.',
    author: 'Alice Johnson',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 12,
    children: []
  },
  {
    id: '2',
    parentId: null,
    text: 'I have some thoughts on the third point mentioned here.',
    author: 'Bob Smith',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    likes: 8,
    children: []
  },
  {
    id: '3',
    parentId: '1',
    text: 'Totally agree! The examples were really helpful.',
    author: 'Charlie Brown',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    likes: 5,
    children: []
  },
  {
    id: '4',
    parentId: '1',
    text: 'Could you elaborate on the second section?',
    author: 'Diana Prince',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    likes: 3,
    children: []
  },
  {
    id: '5',
    parentId: '3',
    text: 'Yes, the code examples were particularly clear.',
    author: 'Eve Wilson',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    likes: 2,
    children: []
  }
];

// Helper function to build nested comment tree
function buildCommentTree(comments) {
  const commentMap = new Map();
  const rootComments = [];

  // First pass: create map of all comments
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, children: [] });
  });

  // Second pass: build tree structure
  comments.forEach(comment => {
    if (comment.parentId === null) {
      rootComments.push(commentMap.get(comment.id));
    } else {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.children.push(commentMap.get(comment.id));
      }
    }
  });

  return rootComments;
}

// Helper function to get all comments in flat structure
function getAllComments() {
  return comments;
}

// Helper function to add comment
function addComment(comment) {
  comments.push(comment);
  return comment;
}

// Helper function to update comment likes
function updateCommentLikes(commentId, userId = 'anonymous') {
  const comment = comments.find(c => c.id === commentId);
  if (!comment) return null;

  // Get or create the set of users who liked this comment
  if (!commentLikes.has(commentId)) {
    commentLikes.set(commentId, new Set());
  }
  const userLikes = commentLikes.get(commentId);

  // Toggle like status
  if (userLikes.has(userId)) {
    // User has already liked, so unlike
    userLikes.delete(userId);
    comment.likes = Math.max(0, comment.likes - 1);
  } else {
    // User hasn't liked, so like
    userLikes.add(userId);
    comment.likes += 1;
  }

  return comment;
}

// Auth helpers
function createSession(userId) {
  const token = uuidv4();
  sessions.set(token, { userId, createdAt: Date.now() });
  return token;
}

function getUserFromToken(authHeader) {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  const token = parts[1];
  const session = sessions.get(token);
  if (!session) return null;
  const user = users.find(u => u.id === session.userId);
  return user || null;
}

function requireAuth(req, res, next) {
  const user = getUserFromToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = user;
  next();
}

// API Routes

// POST /auth/register - Basic register
app.post('/auth/register', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const exists = users.some(u => u.username.toLowerCase() === String(username).toLowerCase());
  if (exists) {
    return res.status(409).json({ error: 'Username already exists' });
  }
  const newUser = { id: uuidv4(), username, password };
  users.push(newUser);
  const token = createSession(newUser.id);
  res.status(201).json({ token, user: { id: newUser.id, username: newUser.username } });
});

// POST /auth/login - Basic login
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = createSession(user.id);
  res.json({ token, user: { id: user.id, username: user.username } });
});

// GET /comments - Retrieve all comments as nested threaded structure
app.get('/comments', (req, res) => {
  try {
    const nestedComments = buildCommentTree(getAllComments());
    res.json(nestedComments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve comments' });
  }
});

// POST /comments - Create a new comment or reply
app.post('/comments', (req, res) => {
  try {
    const { text, parentId, author } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const newComment = {
      id: uuidv4(),
      parentId: parentId || null,
      text,
      author,
      timestamp: new Date(),
      likes: 0,
      children: []
    };

    addComment(newComment);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// POST /comments/:id/like - Toggle like count for a specific comment
app.post('/comments/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    // For now, use 'anonymous' as userId since we don't have user authentication
    // In a real app, you'd get this from the authenticated user
    const updatedComment = updateCommentLikes(id, 'anonymous');

    if (!updatedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update likes' });
  }
});

// POST /comments/:id/reply - Create a reply to an existing comment
app.post('/comments/:id/reply', (req, res) => {
  try {
    const { id } = req.params;
    const { text, author } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Check if parent comment exists
    const parentComment = comments.find(c => c.id === id);
    if (!parentComment) {
      return res.status(404).json({ error: 'Parent comment not found' });
    }

    const newReply = {
      id: uuidv4(),
      parentId: id,
      text,
      author,
      timestamp: new Date(),
      likes: 0,
      children: []
    };

    addComment(newReply);
    res.status(201).json(newReply);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reply' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
