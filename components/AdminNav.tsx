import React from 'react';
import { Page } from '../types';

interface AdminNavProps {
    active: 'users' | 'payments' | 'settings';
    navigate: (page: Page) => void;
}

const AdminNav: React.FC<AdminNavProps> = ({ active, navigate }) => {
    
    const navItems: { key: AdminNavProps['active']; label: string; page: Page }[] = [
        { key: 'users', label: 'User Management', page: 'admin-users' },
        { key: 'payments', label: 'Payment Requests', page: 'admin-payments' },
        { key: 'settings', label: 'Settings', page: 'admin-settings' },
    ];

    return (
        <div className="mb-8 border-b border-gray-200/50 dark:border-gray-700/50">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {navItems.map(item => (
                     <button 
                        key={item.key}
                        onClick={() => navigate(item.page)} 
                        className={`${
                            active === item.key 
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default AdminNav;
