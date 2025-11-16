import React, { useState, useMemo } from 'react';
import { Page, PaymentRequest } from '../types';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import AdminNav from '../components/AdminNav';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

const StatusBadge: React.FC<{ status: PaymentRequest['status'] }> = ({ status }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

const AdminPaymentsPage: React.FC<{ navigate: (page: Page) => void }> = ({ navigate }) => {
    const { getAllPaymentRequests, approvePaymentRequest, rejectPaymentRequest } = useAuth();
    const [payments, setPayments] = useState(getAllPaymentRequests());
    const [filter, setFilter] = useState<StatusFilter>('pending');

    const refreshPayments = () => setPayments(getAllPaymentRequests());

    const filteredPayments = useMemo(() => {
        if (filter === 'all') return payments;
        return payments.filter(p => p.status === filter);
    }, [payments, filter]);

    const handleApprove = (id: string) => {
        approvePaymentRequest(id);
        refreshPayments();
    };

    const handleReject = (id: string) => {
        rejectPaymentRequest(id);
        refreshPayments();
    };

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <AdminNav active="payments" navigate={navigate} />

                <div className="flex space-x-2 mb-6">
                    {(['pending', 'approved', 'rejected', 'all'] as StatusFilter[]).map(f => (
                        <motion.button 
                            key={f} 
                            onClick={() => setFilter(f)} 
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === f ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </motion.button>
                    ))}
                </div>

                <motion.div 
                    className="shadow-xl border-b border-gray-200/50 dark:border-gray-700/50 sm:rounded-2xl overflow-hidden bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Plan</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transaction ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredPayments.map(p => (
                                    <motion.tr 
                                        key={p.id}
                                        className="hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{p.userName} <span className="text-gray-500 dark:text-gray-400">({p.userEmail})</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{p.plan}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">{p.transactionId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(p.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={p.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                            {p.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleApprove(p.id)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors">Approve</button>
                                                    <button onClick={() => handleReject(p.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors">Reject</button>
                                                </>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminPaymentsPage;