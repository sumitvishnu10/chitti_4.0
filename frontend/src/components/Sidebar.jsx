import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Cpu, 
  Settings, 
  Activity, 
  FileText, 
  LineChart, 
  Bell, 
  Heart, 
  X,
  Camera,
  Leaf,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Device Monitor', path: '/device-monitor', icon: Cpu },
    { name: 'Live Camera', path: '/live-camera', icon: Camera },
    { name: 'Analytics', path: '/analytics', icon: LineChart },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Background overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-[#F4F8F4] dark:bg-[#0F172A] border-r border-slate-200 dark:border-white/5 
        transition-transform duration-300 transform md:translate-x-0 shadow-2xl md:shadow-none overflow-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Landscape Illustration (Background for bottom part) */}
        <div className="absolute bottom-0 left-0 right-0 h-[280px] pointer-events-none z-0 opacity-100 dark:opacity-10">
          <svg viewBox="0 0 400 300" className="w-full h-full object-cover" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F4F8F4" stopOpacity="0" />
                <stop offset="100%" stopColor="#E8F5E9" stopOpacity="1" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#sky)" />
            
            {/* Back Hills */}
            <path d="M0,200 Q100,150 200,200 T400,180 L400,300 L0,300 Z" fill="#C8E6C9" opacity="0.8" />
            {/* Trees Back */}
            <circle cx="280" cy="170" r="12" fill="#A5D6A7" />
            <rect x="278" y="180" width="4" height="20" fill="#81C784" />
            <circle cx="320" cy="160" r="16" fill="#A5D6A7" />
            <rect x="317" y="170" width="6" height="30" fill="#81C784" />
            
            {/* Mid Hill */}
            <path d="M-50,250 Q150,180 300,260 T450,220 L450,300 L-50,300 Z" fill="#A5D6A7" opacity="0.9" />
            {/* Trees Mid */}
            <circle cx="80" cy="220" r="14" fill="#81C784" />
            <rect x="78" y="230" width="4" height="20" fill="#4CAF50" />
            
            {/* Front Hill */}
            <path d="M-20,300 Q100,220 250,280 T420,260 L420,300 L-20,300 Z" fill="#81C784" />
            
            {/* House */}
            <g transform="translate(230, 240)">
              <rect x="0" y="10" width="40" height="25" fill="#4CAF50" />
              <polygon points="-5,10 20,-5 45,10" fill="#2E7D32" />
              <rect x="25" y="15" width="8" height="10" fill="#81C784" />
              <rect x="8" y="15" width="10" height="10" fill="#81C784" />
            </g>
          </svg>
        </div>

        {/* Brand / Logo */}
        <div className="relative z-10 flex items-center justify-between p-6 pb-2 border-b border-transparent">
          <div className="flex items-center gap-3 mb-4 mt-2">
            <div className="text-[#2E7D32] dark:text-emerald-400">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                 <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                 <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tight text-[#1B5E20] dark:text-white leading-tight">CHITTI 4.0</h1>
              <p className="text-[10px] text-[#4CAF50] font-bold tracking-widest uppercase">Agri Guard</p>
            </div>
          </div>
          
          <button 
            onClick={toggleSidebar} 
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors rounded-lg mb-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="relative z-10 flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                relative flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all group overflow-hidden
                ${isActive 
                  ? 'bg-[#E8F5E9] dark:bg-emerald-500/10 text-[#1B5E20] dark:text-emerald-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
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
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2E7D32] dark:bg-emerald-500 rounded-r-full"></div>
                  )}
                  <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-[#2E7D32] dark:text-emerald-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Profile Card */}
        <div className="relative z-10 p-4 m-4 mt-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 flex items-center justify-between shadow-lg border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#689F38] dark:bg-emerald-600 text-white flex items-center justify-center shadow-inner">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 dark:text-white text-sm leading-tight">{user?.name || "Admin"}</span>
                <span className="text-[10px] text-slate-500">{user?.email || "admin@chitti4.com"}</span>
              </div>
            </div>
            <button onClick={logout} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
