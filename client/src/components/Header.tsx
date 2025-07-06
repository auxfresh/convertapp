import React, { useState } from 'react';
import { Calculator, Sun, Moon, History, LogIn, ChevronDown, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useFirebaseConversions } from '@/hooks/useFirebaseConversions';
import { AuthModal } from '@/components/AuthModal';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { count: historyCount } = useFirebaseConversions();

  const tabs = [
    { id: 'currency', label: 'Currency', href: '#currency' },
    { id: 'length', label: 'Length', href: '#length' },
    { id: 'weight', label: 'Weight', href: '#weight' },
    { id: 'clothing', label: 'Clothing', href: '#clothing' },
    { id: 'calculator', label: 'Calculator', href: '#calculator' },
  ];

  const handleSignIn = () => {
    setShowAuthModal(true);
  };

  const handleSignOut = () => {
    signOut().catch(console.error);
    setShowUserMenu(false);
  };

  const getUserInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Calculator className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-white">All-in-One Converter</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">Currency, Length, Weight & Size</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'text-primary font-medium border-b-2 border-primary pb-1'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                } transition-colors`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* User Controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              ) : (
                <Moon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              )}
            </Button>

            {/* History Button */}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 relative"
              >
                <History className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                {historyCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                    {historyCount > 99 ? '99+' : historyCount}
                  </span>
                )}
              </Button>
            )}

            {/* User Account or Sign In */}
            {user ? (
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getUserInitials(user.displayName)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-50 border border-slate-200 dark:border-slate-700">
                    <div className="px-4 py-2 text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">
                      {user.email}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button onClick={handleSignIn} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 font-medium">
                <LogIn className="h-4 w-4 inline mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-slate-200 dark:border-slate-700">
        <div className="px-4 py-3">
          <div className="flex space-x-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-shrink-0 px-3 py-2 text-sm rounded-lg ${
                  activeTab === tab.id
                    ? 'bg-primary text-white font-medium'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
