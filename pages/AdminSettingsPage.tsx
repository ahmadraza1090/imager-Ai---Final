import React, { useState } from 'react';
import { Page } from '../types';
import AdminNav from '../components/AdminNav';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/Modal';

const AdminSettingsPage: React.FC<{ navigate: (page: Page) => void }> = ({ navigate }) => {
    const { getDisplayApiKey, updateApiKey, removeApiKey } = useAuth();
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isRemoveModalOpen, setRemoveModalOpen] = useState(false);
    const [newApiKey, setNewApiKey] = useState('');

    const { key: displayKey, isSet } = getDisplayApiKey();

    const handleOpenEdit = () => {
        setNewApiKey(''); // Don't pre-fill for security
        setEditModalOpen(true);
    };

    const handleSaveKey = () => {
        if (newApiKey.trim()) {
            updateApiKey(newApiKey.trim());
            setEditModalOpen(false);
        }
    };

    const handleRemoveKey = () => {
        removeApiKey();
        setRemoveModalOpen(false);
    };

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <AdminNav active="settings" navigate={navigate} />

                <motion.div
                    className="p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 space-y-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Key Management</h2>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Google API Key</label>
                        <div className="flex items-center space-x-4">
                            <div className="flex-grow p-3 bg-gray-100 dark:bg-gray-900 rounded-lg font-mono text-gray-700 dark:text-gray-300">
                                {displayKey}
                            </div>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${isSet ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                {isSet ? 'Configured' : 'Not Configured'}
                            </span>
                        </div>
                         <div className="flex justify-end space-x-2 pt-2">
                            <motion.button 
                                onClick={() => setRemoveModalOpen(true)}
                                disabled={!isSet}
                                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                whileHover={{ scale: isSet ? 1.05 : 1 }} whileTap={{ scale: isSet ? 0.95 : 1 }}
                            >
                                Remove Key
                            </motion.button>
                            <motion.button 
                                onClick={handleOpenEdit}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow"
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            >
                                {isSet ? 'Edit Key' : 'Set Key'}
                            </motion.button>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-800 dark:text-blue-200 rounded-r-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="-0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium">Security Notice</h3>
                                <div className="mt-2 text-sm">
                                    <p>To generate images, a Google API key must be configured here. This key is stored securely in your browser's local storage and is never transmitted to our servers.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title={isSet ? 'Edit Google API Key' : 'Set Google API Key'}>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Enter your Google API Key. This will be stored in your browser's local storage and used for all image generation requests.</p>
                        <label htmlFor="apiKeyInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New API Key</label>
                        <input 
                            type="password" 
                            id="apiKeyInput" 
                            value={newApiKey} 
                            onChange={e => setNewApiKey(e.target.value)} 
                            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500" 
                            placeholder="Enter new API key"
                        />
                        <div className="flex justify-end space-x-2 pt-2">
                            <motion.button onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600" whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>Cancel</motion.button>
                            <motion.button onClick={handleSaveKey} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow" whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>Save Key</motion.button>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={isRemoveModalOpen} onClose={() => setRemoveModalOpen(false)} title="Remove API Key?">
                    <p className="text-gray-600 dark:text-gray-300">Are you sure? The application will not be able to generate images until a new key is set.</p>
                    <div className="flex justify-end space-x-2 mt-4 pt-2">
                        <motion.button onClick={() => setRemoveModalOpen(false)} className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600" whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>Cancel</motion.button>
                        <motion.button onClick={handleRemoveKey} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 shadow" whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>Confirm Remove</motion.button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default AdminSettingsPage;