import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, Bell, User } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  
  return (
    <header className="py-3 px-4 sm:px-6 bg-white/70 backdrop-blur-sm shadow-sm z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-1.5 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition-all relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white"></span>
          </button>
          
          <div className="flex items-center">
            <div className="relative">
              <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-800 focus:outline-none">
                <div className="h-8 w-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-500">
                  <User size={16} />
                </div>
                <span className="hidden md:inline-block">{user?.email}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;