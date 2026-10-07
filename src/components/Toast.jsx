import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoute } from '../context/RouteContext';

export const Toast = () => {
  const { toastMessage } = useRoute();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="toast-wrap"
        >
          <div className="toast-content-box">
            <span>{toastMessage}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
