import React from 'react';
import { NavLink } from 'react-router-dom';
import { Package, ShoppingCart, LogOut } from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
      
      <nav className="flex-1">
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-3 rounded-lg mb-2 ${
              isActive ? 'bg-gray-800' : 'hover:bg-gray-800'
            }`
          }
        >
          <ShoppingCart size={20} />
          <span>Orders</span>
        </NavLink>
        
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-3 rounded-lg mb-2 ${
              isActive ? 'bg-gray-800' : 'hover:bg-gray-800'
            }`
          }
        >
          <Package size={20} />
          <span>Products</span>
        </NavLink>
      </nav>
      
      <button
        className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-800 mt-auto"
        onClick={onLogout}
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;