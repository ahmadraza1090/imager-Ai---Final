import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Page } from '../types';
import { motion } from 'framer-motion';

const creditPlans = [
  { label: '60 Credits - 0.99 USDT', value: '60 Credits', amount: 0.99 },
  { label: '120 Credits - 1.99 USDT', value: '120 Credits', amount: 1.99 },
  { label: '280 Credits - 3.99 USDT', value: '280 Credits', amount: 3.99 },
];

const PurchasePage: React.FC<{ navigate: (page: Page) => void }> = ({ navigate }) => {
  const { submitPaymentRequest } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(creditPlans[0].value);
  const [amount, setAmount] = useState(creditPlans[0].amount);
  const [transactionId, setTransactionId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const plan = creditPlans.find(p => p.value === e.target.value);
    if (plan) {
      setSelectedPlan(plan.value);
      setAmount(plan.amount);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      setError('Transaction ID is required.');
      return;
    }
    setError('');
    submitPaymentRequest({
      plan: selectedPlan,
      amount,
      transactionId,
      date,
      note,
    });
    setSuccess(true);
    setTimeout(() => navigate('history'), 3000);
  };

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">Purchase Credits</h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Follow the steps below to add credits to your account.
          </p>
        </div>

        {success ? (
          <motion.div 
            className="mt-12 text-center p-8 bg-green-100 dark:bg-green-900/50 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-2xl font-semibold text-green-800 dark:text-green-300">Request Submitted!</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Your payment request has been submitted successfully. An admin will review it shortly. Redirecting you to your payment history...
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
          >
            <motion.div 
                className="space-y-6 p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50"
                variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. Make Payment</h2>
              <p className="text-gray-600 dark:text-gray-400">Scan the QR code with your Crypto wallet or use the ID below.</p>
              <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                 <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 mx-auto flex items-center justify-center font-mono text-gray-500 rounded-lg">
                    QR Code
                 </div>
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">or send to Binance ID:</p>
                <p className="font-mono text-lg font-semibold text-gray-800 dark:text-gray-200">123456789</p>
              </div>
            </motion.div>

            <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-6 p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50"
                variants={{ hidden: { x: 20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. Submit Details</h2>
              
              <div>
                <label htmlFor="plan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Credit Plan</label>
                <select id="plan" value={selectedPlan} onChange={handlePlanChange} className="w-full p-3 bg-gray-100 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-lg focus:ring-blue-500 transition">
                  {creditPlans.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              
              <div>
                <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transaction ID</label>
                <input type="text" id="transactionId" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} required className="w-full p-3 bg-gray-100 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-lg focus:ring-blue-500 transition" />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Payment</label>
                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full p-3 bg-gray-100 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-lg focus:ring-blue-500 transition" />
              </div>
              
              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Note (Optional)</label>
                <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="w-full p-3 bg-gray-100 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-lg focus:ring-blue-500 transition" />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              
              <motion.button 
                type="submit" 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Submit for Approval
              </motion.button>
            </motion.form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasePage;