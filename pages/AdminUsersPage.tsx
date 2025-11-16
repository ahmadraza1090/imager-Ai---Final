import React, { useState, useMemo } from 'react';
import { Page, User, UserTier } from '../types';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/Modal';
import { motion } from 'framer-motion';
import AdminNav from '../components/AdminNav';

const TierBadge: React.FC<{ tier: UserTier }> = ({ tier }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
  const tierClasses: Record<UserTier, string> = {
    Free: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    Basic: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Pro: "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300",
  };
  return <span className={`${baseClasses} ${tierClasses[tier]}`}>{tier}</span>;
};

const AdminUsersPage: React.FC<{ navigate: (page: Page) => void }> = ({ navigate }) => {
    const { getAllUsers, updateUserCredits, deleteUser } = useAuth();
    const [users, setUsers] = useState(getAllUsers());
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [credits, setCredits] = useState(0);

    const refreshUsers = () => setUsers(getAllUsers());

    const filteredUsers = useMemo(() => 
        users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        ), [users, searchTerm]);

    const handleEditCredits = () => {
        if (editingUser) {
            updateUserCredits(editingUser.id, credits);
            setEditingUser(null);
            refreshUsers();
        }
    };

    const handleDeleteUser = () => {
        if (deletingUser) {
            deleteUser(deletingUser.id);
            setDeletingUser(null);
            refreshUsers();
        }
    };

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <AdminNav active="users" navigate={navigate} />

                <input type="text" placeholder="Search users by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="mb-6 w-full md:w-1/2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />

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
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tier</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Credits</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredUsers.map(user => (
                                    <motion.tr 
                                        key={user.id}
                                        className="hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm"><TierBadge tier={user.tier} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.credits}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                            <button onClick={() => { setEditingUser(user); setCredits(user.credits); }} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">Edit Credits</button>
                                            <button onClick={() => setDeletingUser(user)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors">Delete</button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title={`Edit Credits for ${editingUser?.name}`}>
                    <div className="space-y-4">
                        <label htmlFor="credits" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Credits</label>
                        <input type="number" id="credits" value={credits} onChange={e => setCredits(parseInt(e.target.value, 10) || 0)} className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500" />
                        <div className="flex justify-end space-x-2 pt-2">
                            <motion.button onClick={() => setEditingUser(null)} className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600" whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>Cancel</motion.button>
                            <motion.button onClick={handleEditCredits} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 shadow" whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>Save</motion.button>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={!!deletingUser} onClose={() => setDeletingUser(null)} title={`Delete ${deletingUser?.name}?`}>
                    <p className="text-gray-600 dark:text-gray-300">Are you sure you want to delete this user? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-2 mt-4 pt-2">
                        <motion.button onClick={() => setDeletingUser(null)} className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600" whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>Cancel</motion.button>
                        <motion.button onClick={handleDeleteUser} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 shadow" whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>Delete</motion.button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default AdminUsersPage;