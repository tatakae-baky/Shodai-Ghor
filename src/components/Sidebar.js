import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiBox, FiMenu, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-gray-800 text-white h-screen ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <h2 className="text-xl font-bold">Shodai Ghor</h2>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded hover:bg-gray-700">
          <FiMenu />
        </button>
      </div>
      <nav>
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
        </ul>
      </nav>
      <div className="absolute bottom-0 w-full">
        <button className="flex items-center w-full p-4 hover:bg-gray-700">
          <FiLogOut className="mr-4" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;