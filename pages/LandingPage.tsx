
import React from 'react';
import { Page } from '../types';
import { useAuth } from '../hooks/useAuth';
// FIX: Import Variants type from framer-motion to fix type inference issues.
import { motion, Variants } from 'framer-motion';

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

// FIX: Add Variants type annotation to ensure correct type inference for animation properties.
const itemVariants: Variants = {
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
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400">
            {icon}
        </div>
        <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{description}</p>
    </motion.div>
);

const HowItWorksStep: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
  <motion.div 
    className="p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 text-center"
    variants={itemVariants}
    whileHover={{ y: -5, scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="flex items-center justify-center mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-primary-600 to-secondary-500 text-white shadow-lg">
      <span className="text-2xl font-bold">{number}</span>
    </div>
    <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
    <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{description}</p>
  </motion.div>
);

const TestimonialCard: React.FC<{ quote: string; name: string; title: string; avatar: string; }> = ({ quote, name, title, avatar }) => (
  <motion.figure 
    className="p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 flex flex-col"
    variants={itemVariants}
  >
    <svg className="h-8 w-8 text-primary-400" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M9.33 8.33h-4L1 18.67V28h12.33v-9.33H8.33V8.33zm16 0h-4L21.33 18.67V28H33.67v-9.33H28.33V8.33z" />
    </svg>
    <blockquote className="mt-6 flex-grow">
      <p className="text-lg text-gray-600 dark:text-gray-300">"{quote}"</p>
    </blockquote>
    <figcaption className="flex items-center mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
      <img className="h-12 w-12 rounded-full object-cover" src={avatar} alt={name} />
      <div className="ml-4">
        <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
      </div>
    </figcaption>
  </figure>
);

const testimonials = [
  {
    quote: "imager Ai has revolutionized my workflow. I can generate stunning visuals for my projects in a fraction of the time. The quality is simply outstanding!",
    name: 'Sarah L.',
    title: 'Digital Marketer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
  },
  {
    quote: "As a developer, I'm not a designer. This tool lets me create professional-grade assets for my apps without any design skills. The privacy-first approach is a huge plus.",
    name: 'Mike R.',
    title: 'Software Developer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
  },
  {
    quote: "The speed and control are unparalleled. I can quickly iterate on ideas for concept art, saving hours of work. It's an indispensable tool in my creative arsenal.",
    name: 'Jessica T.',
    title: 'Concept Artist',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
  }
];

const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
    const { isAuthenticated } = useAuth();

    const ctaAction = () => {
        navigate(isAuthenticated ? 'generator' : 'signup');
    };

  return (
    <div className="space-y-20 sm:space-y-32 md:space-y-40 lg:space-y-44 pb-20 sm:pb-32 md:pb-40 lg:pb-44">
      {/* Hero Section */}
      <div className="relative pt-20 pb-20 sm:pt-24 sm:pb-24 lg:pt-32 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-100/50 dark:from-gray-900 to-transparent"></div>
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/50 dark:bg-primary-900/30 rounded-full filter blur-3xl opacity-50"
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
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">in Seconds</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 max-w-md mx-auto text-lg text-gray-500 dark:text-gray-400 sm:text-xl md:mt-8 md:max-w-3xl">
            Generate stunning AI visuals from text, download them instantly, and manage everything through a credit-based system.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">
            <div className="rounded-lg shadow">
              <motion.button
                onClick={ctaAction}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:opacity-90 md:py-4 md:text-lg md:px-10"
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
            <FeatureCard title="Fast Generation" description="Get high-quality images in seconds, not minutes. Our powerful AI is optimized for speed." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
            <FeatureCard title="Secure & Private" description="We don't store your prompts or images. Your creations are yours alone." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} />
            <FeatureCard title="Free Credits" description="Sign up and get 40 free credits to start generating images right away." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
            <FeatureCard title="Privacy-First" description="No third-party analytics. Your data is never shared. Your privacy is our priority." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} />
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
                <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">How It Works</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    From Idea to Image in Seconds
                </p>
            </div>
            <div className="mt-16">
                <div className="grid md:grid-cols-3 gap-8">
                    <HowItWorksStep number="1" title="Describe Your Vision" description="Create a free account to get 40 credits. Then, describe any image you can imagine using text." />
                    <HowItWorksStep number="2" title="Generate & Refine" description="Our AI brings your idea to life. Choose your aspect ratio, image count, and regenerate if needed." />
                    <HowItWorksStep number="3" title="Download & Create" description="Download your high-resolution images instantly, or use our built-in editor for final adjustments." />
                </div>
            </div>
        </motion.div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-100/50 dark:bg-gray-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">Loved by Creatives Everywhere</h2>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Don't just take our word for it. Here's what our users say.</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                    <TestimonialCard key={index} {...testimonial} />
                ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Final CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-100/50 to-secondary-100/50 dark:from-primary-900/20 dark:to-secondary-900/20 transform -skew-y-3"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={containerVariants}
            >
            <motion.h2 variants={itemVariants} className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                <span className="block">Ready to bring your ideas to life?</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="mt-4 text-lg leading-6 text-gray-500 dark:text-gray-400">
            Sign up today and get 40 free credits. No credit card required.
            </motion.p>
            <motion.div variants={itemVariants} className="mt-8">
                <motion.button
                    onClick={ctaAction}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:opacity-90 md:py-4 md:text-lg md:px-10 shadow-lg"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    Start Generating for Free
                </motion.button>
            </motion.div>
            </motion.div>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;
