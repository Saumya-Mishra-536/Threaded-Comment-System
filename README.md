# 🗨️ Threaded Comment System

A modern, responsive threaded comment system built with React and Express.js, featuring nested replies, curved connector lines, and a beautiful user interface.

![Threaded Comment System](https://img.shields.io/badge/React-18.2.0-blue.svg)
![Express](https://img.shields.io/badge/Express-4.18.2-green.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC.svg)
![Node.js](https://img.shields.io/badge/Node.js-Latest-brightgreen.svg)

## ✨ Features

- **Nested Comment Threading**: Unlimited depth comment nesting with visual hierarchy
- **Curved Connector Lines**: Beautiful curved lines connecting parent and child comments
- **Real-time Interactions**: Like comments, reply to any comment, and see updates instantly
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, intuitive interface with smooth animations and transitions
- **Avatar Generation**: Automatic avatar generation based on user names
- **Time Formatting**: Smart relative time display (e.g., "2 hr ago", "just now")
- **Load More Replies**: Show/hide additional replies for better performance

## 🏗️ Architecture

### Frontend (React + Tailwind CSS)
- **Components**: Modular, reusable React components
- **State Management**: Local state with React hooks
- **Styling**: Tailwind CSS with custom animations and transitions
- **API Integration**: Axios for HTTP requests with error handling

### Backend (Node.js + Express)
- **RESTful API**: Clean, well-structured API endpoints
- **Data Structure**: Hierarchical comment tree with unlimited nesting
- **In-memory Storage**: JSON-based storage (easily replaceable with database)
- **CORS Enabled**: Cross-origin resource sharing for frontend integration

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Threaded-Comment-System
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   The server will start on `http://localhost:5000`

2. **Start the Frontend Application**
   ```bash
   cd client
   npm start
   ```
   The frontend will start on `http://localhost:3000`

3. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

## 📡 API Endpoints

### Comments API

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/comments` | Retrieve all comments as nested structure | - |
| POST | `/comments` | Create a new comment or reply | `{ text, author, parentId? }` |
| POST | `/comments/:id/like` | Increment like count for a comment | - |
| POST | `/comments/:id/reply` | Create a reply to existing comment | `{ text, author }` |
| GET | `/health` | Health check endpoint | - |

### Response Format

**GET /comments** returns a hierarchical tree structure:
```json
[
  {
    "id": "1",
    "parentId": null,
    "text": "This is a root comment",
    "author": "Alice Johnson",
    "timestamp": "2024-01-15T10:30:00Z",
    "likes": 12,
    "children": [
      {
        "id": "2",
        "parentId": "1",
        "text": "This is a reply",
        "author": "Bob Smith",
        "timestamp": "2024-01-15T11:00:00Z",
        "likes": 5,
        "children": []
      }
    ]
  }
]
```

## 🎨 UI Components

### Comment Component
- **Avatar**: Auto-generated colored avatar with user's initial
- **User Info**: Name and relative timestamp
- **Content**: Comment text with proper formatting
- **Actions**: Like button with count, Reply button
- **Nested Replies**: Recursive rendering of child comments

### Comment Form
- **Input Fields**: Name and comment text with validation
- **Submit Button**: Loading state and disabled state handling
- **Error Handling**: Form validation and API error display

### Visual Features
- **Curved Connectors**: CSS-based curved lines between parent and child comments
- **Hover Effects**: Smooth transitions and elevation on hover
- **Loading States**: Spinner animations for async operations
- **Responsive Layout**: Mobile-first design with breakpoint adjustments

## 🛠️ Technical Implementation

### Curved Connector Lines
The curved lines between comments are implemented using CSS pseudo-elements:
```css
.comment-connector-curve::before {
  content: '';
  position: absolute;
  left: -20px;
  top: 0;
  width: 20px;
  height: 30px;
  border-left: 2px solid #dee2e6;
  border-bottom: 2px solid #dee2e6;
  border-radius: 0 0 0 15px;
}
```

### Comment Tree Building
The backend builds a hierarchical tree from flat comment data:
```javascript
function buildCommentTree(comments) {
  const commentMap = new Map();
  const rootComments = [];
  
  // Create map and build tree structure
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, children: [] });
  });
  
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
```

## 🎯 Key Features Implementation

### 1. Unlimited Nesting
- Comments support unlimited depth of nesting
- Frontend limits display depth to 3 levels for better UX
- Backend handles unlimited nesting in data structure

### 2. Real-time Updates
- Comments refresh after creating new comments or replies
- Like counts update immediately
- Optimistic UI updates with error handling

### 3. Responsive Design
- Mobile-first approach with Tailwind CSS
- Flexible layouts that adapt to different screen sizes
- Touch-friendly buttons and interactions

### 4. Performance Optimizations
- "Load more replies" functionality for large threads
- Efficient re-rendering with React keys
- Minimal API calls with smart caching

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

### Customization
- **Colors**: Modify `tailwind.config.js` for custom color schemes
- **Max Depth**: Change `maxDepth` in Comment component
- **API Base URL**: Update `API_BASE_URL` in `utils/api.js`

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the React app: `npm run build`
2. Deploy the `build` folder to your hosting platform
3. Set environment variables for API URL

### Backend (Render/Heroku)
1. Add a `start` script to package.json
2. Set environment variables (PORT, etc.)
3. Deploy to your preferred platform

## 🧪 Testing

### Manual Testing
- Create comments and replies
- Test like functionality
- Verify responsive design on different devices
- Check error handling with network issues

### Future Enhancements
- Unit tests with Jest and React Testing Library
- Integration tests for API endpoints
- End-to-end tests with Cypress

## 📝 Additional Features Implemented

### Beyond Requirements
- **Loading States**: Smooth loading indicators for all async operations
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Avatar Generation**: Automatic avatar generation based on user names
- **Time Formatting**: Smart relative time display
- **Responsive Design**: Mobile-optimized layout
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: Keyboard navigation and screen reader support

### Performance Features
- **Optimistic Updates**: Immediate UI feedback
- **Efficient Re-rendering**: Proper React key usage
- **Minimal API Calls**: Smart data fetching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**SDE-1 Intern** - Threaded Comment System Assignment

---

*Built with ❤️ using React, Express, and Tailwind CSS*
