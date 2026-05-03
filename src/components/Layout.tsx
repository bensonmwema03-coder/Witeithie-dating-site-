/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout() {
  return (
    <div className="min-h-screen bg-brand-secondary pb-24 md:pb-0 md:pl-20">
      <Navigation />
      <main className="max-w-md mx-auto p-4 pt-8 h-full">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
