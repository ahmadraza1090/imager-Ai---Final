
import React from 'react';
import { Page } from '../types';
import Logo from './Logo';

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
  const commonClasses = "text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200";

  if (isExternal) {
    return <a href={href} className={commonClasses} target="_blank" rel="noopener noreferrer">{children}</a>;
  }

  return (
    <button onClick={() => navigate && page && navigate(page)} className={commonClasses}>
      {children}
    </button>
  );
};

const SocialIconLink: React.FC<{ href: string; children: React.ReactNode; label: string }> = ({ href, children, label }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label={label}
        className="text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 transition-colors duration-300"
    >
        {children}
    </a>
);

const TwitterIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>;
const GithubIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.577.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd"></path></svg>;
const InstagramIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.316 1.363.366 2.427.048 1.067.06 1.407.06 4.156 0 2.75-.012 3.089-.06 4.156-.05 1.064-.219 1.791-.466 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.316-2.427.366-1.067.048-1.407.06-4.156.06-2.75 0-3.089-.012-4.156-.06-1.064-.05-1.791-.219-2.427-.466a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.316-1.363-.366-2.427-.048-1.067-.06-1.407-.06-4.156 0-2.75.012-3.089.06-4.156.05-1.064.219-1.791.466-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 013.45 2.525c.636-.247 1.363-.316 2.427-.366C6.94 2.013 7.289 2 9.72 2h2.595zM12 4.869c-2.43 0-2.784.01-3.808.06-1.034.048-1.597.2-1.953.344a2.89 2.89 0 00-1.068.74 2.89 2.89 0 00-.74 1.068c-.145.356-.297.92-.344 1.953-.05 1.024-.06 1.379-.06 3.808s.01 2.784.06 3.808c.048 1.034.2 1.597.344 1.953a2.89 2.89 0 00.74 1.068 2.89 2.89 0 001.068.74c.356.145.92.297 1.953.344 1.024.05 1.379.06 3.808.06s2.784-.01 3.808-.06c1.034-.048 1.597-.2 1.953-.344a2.89 2.89 0 001.068-.74 2.89 2.89 0 00.74-1.068c.145-.356.297-.92.344-1.953.05-1.024.06-1.379.06-3.808s-.01-2.784-.06-3.808c-.048-1.034-.2-1.597-.344-1.953a2.89 2.89 0 00-.74-1.068 2.89 2.89 0 00-1.068-.74c-.356-.145-.92-.297-1.953-.344-1.024-.05-1.379-.06-3.808-.06zM12 9.127a5.126 5.126 0 100 10.252 5.126 5.126 0 000-10.252zm0 8.441a3.315 3.315 0 110-6.63 3.315 3.315 0 010 6.63zM16.965 6.575a1.232 1.232 0 100 2.464 1.232 1.232 0 000-2.464z" clipRule="evenodd"></path></svg>;

const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailInput = e.currentTarget.elements.namedItem('email') as HTMLInputElement;
    if (emailInput.value) {
        alert(`Thank you for subscribing, ${emailInput.value}!`);
        emailInput.value = '';
    }
  };

  return (
    <footer className="bg-white/50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Logo textSize="text-2xl" />
            <p className="text-gray-500 dark:text-gray-400 text-base max-w-sm">
              Generate stunning AI visuals in seconds — a fast, secure, and professional platform powered by Google AI.
            </p>
            <div className="flex space-x-6">
                <SocialIconLink href="#" label="Twitter"><TwitterIcon /></SocialIconLink>
                <SocialIconLink href="#" label="GitHub"><GithubIcon /></SocialIconLink>
                <SocialIconLink href="#" label="Instagram"><InstagramIcon /></SocialIconLink>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">Secure by Ahmad Raza</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wider uppercase">Navigation</h3>
                <ul className="mt-4 space-y-4">
                  <li><FooterLink navigate={navigate} page="generator">Generator</FooterLink></li>
                  <li><FooterLink navigate={navigate} page="credits">Credits</FooterLink></li>
                  <li><FooterLink navigate={navigate} page="contact">Contact</FooterLink></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wider uppercase">Legal & Contact</h3>
                <ul className="mt-4 space-y-4">
                  <li><FooterLink href="#">Privacy Policy</FooterLink></li>
                  <li><FooterLink href="#">Terms & Conditions</FooterLink></li>
                  <li><FooterLink href="mailto:askservicesbyme@gmail.com">askservicesbyme@gmail.com</FooterLink></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
               <div>
                 <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wider uppercase">Stay Updated</h3>
                 <p className="mt-4 text-base text-gray-500 dark:text-gray-400">Subscribe to our newsletter to get the latest news and updates.</p>
                 <form className="mt-4 sm:flex sm:max-w-md" onSubmit={handleNewsletterSubmit}>
                   <label htmlFor="email-address" className="sr-only">Email address</label>
                   <input type="email" name="email" id="email-address" autoComplete="email" required className="appearance-none min-w-0 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-4 text-base text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500" placeholder="Enter your email" />
                   <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                     <button type="submit" className="w-full bg-gradient-to-r from-primary-600 to-secondary-500 flex items-center justify-center border border-transparent rounded-md shadow-sm py-2 px-4 text-base font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                       Subscribe
                     </button>
                   </div>
                 </form>
               </div>
            </div>
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
