import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiBox, FiMenu, FiLogOut, FiGift, FiHeart, FiMessageSquare, FiCpu } from 'react-icons/fi';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`bg-[#F2DEB7] text-[#FF7A00] h-screen ${isCollapsed ? 'w-16' : 'w-60'} transition-all duration-300 flex flex-col`}>
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-4`}>
        {!isCollapsed && (
          <div className="flex items-center">
            <img src="/images/food.svg" alt="ShodaiGhor Logo" className="w-8 h-8 mr-2" />
            <h2 className="text-xl font-bold">
              <span className="text-[#2B3674]">Shodai</span>
              <span className="text-[#FF7A00]">Ghor</span>
            </h2>
          </div>
        )}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded hover:bg-[#c45c0a] hover:text-white">
          <FiMenu />
        </button>
      </div>
      <nav className="flex-grow">
        <ul>
          {[{ path: '/', icon: FiHome, label: 'Home' },
            { path: '/inventory', icon: FiBox, label: 'Inventory' },
            { path: '/my-donations', icon: FiGift, label: 'My Donations' },
            { path: '/all-donations', icon: FiHeart, label: 'All Donations' },
            { path: '/requests', icon: FiMessageSquare, label: 'Requests' },
            { path: '/chatbot', icon: FiCpu, label: 'AI Chatbot' },
          ].map(({ path, icon: Icon, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center p-4 hover:bg-[#c45c0a] hover:text-white ${
                  isActive(path) ? 'bg-[#c45c0a] shadow-md text-white' : ''
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className={isCollapsed ? '' : 'mr-4'} />
                {!isCollapsed && <span>{label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={`p-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button onClick={handleLogout} className={`flex items-center p-2 hover:bg-[#c45c0a] hover:text-white rounded ${isCollapsed ? 'w-10 h-10 justify-center' : 'w-full'}`}>
          <FiLogOut className={isCollapsed ? '' : 'mr-4'} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;