import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Bell, 
  CheckCircle,
  AlertOctagon,
  Leaf
} from 'lucide-react';
import { useIoT } from '../context/IoTContext';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ toggleSidebar }) => {
  const { alerts, markAlertRead } = useIoT();
  const navigate = useNavigate();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const notifRef = useRef(null);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    // Sync initial theme
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadAlerts = alerts.filter(a => a.status === 'UNREAD');

  return (
    <header className="fixed top-0 right-0 left-0 md:left-72 h-20 bg-transparent z-30 flex items-center justify-between px-6 pointer-events-none">
      
      {/* Left side (Mobile Toggle) */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <button 
          onClick={toggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-all bg-white dark:bg-[#0B1118] shadow-sm border border-slate-200 dark:border-white/5"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3 pointer-events-auto ml-auto">
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all cursor-pointer"
        >
          {isDark ? <Moon className="w-5 h-5 text-slate-400" /> : <Sun className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all cursor-pointer"
          >
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#2E7D32] dark:bg-rose-500 text-[9px] font-extrabold text-white ring-2 ring-[#FAFAFA] dark:ring-[#0B1118]">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827] shadow-xl z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/40">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Notifications</h3>
                </div>
                
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                  {alerts.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No new notifications.
                    </div>
                  ) : (
                    alerts.slice(0, 5).map((alert) => (
                      <div 
                        key={alert._id} 
                        className={`p-4 transition-all flex items-start gap-3.5 hover:bg-slate-50 dark:hover:bg-slate-900/40 ${alert.status === 'UNREAD' ? 'bg-[#E8F5E9]/50 dark:bg-rose-500/5' : ''}`}
                      >
                        <div className="mt-0.5"><AlertOctagon className="w-5 h-5 text-[#2E7D32] dark:text-rose-500" /></div>
                        <div className="flex-1 space-y-1">
                          <p className={`text-xs ${alert.status === 'UNREAD' ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                            {alert.message}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                            <span>{new Date(alert.createdAt).toLocaleTimeString()}</span>
                            {alert.status === 'UNREAD' && (
                              <button 
                                onClick={() => markAlertRead(alert._id)}
                                className="text-[#2E7D32] dark:text-emerald-400 hover:text-[#1B5E20] dark:hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle className="w-3 h-3" /> Resolve
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="p-3 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/40 text-center">
                  <button 
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate('/notifications');
                    }}
                    className="text-xs text-[#2E7D32] dark:text-emerald-400 hover:text-[#1B5E20] dark:hover:text-emerald-300 font-bold cursor-pointer"
                  >
                    View All Notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Avatar (Top Right) */}
        <div className="w-8 h-8 rounded-full bg-[#E8F5E9] dark:bg-emerald-900/30 text-[#2E7D32] dark:text-emerald-400 flex items-center justify-center ml-2 border border-[#C8E6C9] dark:border-emerald-500/20">
          <Leaf className="w-4 h-4" />
        </div>

      </div>

    </header>
  );
};

export default Navbar;
