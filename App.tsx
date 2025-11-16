import React, { useState, useCallback } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import GeneratorPage from './pages/GeneratorPage';
import CreditsPage from './pages/CreditsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PurchasePage from './pages/PurchasePage';
import PaymentHistoryPage from './pages/PaymentHistoryPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminPaymentsPage from './pages/AdminPaymentsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import { Page } from './types';
import { useAuth } from './hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};


const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const { user } = useAuth();

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const renderPage = () => {
    const adminPages: Page[] = ['admin-users', 'admin-payments', 'admin-settings'];
    if (adminPages.includes(currentPage) && user?.role !== 'admin') {
      return <LandingPage navigate={navigate} />;
    }

    switch (currentPage) {
      case 'landing': return <LandingPage navigate={navigate} />;
      case 'generator': return <GeneratorPage />;
      case 'credits': return <CreditsPage navigate={navigate} />;
      case 'contact': return <ContactPage />;
      case 'login': return <LoginPage navigate={navigate} />;
      case 'signup': return <SignupPage navigate={navigate} />;
      case 'purchase': return <PurchasePage navigate={navigate} />;
      case 'history': return <PaymentHistoryPage />;
      case 'admin-users': return <AdminUsersPage navigate={navigate} />;
      case 'admin-payments': return <AdminPaymentsPage navigate={navigate} />;
      case 'admin-settings': return <AdminSettingsPage navigate={navigate} />;
      default: return <LandingPage navigate={navigate} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-500 overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-black -z-10"></div>
      <Navbar navigate={navigate} currentPage={currentPage} />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
            <motion.div
                key={currentPage}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
            >
                {renderPage()}
            </motion.div>
        </AnimatePresence>
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;