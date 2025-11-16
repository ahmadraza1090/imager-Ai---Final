import React from 'react';
import { Page } from '../types';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
// Fix: Import AnimatePresence from framer-motion.
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  navigate: (page: Page) => void;
  currentPage: Page;
}

const NavLink: React.FC<{
  page: Page;
  navigate: (page: Page) => void;
  currentPage: Page;
  children: React.ReactNode;
}> = ({ page, navigate, currentPage, children }) => (
    <motion.button
        onClick={() => navigate(page)}
        className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative"
        whileHover={{ color: 'rgb(37 99 235)' }}
    >
        {children}
        {currentPage === page && (
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                layoutId="underline"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
        )}
    </motion.button>
);

const Navbar: React.FC<NavbarProps> = ({ navigate, currentPage }) => {
  const { isAuthenticated, user, logout } = useAuth();
  
  const [isOpen, setIsOpen] = React.useState(false);
  const [isProfileOpen, setProfileOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.button 
                onClick={() => navigate('landing')} 
                className="flex-shrink-0 text-xl font-bold text-blue-600 dark:text-blue-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
              imager Ai
            </motion.button>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4 text-gray-600 dark:text-gray-300">
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
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.credits}</span> Credits
                </div>
                 <motion.div className="relative" onHoverStart={() => setProfileOpen(true)} onHoverEnd={() => setProfileOpen(false)}>
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800">
                    <span>{user?.name}</span>
                    <motion.svg animate={{ rotate: isProfileOpen ? 180 : 0 }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></motion.svg>
                  </button>
                  <AnimatePresence>
                  {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 overflow-hidden border border-gray-200 dark:border-gray-700">
                    <motion.button 
                        onClick={logout} 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        whileHover={{ x: 2 }}
                    >
                      Logout
                    </motion.button>
                  </motion.div>
                  )}
                  </AnimatePresence>
                </motion.div>
              </>
            ) : (
              <motion.button 
                onClick={() => navigate('login')} 
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Login
              </motion.button>
            )}
            <ThemeToggle />
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} type="button" className="bg-gray-200 dark:bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400">
              <span className="sr-only">Open main menu</span>
              <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
      {isOpen && (
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-gray-600 dark:text-gray-300">
            <NavLink page="generator" navigate={navigate} currentPage={currentPage}>Generator</NavLink>
            <NavLink page="credits" navigate={navigate} currentPage={currentPage}>Credits</NavLink>
            {isAuthenticated && <NavLink page="history" navigate={navigate} currentPage={currentPage}>History</NavLink>}
            {user?.role === 'admin' && <NavLink page="admin-users" navigate={navigate} currentPage={currentPage}>Admin</NavLink>}
            <NavLink page="contact" navigate={navigate} currentPage={currentPage}>Contact</NavLink>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            {isAuthenticated ? (
                <div className="px-5 flex items-center justify-between">
                    <div>
                        <div className="text-base font-medium leading-none text-gray-800 dark:text-white">{user?.name}</div>
                        <div className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">{user?.email}</div>
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.credits}</span> Credits
                    </div>
                </div>
            ) : null }
             <div className="mt-3 px-2 space-y-1">
                {isAuthenticated ? (
                    <button onClick={logout} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Logout</button>
                ) : (
                    <button onClick={() => navigate('login')} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Login</button>
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