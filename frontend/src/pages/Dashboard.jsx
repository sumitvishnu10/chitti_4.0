import React from 'react';
import { motion } from 'framer-motion';
import { useIoT } from '../context/IoTContext';
import { 
  Cpu, 
  BatteryCharging, 
  Bell, 
  ShieldAlert, 
  RefreshCw,
  Activity,
  ChevronRight,
  Sun,
  Battery as BatteryIcon,
  Radar,
  Radio,
  Volume2,
  Lightbulb,
  Disc
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { 
    activeDevice, 
    summary, 
    lastSync, 
    refreshData
  } = useIoT();

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">System Overview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time status of your agricultural monitoring network.</p>
        </div>
        <div className="flex items-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <RefreshCw className="w-4 h-4" />
            <span>Updated: <strong className="text-slate-900 dark:text-white font-medium">{lastSync}</strong></span>
          </div>
          <button 
            onClick={refreshData}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 text-slate-900 dark:text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Sync</span>
          </button>
          <Link 
            to="/event-logs"
            className="px-4 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm"
          >
            <Activity className="w-4 h-4" />
            <span>Recent Detections</span>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Threat Detections */}
        <motion.div 
          variants={cardVariants} initial="hidden" animate="visible"
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-white/5 flex items-start justify-between shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="space-y-4 w-full">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-100 dark:border-transparent">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Today's Detections</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{summary?.totalEvents || 0}</h3>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div 
          variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-white/5 flex items-start justify-between shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="space-y-4 w-full">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-transparent">
                <Bell className="w-5 h-5" />
              </div>
              {summary?.unreadAlerts > 0 && (
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Unread Notifications</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{summary?.unreadAlerts || 0}</h3>
            </div>
          </div>
        </motion.div>

        {/* Battery Health */}
        <motion.div 
          variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-white/5 flex items-start justify-between shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="space-y-4 w-full">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl border border-slate-100 dark:border-transparent">
                <BatteryCharging className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E8F5E9] dark:bg-emerald-500/10 text-[#2E7D32] dark:text-emerald-400 border border-[#C8E6C9] dark:border-transparent">
                Charging
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Avg. Battery Level</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{activeDevice?.battery || 0}%</h3>
            </div>
          </div>
        </motion.div>

      </div>

      {/* CHITTI 4.0 Schematic Digital Twin */}
      <motion.div 
        variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}
        className="bg-white dark:bg-[#0B1118] rounded-3xl p-8 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-2xl overflow-hidden"
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-wide">CHITTI 4.0 Schematic Digital Twin</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Glow indicators represent live node parameters</p>
          </div>
          <div className="px-4 py-1.5 rounded-full border border-[#C8E6C9] dark:border-emerald-500/30 bg-[#E8F5E9] dark:bg-emerald-500/10 text-[#2E7D32] dark:text-emerald-400 text-xs font-bold tracking-widest uppercase flex items-center gap-2 shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] dark:bg-emerald-500 animate-pulse"></span>
            ONLINE
          </div>
        </div>

        <div className="relative w-full max-w-5xl mx-auto h-[500px] bg-slate-50 dark:bg-[#070b14] rounded-2xl border border-slate-200 dark:border-white/5 flex items-center justify-center p-8 overflow-hidden tech-grid shadow-inner dark:shadow-none">
          
          {/* SVG Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
             {/* ESP32 to Solar */}
             <line x1="45%" y1="44%" x2="14%" y2="31%" stroke="rgba(46, 125, 50, 0.4)" strokeWidth="1.5" strokeDasharray="4,4" />
             {/* ESP32 to Battery */}
             <line x1="45%" y1="44%" x2="14%" y2="63%" stroke="rgba(46, 125, 50, 0.4)" strokeWidth="1.5" strokeDasharray="4,4" />
             {/* Vertical dashed line connecting Solar and Battery visually like in image */}
             <line x1="24%" y1="31%" x2="24%" y2="63%" stroke="rgba(46, 125, 50, 0.4)" strokeWidth="1.5" strokeDasharray="4,4" />
             <line x1="24%" y1="47%" x2="39%" y2="47%" stroke="rgba(46, 125, 50, 0.4)" strokeWidth="1.5" strokeDasharray="4,4" />

             {/* ESP32 to PIR */}
             <line x1="45%" y1="44%" x2="82%" y2="19%" stroke="rgba(46, 125, 50, 0.6)" strokeWidth="2" />
             {/* ESP32 to Ultrasonic */}
             <line x1="45%" y1="44%" x2="82%" y2="39%" stroke="rgba(46, 125, 50, 0.6)" strokeWidth="2" />
             {/* ESP32 to Vibration */}
             <line x1="45%" y1="44%" x2="82%" y2="58%" stroke="rgba(46, 125, 50, 0.6)" strokeWidth="2" />
             
             {/* ESP32 to Buzzer */}
             <line x1="45%" y1="44%" x2="23%" y2="88%" stroke="rgba(46, 125, 50, 0.6)" strokeWidth="2" />
             {/* ESP32 to LED */}
             <line x1="45%" y1="44%" x2="50%" y2="88%" stroke="rgba(46, 125, 50, 0.6)" strokeWidth="2" />
             {/* ESP32 to Motor */}
             <line x1="45%" y1="44%" x2="77%" y2="88%" stroke="rgba(46, 125, 50, 0.6)" strokeWidth="2" />
          </svg>

          {/* Left Column: Power */}
          <div className="absolute left-[10%] top-[20%] flex flex-col gap-12 z-10">
            {/* Solar */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-24 bg-white dark:bg-[#0a151b] border border-[#C8E6C9] dark:border-emerald-500/20 rounded-xl shadow-md dark:shadow-[0_0_20px_rgba(16,185,129,0.1)] flex flex-col items-center justify-center text-center p-2">
                <Sun className="w-6 h-6 text-amber-500 mb-2" />
                <span className="text-[10px] font-bold text-slate-800 dark:text-white uppercase">Solar PV</span>
                <span className="text-[11px] font-mono text-[#2E7D32] dark:text-emerald-400 mt-1">{activeDevice?.solarVoltage || '12.6'}V</span>
              </div>
            </div>
            
            {/* Battery */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-24 bg-white dark:bg-[#0a151b] border border-[#C8E6C9] dark:border-emerald-500/20 rounded-xl shadow-md dark:shadow-[0_0_20px_rgba(16,185,129,0.1)] flex flex-col items-center justify-center text-center p-2">
                <BatteryIcon className="w-6 h-6 text-[#2E7D32] dark:text-emerald-500 mb-2" />
                <span className="text-[10px] font-bold text-slate-800 dark:text-white uppercase">Battery</span>
                <span className="text-[11px] font-mono text-[#2E7D32] dark:text-emerald-400 mt-1">{activeDevice?.battery || '92'}%</span>
              </div>
            </div>
          </div>

          {/* Center: ESP32 */}
          <div className="absolute left-[40%] top-[32%] z-20">
            <div className="w-28 h-32 bg-white dark:bg-[#09181a] border-2 border-[#81C784] dark:border-emerald-500/40 rounded-2xl shadow-lg dark:shadow-[0_0_30px_rgba(16,185,129,0.2)] flex flex-col items-center justify-center text-center p-2">
              <Cpu className="w-10 h-10 text-[#2E7D32] dark:text-emerald-400 mb-2" />
              <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase">ESP32 Core</span>
              <span className="text-[9px] font-mono text-[#4CAF50] dark:text-emerald-500 mt-1 leading-tight">CAM<br/>CONTROLLER</span>
            </div>
          </div>

          {/* Right Column: Sensors */}
          <div className="absolute right-[5%] top-[10%] flex flex-col gap-6 z-10">
            {/* PIR */}
            <div className="w-44 h-16 bg-white dark:bg-[#0a151b] border border-slate-200 dark:border-emerald-500/20 rounded-xl shadow-md dark:shadow-[0_0_20px_rgba(16,185,129,0.1)] flex items-center px-4 gap-4">
              <Activity className="w-6 h-6 text-[#2E7D32] dark:text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-800 dark:text-white uppercase">PIR Sensor</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{activeDevice?.pir ? 'Motion Detected' : 'Scanning...'}</span>
              </div>
            </div>
            
            {/* Ultrasonic */}
            <div className="w-44 h-16 bg-white dark:bg-[#0a151b] border border-slate-200 dark:border-emerald-500/20 rounded-xl shadow-md dark:shadow-[0_0_20px_rgba(16,185,129,0.1)] flex items-center px-4 gap-4">
              <Radar className="w-6 h-6 text-[#2E7D32] dark:text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-800 dark:text-white uppercase">Ultrasonic</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{activeDevice?.ultrasonic ? 'Alert' : 'Clear sector'}</span>
              </div>
            </div>

            {/* Vibration */}
            <div className="w-44 h-16 bg-white dark:bg-[#0a151b] border border-slate-200 dark:border-emerald-500/20 rounded-xl shadow-md dark:shadow-[0_0_20px_rgba(16,185,129,0.1)] flex items-center px-4 gap-4">
              <Radio className="w-6 h-6 text-[#2E7D32] dark:text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-800 dark:text-white uppercase">Vibration</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{activeDevice?.vibration ? 'Seismic' : 'Stabilized'}</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Actuators */}
          <div className="absolute bottom-[8%] w-full px-[10%] flex justify-between z-10">
            <div className="px-5 py-2.5 bg-white dark:bg-[#0d1620] border border-slate-200 dark:border-slate-700/50 rounded-full flex items-center gap-2 shadow-sm">
              <div className={`w-2 h-2 rounded-full ${activeDevice?.buzzer ? 'bg-rose-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Buzzer: {activeDevice?.buzzer ? 'ON' : 'OFF'}</span>
            </div>

            <div className="px-5 py-2.5 bg-white dark:bg-[#0d1620] border border-slate-200 dark:border-slate-700/50 rounded-full flex items-center gap-2 shadow-sm">
              <div className={`w-2 h-2 rounded-full ${activeDevice?.led ? 'bg-amber-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">LED Strobe: {activeDevice?.led ? 'ON' : 'OFF'}</span>
            </div>

            <div className="px-5 py-2.5 bg-white dark:bg-[#0d1620] border border-slate-200 dark:border-slate-700/50 rounded-full flex items-center gap-2 shadow-sm">
              <div className={`w-2 h-2 rounded-full ${activeDevice?.motor ? 'bg-blue-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Motor Rotator: {activeDevice?.motor ? 'ON' : 'OFF'}</span>
            </div>
          </div>

        </div>
      </motion.div>

    </div>
  );
};

export default Dashboard;
