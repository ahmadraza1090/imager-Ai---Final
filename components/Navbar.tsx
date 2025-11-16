
import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../types';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

interface NavbarProps {
  navigate: (page: Page) => void;
  currentPage: Page;
}

const NavLink: React.FC<{
  page: Page;
  navigate: (page: Page) => void;
  currentPage: Page;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ page, navigate, currentPage, children, onClick }) => (
    <motion.button
        onClick={() => {
            navigate(page);
            if (onClick) onClick();
        }}
        className="px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 relative"
    >
        <span className="relative z-10">{children}</span>
        {currentPage === page && (
            <motion.div
                className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg"
                layoutId="active-nav-link"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
        )}
    </motion.button>
);

const Navbar: React.FC<NavbarProps> = ({ navigate, currentPage }) => {
  const { isAuthenticated, user, logout } = useAuth();
  
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.button 
                onClick={() => navigate('landing')} 
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
              <Logo textSize="text-xl" />
            </motion.button>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2 text-gray-600 dark:text-gray-300">
                <NavLink page="generator" navigate={navigate} currentPage={currentPage}>Generator</NavLink>
                <NavLink page="credits" navigate={navigate} currentPage={currentPage}>Credits</NavLink>
                {isAuthenticated && <NavLink page="history" navigate={navigate} currentPage={currentPage}>History</NavLink>}
                {user?.role === 'admin' && <NavLink page="admin-users" navigate={navigate} currentPage={currentPage}>Admin</NavLink>}
                <NavLink page="contact" navigate={navigate} currentPage={currentPage}>Contact</NavLink>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-primary-600 dark:text-primary-400">{user?.credits}</span> Credits
                </div>
                 <motion.div className="relative" ref={profileRef}>
                  <button onClick={() => setProfileOpen(p => !p)} className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <span>{user?.name}</span>
                    <motion.svg animate={{ rotate: isProfileOpen ? 180 : 0 }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></motion.svg>
                  </button>
                  <AnimatePresence>
                  {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <div className="p-1">
                        <motion.button 
                            onClick={() => { logout(); setProfileOpen(false); }}
                            className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                        >
                          <span>Logout</span>
                        </motion.button>
                    </div>
                  </motion.div>
                  )}
                  </AnimatePresence>
                </motion.div>
              </>
            ) : (
              <motion.button 
                onClick={() => navigate('login')} 
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-500 rounded-lg hover:opacity-90 shadow"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Login / Sign Up
              </motion.button>
            )}
            <ThemeToggle />
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} type="button" className="bg-gray-200 dark:bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400">
              <span className="sr-only">Open main menu</span>
              <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
      {isMobileMenuOpen && (
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-gray-600 dark:text-gray-300 flex flex-col items-start">
            <NavLink page="generator" navigate={navigate} currentPage={currentPage} onClick={() => setMobileMenuOpen(false)}>Generator</NavLink>
            <NavLink page="credits" navigate={navigate} currentPage={currentPage} onClick={() => setMobileMenuOpen(false)}>Credits</NavLink>
            {isAuthenticated && <NavLink page="history" navigate={navigate} currentPage={currentPage} onClick={() => setMobileMenuOpen(false)}>History</NavLink>}
            {user?.role === 'admin' && <NavLink page="admin-users" navigate={navigate} currentPage={currentPage} onClick={() => setMobileMenuOpen(false)}>Admin</NavLink>}
            <NavLink page="contact" navigate={navigate} currentPage={currentPage} onClick={() => setMobileMenuOpen(false)}>Contact</NavLink>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            {isAuthenticated ? (
                <div className="px-5 flex items-center justify-between">
                    <div>
                        <div className="text-base font-medium leading-none text-gray-800 dark:text-white">{user?.name}</div>
                        <div className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">{user?.email}</div>
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      <span className="font-semibold text-primary-600 dark:text-primary-400">{user?.credits}</span> Credits
                    </div>
                </div>
            ) : null }
             <div className="mt-3 px-2 space-y-1">
                {isAuthenticated ? (
                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Logout</button>
                ) : (
                    <button onClick={() => { navigate('login'); setMobileMenuOpen(false); }} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Login / Sign Up</button>
                )}
                 <div className="flex justify-between items-center px-3 py-2">
                    <span className="text-gray-600 dark:text-gray-300">Theme</span>
                    <ThemeToggle />
                </div>
            </div>
        </div>
      </motion.div>
      )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
