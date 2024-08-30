import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiBox, FiMenu, FiLogOut, FiGift, FiHeart, FiMessageSquare, FiCpu } from 'react-icons/fi';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={`bg-gray-800 text-white h-screen ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 flex flex-col`}>
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <h2 className="text-xl font-bold">Shodai Ghor</h2>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded hover:bg-gray-700">
          <FiMenu />
        </button>
      </div>
      <nav className="flex-grow">
        <ul>
          <li>
            <Link to="/" className="flex items-center p-4 hover:bg-gray-700">
              <FiHome className="mr-4" />
              {!isCollapsed && <span>Home</span>}
            </Link>
          </li>
          <li>
            <Link to="/inventory" className="flex items-center p-4 hover:bg-gray-700">
              <FiBox className="mr-4" />
              {!isCollapsed && <span>Inventory</span>}
            </Link>
          </li>
          <li>
            <Link to="/my-donations" className="flex items-center p-4 hover:bg-gray-700">
              <FiGift className="mr-4" />
              {!isCollapsed && <span>My Donations</span>}
            </Link>
          </li>
          <li>
            <Link to="/all-donations" className="flex items-center p-4 hover:bg-gray-700">
              <FiHeart className="mr-4" />
              {!isCollapsed && <span>All Donations</span>}
            </Link>
          </li>
          <li>
            <Link to="/requests" className="flex items-center p-4 hover:bg-gray-700">
              <FiMessageSquare className="mr-4" />
              {!isCollapsed && <span>Requests</span>}
            </Link>
          </li>
          <li>
            <Link to="/chatbot" className="flex items-center p-4 hover:bg-gray-700">
              <FiCpu className="mr-4" />
              {!isCollapsed && <span>AI Chatbot</span>}
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4">
        <button onClick={handleLogout} className="flex items-center w-full p-2 hover:bg-gray-700 rounded">
          <FiLogOut className="mr-4" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;