import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useIoT } from '../context/IoTContext';
import { ShieldAlert, X, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toastMessage, clearToast } = useIoT();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B1118] text-slate-900 dark:text-[#F8FAFC] flex font-sans tech-grid">
      
      {/* Persistent Left Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Fixed Top Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Scrollable Content Area */}
        <main className="flex-grow mt-20 md:ml-72 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>

        {/* Modern Footer */}
        <footer className="py-4 md:ml-72 border-t border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#0F172A]/40 backdrop-blur-md px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            <span>© {new Date().getFullYear()} CHITTI 4.0 Ecosystem. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Production Node v4.0.12
            </span>
            <span>Solar Protected Crop System</span>
          </div>
        </footer>
      </div>

      {/* Sticky Real-time Threat Intrusion Toast Notification */}
      <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="p-4 rounded-2xl bg-red-950/80 border border-red-500/30 backdrop-blur-xl shadow-[0_10px_30px_rgba(239,68,68,0.25)] flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                <ShieldAlert className="w-6 h-6 animate-bounce" />
              </div>
              <div className="flex-grow space-y-1">
                <h4 className="font-extrabold text-white text-sm tracking-wide">{toastMessage.title}</h4>
                <p className="text-xs text-red-200 leading-relaxed font-medium">{toastMessage.message}</p>
                <div className="pt-2 flex gap-3">
                  <button 
                    onClick={() => {
                      clearToast();
                      window.location.href = '/alerts';
                    }} 
                    className="text-[10px] bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-white font-bold px-2.5 py-1 rounded-lg transition-all"
                  >
                    Investigate Snapshot
                  </button>
                  <button 
                    onClick={clearToast}
                    className="text-[10px] text-slate-400 hover:text-slate-200 font-bold px-1"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <button 
                onClick={clearToast}
                className="text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default DashboardLayout;
