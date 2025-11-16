import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Page } from '../types';
import { motion } from 'framer-motion';

interface CreditPlan {
  credits: number;
  price: string;
  popular?: boolean;
}

const creditPlans: CreditPlan[] = [
  { credits: 60, price: '0.99 USDT' },
  { credits: 120, price: '1.99 USDT', popular: true },
  { credits: 280, price: '3.99 USDT' },
];

const PricingCard: React.FC<{ plan: CreditPlan, navigate: (page: Page) => void }> = ({ plan, navigate }) => {
  
  const handlePurchase = () => {
    navigate('purchase');
  }

  return (
    <motion.div 
        className={`relative p-8 rounded-2xl border ${plan.popular ? 'border-blue-500/50 shadow-blue-500/20' : 'border-gray-200 dark:border-gray-700/50'} bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg shadow-xl flex flex-col`}
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
    >
      {plan.popular && (
        <>
            <div className="absolute top-0 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-md">
            Most Popular
            </div>
            <motion.div 
              className="absolute -inset-0.5 rounded-2xl bg-blue-500 opacity-0"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
        </>
      )}
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{plan.credits} Credits</h3>
      <p className="mt-4 text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</p>
      <p className="mt-2 text-gray-500 dark:text-gray-400">One-time purchase</p>
      <motion.button
        onClick={handlePurchase}
        className={`mt-8 w-full py-3 px-6 border border-transparent rounded-lg text-center font-medium shadow-md ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Buy Credits
      </motion.button>
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
        1 Image = 4 Credits
      </div>
    </motion.div>
  );
};

const CreditsPage: React.FC<{ navigate: (page: Page) => void }> = ({ navigate }) => {
    const { user } = useAuth();
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">Buy Credits</h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Choose a plan that fits your creative needs.
          </p>
          {user && (
            <p className="mt-6 text-lg font-medium">
                Your current balance: <span className="text-blue-600 dark:text-blue-400 font-bold">{user.credits}</span> credits
            </p>
          )}
        </div>

        <motion.div 
          className="mt-16 max-w-lg mx-auto grid gap-8 lg:max-w-none lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {creditPlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} navigate={navigate}/>
          ))}
        </motion.div>
        
        <div className="mt-16 text-center p-8 bg-gray-100/50 dark:bg-gray-800/20 rounded-2xl border border-gray-200 dark:border-gray-700/50">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">How to Purchase</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
                Purchases are currently handled manually via Crypto to ensure security.
            </p>
            <ol className="mt-4 text-left inline-block mx-auto space-y-2 text-gray-600 dark:text-gray-400">
                <li>1. Click "Buy Credits" on your desired plan.</li>
                <li>2. You will be taken to the payment page with a QR Code.</li>
                <li>3. After payment, submit the transaction details.</li>
                <li>4. An admin will verify your payment and add credits to your account.</li>
            </ol>
        </div>
      </div>
    </div>
  );
};

export default CreditsPage;