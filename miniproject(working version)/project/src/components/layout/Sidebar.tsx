import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, Users, MessageCircle, Settings, X, Heart, LogOut
} from 'lucide-react';

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { logout } = useAuth();
  
  const navItems = [
    { label: 'Dashboard', icon: <Home size={20} />, path: '/' },
    { label: 'Customers', icon: <Users size={20} />, path: '/customers' },
    { label: 'AI Chat', icon: <MessageCircle size={20} />, path: '/chat' },
    { label: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 lg:hidden">
        <button 
          onClick={onClose}
          className="ml-auto text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="p-5 flex items-center">
        <div className="p-1.5 bg-primary-100 rounded-lg mr-2">
          <Heart className="h-6 w-6 text-primary-500" />
        </div>
        <h1 className="text-lg font-semibold text-gray-800">HomeBiz Insight</h1>
      </div>
      
      <div className="mt-2 flex-1">
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `group flex items-center px-4 py-3 text-sm font-medium transition-all ${
                  isActive 
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-500 hover:bg-primary-50'
                }`
              }
              end={item.path === '/'}
            >
              {({ isActive }) => (
                <>
                  <span className={`mr-3 ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-primary-400'}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 mt-auto">
        <button
          onClick={logout}
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
        >
          <LogOut size={18} className="mr-2" />
          Log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;