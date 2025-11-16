import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'framer-motion';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30
};

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div 
      onClick={toggleTheme}
      className={`flex items-center w-14 h-8 px-1 rounded-full cursor-pointer transition-colors ${
        theme === 'light' ? 'bg-blue-100 justify-start' : 'bg-gray-800 justify-end'
      }`}
    >
      <motion.div
        className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
        layout
        transition={spring}
      >
        {theme === 'light' ? <SunIcon /> : <MoonIcon />}
      </motion.div>
    </div>
  );
};

export default ThemeToggle;