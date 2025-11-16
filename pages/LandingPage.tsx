import React from 'react';
import { Page } from '../types';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

interface LandingPageProps {
  navigate: (page: Page) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const FeatureCard: React.FC<{ icon: React.ReactElement; title: string; description: string }> = ({ icon, title, description }) => (
    <motion.div 
        className="p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50"
        variants={itemVariants}
        whileHover={{ y: -5, scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        transition={{ type: 'spring', stiffness: 300 }}
    >
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
            {icon}
        </div>
        <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{description}</p>
    </motion.div>
);

const HowItWorksStep: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
  <motion.div className="flex" variants={itemVariants}>
    <div className="flex-shrink-0">
      <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 text-white shadow-lg">
        <span className="text-xl font-bold">{number}</span>
      </div>
    </div>
    <div className="ml-4">
      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  </motion.div>
);

const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
    const { isAuthenticated } = useAuth();
    const ctaAction = () => {
        navigate(isAuthenticated ? 'generator' : 'signup');
    };
    
  return (
    <div className="space-y-20 sm:space-y-32 md:space-y-40 lg:space-y-44">
      {/* Hero Section */}
      <div className="relative pt-20 pb-20 sm:pt-24 sm:pb-24 lg:pt-32 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-100/50 dark:from-gray-900 to-transparent"></div>
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/50 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-50"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              x: [-20, 20, -20],
            }}
            transition={{
              duration: 20,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror"
            }}
          />
        </div>
        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 variants={itemVariants} className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">Create AI Images</span>
            <span className="block text-blue-600 dark:text-blue-400">in Seconds</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 max-w-md mx-auto text-lg text-gray-500 dark:text-gray-400 sm:text-xl md:mt-8 md:max-w-3xl">
            Generate stunning AI visuals from text, download them instantly, and manage everything through a credit-based system.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">
            <div className="rounded-lg shadow">
              <motion.button
                onClick={ctaAction}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Start Generating
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">Why imager Ai?</h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Everything you need in an AI image generator.</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard title="Fast Generation" description="Get high-quality images in seconds, not minutes. Our powerful AI is optimized for speed." icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
            <FeatureCard title="Secure & Private" description="We don't store your prompts or images. Your creations are yours alone." icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} />
            <FeatureCard title="Free Credits" description="Sign up and get 40 free credits to start generating images right away." icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} />
            <FeatureCard title="Privacy-First" description="No third-party analytics. Your data is never shared. Your privacy is our priority." icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} />
        </div>
      </motion.div>
      
       {/* How It Works Section */}
      <div className="py-20 bg-gray-100/50 dark:bg-gray-800/20">
        <motion.div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
        >
            <div className="lg:text-center">
                <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">How It Works</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    Generate images in 3 simple steps
                </p>
            </div>

            <div className="mt-10">
                <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                    <HowItWorksStep number="1" title="Sign Up" description="Create an account to get your 40 free credits. It's quick, easy, and secure." />
                    <HowItWorksStep number="2" title="Enter Prompt" description="Describe the image you want to create. Be as specific or as creative as you like." />
                    <HowItWorksStep number="3" title="Download Image" description="Generate your image and download it instantly. No waiting, no watermarks." />
                </dl>
            </div>
        </motion.div>
      </div>

       {/* Demo Gallery Section */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">Demo Gallery</h2>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">See what's possible with imager Ai.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {[...Array(6)].map((_, i) => (
                    <motion.div 
                        key={i} 
                        className="aspect-w-1 aspect-h-1 rounded-2xl overflow-hidden shadow-lg"
                        whileHover={{ scale: 1.03 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <img src={`https://picsum.photos/seed/${i+10}/500/500`} alt={`Generated image ${i+1}`} className="w-full h-full object-cover transition-transform duration-300" />
                    </motion.div>
                ))}
            </div>
       </div>

    </div>
  );
};

export default LandingPage;