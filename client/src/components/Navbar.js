import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ currentUser, onLogout }) => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold text-gray-900">Threaded Comments</Link>
        <div className="flex items-center gap-4">
          {!currentUser ? (
            <>
              <Link to="/login" className="text-sm text-secondary-gray hover:text-primary-blue">Login</Link>
              <Link to="/register" className="text-sm text-white bg-primary-blue px-3 py-1.5 rounded-md hover:bg-blue-600">Register</Link>
            </>
          ) : (
            <>
              <span className="text-sm text-secondary-gray">{currentUser.username}</span>
              <button onClick={onLogout} className="text-sm text-secondary-gray hover:text-gray-900">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


