import React from 'react';
import { Page } from '../types';

interface FooterProps {
  navigate: (page: Page) => void;
}

const FooterLink: React.FC<{
  page?: Page;
  href?: string;
  navigate?: (page: Page) => void;
  children: React.ReactNode;
}> = ({ page, href, navigate, children }) => {
  const isExternal = !!href;
  const commonClasses = "text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200";

  if (isExternal) {
    return <a href={href} className={commonClasses}>{children}</a>;
  }

  return (
    <button onClick={() => navigate && page && navigate(page)} className={commonClasses}>
      {children}
    </button>
  );
};

const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-white/50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">imager Ai</span>
            <p className="text-gray-500 dark:text-gray-400 text-base max-w-sm">
              Generate stunning AI visuals in seconds — a fast, secure, and professional platform powered by Google AI.
            </p>
             <p className="text-sm text-gray-400 dark:text-gray-500">Secure by Ahmad Raza</p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wider uppercase">Navigation</h3>
            <ul className="mt-4 space-y-3">
              <li><FooterLink navigate={navigate} page="generator">Generator</FooterLink></li>
              <li><FooterLink navigate={navigate} page="credits">Credits</FooterLink></li>
              <li><FooterLink navigate={navigate} page="contact">Contact</FooterLink></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wider uppercase">Legal & Contact</h3>
            <ul className="mt-4 space-y-3">
              <li><FooterLink href="#">Privacy Policy</FooterLink></li>
              <li><FooterLink href="#">Terms & Conditions</FooterLink></li>
              <li><FooterLink href="mailto:askservicesbyme@gmail.com">askservicesbyme@gmail.com</FooterLink></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <p className="text-base text-gray-500 dark:text-gray-400 text-center">&copy; {new Date().getFullYear()} imager Ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;