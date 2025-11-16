import React from 'react';
import { motion } from 'framer-motion';

const ContactPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">Contact Us</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Get in touch
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
            We're here to help and answer any question you might have.
          </p>
        </div>

        <motion.div 
          className="mt-20 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
            <div className="p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email Us</h3>
                    <p className="mt-1 text-base text-gray-500 dark:text-gray-400">
                      For support, questions, or credit purchases.
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <motion.a 
                    href="mailto:askservicesbyme@gmail.com" 
                    className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
                    whileHover={{ letterSpacing: "0.5px" }}
                  >
                    askservicesbyme@gmail.com
                  </motion.a>
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;