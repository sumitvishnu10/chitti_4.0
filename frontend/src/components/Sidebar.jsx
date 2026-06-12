import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Cpu, 
  Settings, 
  Activity, 
  FileText, 
  LineChart, 
  AlertTriangle, 
  Heart, 
  LogOut,
  Zap,
  Battery,
  Shield,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIoT } from '../context/IoTContext';

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const { activeDevice, mqttStatus } = useIoT();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Device Monitor', path: '/device-monitor', icon: Cpu },
    { name: 'Sensor Monitoring', path: '/sensor-monitoring', icon: Activity },
    { name: 'Event Logs', path: '/event-logs', icon: FileText },
    { name: 'Analytics', path: '/analytics', icon: LineChart },
    { name: 'Alerts', path: '/alerts', icon: AlertTriangle },
    { name: 'System Health', path: '/system-health', icon: Heart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const getBatteryIcon = (lvl) => {
    if (lvl > 80) return <Battery className="w-5 h-5 text-emerald-500" />;
    if (lvl > 40) return <Battery className="w-5 h-5 text-amber-500" />;
    return <Battery className="w-5 h-5 text-red-500 animate-pulse" />;
  };

  return (
    <>
      {/* Background overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-[#0F172A] border-r border-white/5 
        transition-transform duration-300 transform md:translate-x-0 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand / Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative p-2 bg-[#2E7D32]/20 border border-[#4CAF50]/40 rounded-lg shadow-[0_0_10px_rgba(76,175,80,0.2)]">
              <Shield className="w-6 h-6 text-[#4CAF50]" />
              <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-wider text-white">CHITTI 4.0</h1>
              <p className="text-xs text-emerald-400 font-medium tracking-wide">Smart Scarecrow IoT</p>
            </div>
          </div>
          
          <button 
            onClick={toggleSidebar} 
            className="p-1 text-slate-400 rounded-lg hover:text-white hover:bg-slate-800 md:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all group
                ${isActive 
                  ? 'bg-gradient-to-r from-[#2E7D32]/30 to-[#4CAF50]/10 border border-[#4CAF50]/30 text-white shadow-[0_0_15px_rgba(76,175,80,0.1)]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }
              `}
              onClick={() => {
                if (window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-[#4CAF50]' : 'text-slate-400 group-hover:text-white'}`} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Information Card */}
        <div className="p-4 mx-4 mb-4 rounded-2xl bg-[#111827]/80 border border-white/5 shadow-inner">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
              <span className="text-slate-400">Node ID</span>
              <span className="font-mono text-emerald-400 font-semibold">{activeDevice?.deviceId || "N/A"}</span>
            </div>
            
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <p className="font-semibold text-slate-200">Solar Powered</p>
                <p className="text-slate-400">Wildlife Protection Active</p>
              </div>
            </div>

            {/* Battery Status */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Solar Battery</span>
                <span className="font-bold text-white">{activeDevice?.battery || 0}%</span>
              </div>
              <div className="flex items-center gap-2">
                {getBatteryIcon(activeDevice?.battery || 0)}
                <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div 
                    className={`h-full rounded-full ${
                      (activeDevice?.battery || 0) > 80 ? 'bg-emerald-500' : (activeDevice?.battery || 0) > 40 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${activeDevice?.battery || 0}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center justify-between text-xs border-t border-white/5 pt-2">
              <span className="text-slate-400">MQTT Broker</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${mqttStatus === 'Connected' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 animate-ping'}`} />
                <span className={`font-semibold ${mqttStatus === 'Connected' ? 'text-emerald-400' : 'text-red-400'}`}>{mqttStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="p-4 border-t border-white/5 bg-slate-950/40">
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 hover:text-red-300 font-semibold text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
