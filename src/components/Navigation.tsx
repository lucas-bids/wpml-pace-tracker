import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, SettingsIcon, LogOutIcon, LayoutDashboardIcon, UserIcon } from 'lucide-react';

interface NavigationProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function Navigation({
  currentMonth,
  onPrevMonth,
  onNextMonth
}: NavigationProps) {
  const location = useLocation();
  
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/75 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 px-6 py-3">
        <div className="flex items-center space-x-6 flex-nowrap">
          {/* Logo */}
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-lime-400 flex items-center justify-center">
              <span className="font-bold text-gray-900 text-sm">TP</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1">
            <Link 
              to="/" 
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboardIcon size={16} className="mr-2" />
              Dashboard
            </Link>
            <Link 
              to="/settings" 
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/settings' 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <SettingsIcon size={16} className="mr-2" />
              Settings
            </Link>
          </nav>

          {/* Month Selector */}
          <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
            <button 
              onClick={onPrevMonth} 
              className="p-1 rounded-md hover:bg-gray-200 transition" 
              aria-label="Previous month"
            >
              <ChevronLeftIcon size={16} className="text-gray-500" />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
              {formatMonth(currentMonth)}
            </span>
            <button 
              onClick={onNextMonth} 
              className="p-1 rounded-md hover:bg-gray-200 transition" 
              aria-label="Next month"
            >
              <ChevronRightIcon size={16} className="text-gray-500" />
            </button>
          </div>

          {/* Profile & Sign Out */}
<button 
  className="flex items-center px-3 py-2 rounded-lg bg-gray-900 hover:bg-black text-white transition 
             text-sm font-medium whitespace-nowrap shrink-0 leading-none"
>
  <LogOutIcon size={14} className="mr-2 shrink-0" />
  <span>Sign out</span>
</button>
        </div>
      </div>
    </header>
  );
}