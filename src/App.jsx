import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RouteProvider, useRoute } from './context/RouteContext';
import { NoiseOverlay } from './components/NoiseOverlay';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { DashboardView } from './views/DashboardView';
import { CheckoutView } from './views/CheckoutView';
import { DetailModal } from './views/DetailModal';

const AppContent = () => {
  const { currentView } = useRoute();

  return (
    <div className="app-wrapper">
      <NoiseOverlay />
      <Toast />
      <Header />

      <main className="main-view-container">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <HomeView />
            </motion.div>
          )}

          {currentView === 'catalog' && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <CatalogView />
            </motion.div>
          )}

          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <DashboardView />
            </motion.div>
          )}

          {currentView === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <CheckoutView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <DetailModal />
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <RouteProvider>
      <AppContent />
    </RouteProvider>
  );
}
