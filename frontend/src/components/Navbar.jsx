import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  User, 
  ChevronDown, 
  Database, 
  Wifi, 
  LogOut, 
  Settings, 
  Play, 
  CheckCircle,
  AlertOctagon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIoT } from '../context/IoTContext';

export const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { 
    alerts, 
    mqttStatus, 
    dbStatus, 
    lastSync, 
    refreshData, 
    markAlertRead, 
    triggerSimulation 
  } = useIoT();

  const [time, setTime] = useState(new Date());
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Digital Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Theme Toggle
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadAlerts = alerts.filter(a => a.status === 'UNREAD');

  const formattedDate = time.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const getAlertIcon = (type) => {
    if (type === 'WILDLIFE_DETECTED') return <AlertOctagon className="w-5 h-5 text-red-500" />;
    return <AlertOctagon className="w-5 h-5 text-amber-500" />;
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-72 h-20 bg-[#0B1118]/80 backdrop-blur-md border-b border-white/5 z-30 flex items-center justify-between px-6">
      
      {/* Mobile Drawer Trigger & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 md:hidden transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search device registry, event logs, alerts..." 
            className="w-full pl-11 pr-4 py-2 text-sm bg-slate-900/60 hover:bg-slate-900 border border-white/5 focus:border-[#4CAF50]/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4CAF50]/30 text-white placeholder-slate-500 transition-all"
          />
        </div>
      </div>

      {/* Utilities panel */}
      <div className="flex items-center gap-4">
        
        {/* Dynamic Clock */}
        <div className="hidden lg:flex flex-col items-end px-3 py-1 border-r border-white/5">
          <span className="font-mono text-sm font-bold text-white tracking-widest">{formattedTime}</span>
          <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{formattedDate}</span>
        </div>

        {/* MQTT & DB status */}
        <div className="hidden md:flex items-center gap-3 bg-[#111827]/60 border border-white/5 px-3.5 py-1.5 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 border-r border-white/5 pr-3">
            <Wifi className={`w-3.5 h-3.5 ${mqttStatus === 'Connected' ? 'text-emerald-400' : 'text-red-400'}`} />
            <span className="text-slate-400 font-medium">MQTT</span>
            <span className={`w-1.5 h-1.5 rounded-full ${mqttStatus === 'Connected' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400 animate-ping'}`} />
          </div>
          <div className="flex items-center gap-1.5">
            <Database className={`w-3.5 h-3.5 ${dbStatus === 'Connected' ? 'text-emerald-400' : 'text-red-400'}`} />
            <span className="text-slate-400 font-medium">DB</span>
            <span className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'Connected' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400 animate-ping'}`} />
          </div>
        </div>

        {/* Threat Simulator Button */}
        <button
          onClick={triggerSimulation}
          className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-600/30 to-red-600/30 hover:from-amber-600/55 hover:to-red-600/55 border border-red-500/20 hover:border-red-500/30 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_10px_rgba(239,68,68,0.1)]"
          title="Simulate Live Threat Intrusion"
        >
          <Play className="w-3.5 h-3.5 text-red-400 fill-red-400" />
          <span className="hidden sm:inline">Simulate Threat</span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 text-slate-400 hover:text-white rounded-xl hover:bg-[#111827] border border-white/5 transition-all"
        >
          {isDark ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-blue-400" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2.5 text-slate-400 hover:text-white rounded-xl hover:bg-[#111827] border border-white/5 transition-all"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-extrabold text-white ring-2 ring-[#0B1118]">
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
                className="absolute right-0 mt-3.5 w-80 sm:w-96 rounded-2xl border border-white/5 bg-[#111827] shadow-[0_12px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                  <h3 className="font-bold text-sm text-white">System Alerts Ticker</h3>
                  <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full">
                    {unreadAlerts.length} Unresolved
                  </span>
                </div>
                
                <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                  {alerts.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No active alarm warnings.
                    </div>
                  ) : (
                    alerts.slice(0, 5).map((alert) => (
                      <div 
                        key={alert._id} 
                        className={`p-4 transition-all flex items-start gap-3.5 hover:bg-slate-900/40 ${alert.status === 'UNREAD' ? 'bg-red-500/5' : ''}`}
                      >
                        <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                        <div className="flex-1 space-y-1">
                          <p className={`text-xs ${alert.status === 'UNREAD' ? 'font-bold text-white' : 'text-slate-300'}`}>
                            {alert.message}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                            <span>{new Date(alert.createdAt).toLocaleTimeString()}</span>
                            {alert.status === 'UNREAD' && (
                              <button 
                                onClick={() => markAlertRead(alert._id)}
                                className="text-[#4CAF50] hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle className="w-3 h-3" /> Mark Resolved
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="p-3 border-t border-white/5 bg-slate-950/40 text-center">
                  <button 
                    onClick={() => {
                      setNotificationsOpen(false);
                      window.location.href = '/alerts';
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold"
                  >
                    View All Active Alarm Logs
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-white/5 bg-[#111827]/40 hover:bg-[#111827] text-left transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-[#4CAF50]/30 flex items-center justify-center text-[#4CAF50]">
              <User className="w-4.5 h-4.5" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-white leading-none">{user?.name || "System Operator"}</p>
              <p className="text-[10px] text-slate-400 capitalize mt-0.5">{user?.role || "Operator"}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute right-0 mt-3.5 w-60 rounded-2xl border border-white/5 bg-[#111827] shadow-[0_12px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-white/5 bg-slate-950/40">
                  <p className="text-sm font-bold text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
                <div className="p-2 space-y-0.5">
                  <button 
                    onClick={() => {
                      setProfileOpen(false);
                      window.location.href = '/settings';
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900/60 transition-all text-left"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Configuration Parameters</span>
                  </button>
                </div>
                <div className="p-2 border-t border-white/5 bg-slate-950/30">
                  <button 
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </header>
  );
};

export default Navbar;
