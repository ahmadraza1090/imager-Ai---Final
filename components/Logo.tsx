
import React from 'react';

interface LogoProps {
  textSize?: string;
}

const Logo: React.FC<LogoProps> = ({ textSize = 'text-xl' }) => {
  return (
    <div className="flex items-center space-x-2">
      <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="imager Ai logo">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="stop-primary-600" />
            <stop offset="100%" className="stop-secondary-500" />
          </linearGradient>
          <style>
            {`
              .stop-primary-600 { stop-color: #4f46e5; }
              .stop-secondary-500 { stop-color: #14b8a6; }
            `}
          </style>
          <clipPath id="logoClipPath">
             <rect width="100" height="100" rx="20" />
          </clipPath>
        </defs>
        
        <g clipPath="url(#logoClipPath)">
            <rect x="0" y="0" width="100" height="100" fill="url(#logoGradient)" />
            {/* Subtle geometric pattern for depth and tech feel */}
            <g opacity="0.15" fill="white">
                <rect x="10" y="-20" width="20" height="150" transform="rotate(30 50 50)" />
                <rect x="70" y="-20" width="20" height="150" transform="rotate(30 50 50)" />
                 <rect x="-20" y="70" width="150" height="20" transform="rotate(-30 50 50)" />
            </g>
        </g>

        <text 
            x="50" 
            y="65" 
            fontSize="50" 
            fontFamily="Inter, sans-serif" 
            fontWeight="800" 
            fill="white" 
            textAnchor="middle" 
            style={{ textShadow: '0 2px 5px rgba(0,0,0,0.25)' }}
        >
            Ai
        </text>
      </svg>
      <span className={`${textSize} font-bold text-gray-800 dark:text-white`}>imager Ai</span>
    </div>
  );
};

export default Logo;
