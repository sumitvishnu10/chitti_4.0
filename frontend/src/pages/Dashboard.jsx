import React, { useState, useEffect } from 'react';
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
  Camera,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ImageWithFallback = ({ src, alt, className, style, onClick }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (error || !src) {
    return (
      <div 
        onClick={onClick} 
        className={`${className} bg-slate-800/90 flex flex-col items-center justify-center text-slate-400 p-2 gap-1 border border-slate-700/50`}
        style={style}
      >
        <Camera className="w-5 h-5 text-emerald-500 opacity-80" />
        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-300">Camera Snapshot</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      style={style}
      onClick={onClick} 
      onError={() => setError(true)} 
    />
  );
};

export const Dashboard = () => {
  const { 
    activeDevice, 
    summary, 
    lastSync, 
    refreshData,
    loading,
    backendOffline,
    detections,
    latestDetection,
    stats,
    getImageUrl
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

      {/* Backend Offline Banner / Loading Indicator */}
      {backendOffline && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
            <div>
              <h4 className="text-sm font-bold">Backend Offline</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Unable to connect to Express backend at http://localhost:5000. Retrying...</p>
            </div>
          </div>
          <button onClick={refreshData} className="px-3 py-1.5 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {loading && detections.length === 0 && !backendOffline && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold tracking-wide animate-pulse">
          Loading live AI detections...
        </div>
      )}

      {/* Live Detection Card */}
      <motion.div 
        variants={cardVariants} initial="hidden" animate="visible"
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-md space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live AI Detection Feed</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Latest detection received from Python AI module</p>
            </div>
          </div>
          {latestDetection && (
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${
              (latestDetection.animal || '').toLowerCase().includes('person') || (latestDetection.animal || '').toLowerCase().includes('human')
                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
            }`}>
              {(latestDetection.animal || '').toLowerCase().includes('person') || (latestDetection.animal || '').toLowerCase().includes('human')
                ? 'Human Detected'
                : 'Wildlife Intrusion Detected'}
            </span>
          )}
        </div>

        {latestDetection ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/10 group shadow-md">
              <ImageWithFallback 
                src={getImageUrl(latestDetection.image)} 
                alt={latestDetection.animal} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                LIVE SNAPSHOT
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Detected Object</span>
                <h4 className="text-3xl font-black text-slate-900 dark:text-white capitalize">
                  {latestDetection.animal}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Confidence</span>
                  <span className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {latestDetection.confidence ? Number(latestDetection.confidence).toFixed(2) : 0}%
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Camera Source</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {latestDetection.camera || 'Laptop Webcam'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Timestamp</span>
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                  {new Date(latestDetection.timestamp || latestDetection.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
            <Camera className="w-10 h-10 mx-auto mb-2 opacity-40 text-emerald-500" />
            <p className="text-sm font-medium">No live detections recorded yet.</p>
            <p className="text-xs text-slate-500 mt-1">Waiting for Python AI script to send detection logs...</p>
          </div>
        )}
      </motion.div>

      {/* Dynamic Statistics Cards */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Detection Statistics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Detections</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.totalDetections}</h3>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Persons</p>
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.totalPersons}</h3>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Dogs</p>
            <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.totalDogs}</h3>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Cows</p>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.totalCows}</h3>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Elephants</p>
            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.totalElephants}</h3>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Latest Detection</p>
            <h3 className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mt-2 truncate">
              {stats.latestDetectionTime}
            </h3>
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Detection Activity</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time detection events logged by Express backend</p>
          </div>
          <Link to="/event-logs" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {detections.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No recent detection activity recorded.</p>
        ) : (
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {detections.slice(0, 6).map((d) => {
              const isPerson = (d.animal || '').toLowerCase().includes('person') || (d.animal || '').toLowerCase().includes('human');
              const formattedAnimal = d.animal ? (d.animal.charAt(0).toUpperCase() + d.animal.slice(1)) : 'Unknown';
              return (
                <div key={d._id} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center gap-3.5">
                    <ImageWithFallback 
                      src={getImageUrl(d.image)} 
                      alt={d.animal} 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-white/10 shrink-0" 
                    />
                    <div>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                        {formattedAnimal} detected
                      </h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>Camera: <strong>{d.camera || 'Laptop Webcam'}</strong></span>
                        <span>•</span>
                        <span>Confidence: <strong>{d.confidence ? Number(d.confidence).toFixed(1) : 0}%</strong></span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase block ${
                      isPerson ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {isPerson ? 'Human Detected' : 'Wildlife Intrusion Detected'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      {new Date(d.timestamp || d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top Metric Cards Grid (Original Layout preserved) */}
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
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Detections Logged</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.totalDetections}</h3>
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
          
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
             <line x1="45%" y1="44%" x2="14%" y2="31%" stroke="rgba(46, 125, 50, 0.4)" strokeWidth="1.5" strokeDasharray="4,4" />
             <line x1="45%" y1="44%" x2="14%" y2="63%" stroke="rgba(46, 125, 50, 0.4)" strokeWidth="1.5" strokeDasharray="4,4" />
             <line x1="24%" y1="31%" x2="24%" y2="63%" stroke="rgba(46, 125, 50, 0.4)" strokeWidth="1.5" strokeDasharray="4,4" />
             <line x1="24%" y1="47%" x2="39%" y2="47%" stroke="rgba(46, 125, 50, 0.4)" strokeWidth="1.5" strokeDasharray="4,4" />

             <line x1="45%" y1="44%" x2="82%" y2="19%" stroke="rgba(46, 125, 50, 0.6)" strokeWidth="2" />
             <line x1="45%" y1="44%" x2="82%" y2="39%" stroke="rgba(46, 125, 50, 0.6)" strokeWidth="2" />
             <line x1="45%" y1="44%" x2="82%" y2="58%" stroke="rgba(46, 125, 50, 0.6)" strokeWidth="2" />
             
             <line x1="45%" y1="44%" x2="23%" y2="88%" stroke="rgba(46, 125, 50, 0.6)" strokeWidth="2" />
             <line x1="45%" y1="44%" x2="50%" y2="88%" stroke="rgba(46, 125, 50, 0.6)" strokeWidth="2" />
             <line x1="45%" y1="44%" x2="77%" y2="88%" stroke="rgba(46, 125, 50, 0.6)" strokeWidth="2" />
          </svg>

          {/* Left Column: Power */}
          <div className="absolute left-[10%] top-[20%] flex flex-col gap-12 z-10">
            <div className="flex items-center gap-4">
              <div className="w-20 h-24 bg-white dark:bg-[#0a151b] border border-[#C8E6C9] dark:border-emerald-500/20 rounded-xl shadow-md dark:shadow-[0_0_20px_rgba(16,185,129,0.1)] flex flex-col items-center justify-center text-center p-2">
                <Sun className="w-6 h-6 text-amber-500 mb-2" />
                <span className="text-[10px] font-bold text-slate-800 dark:text-white uppercase">Solar PV</span>
                <span className="text-[11px] font-mono text-[#2E7D32] dark:text-emerald-400 mt-1">{activeDevice?.solarVoltage || '12.6'}V</span>
              </div>
            </div>
            
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
            <div className="w-44 h-16 bg-white dark:bg-[#0a151b] border border-slate-200 dark:border-emerald-500/20 rounded-xl shadow-md dark:shadow-[0_0_20px_rgba(16,185,129,0.1)] flex items-center px-4 gap-4">
              <Activity className="w-6 h-6 text-[#2E7D32] dark:text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-800 dark:text-white uppercase">PIR Sensor</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{activeDevice?.pir ? 'Motion Detected' : 'Scanning...'}</span>
              </div>
            </div>
            
            <div className="w-44 h-16 bg-white dark:bg-[#0a151b] border border-slate-200 dark:border-emerald-500/20 rounded-xl shadow-md dark:shadow-[0_0_20px_rgba(16,185,129,0.1)] flex items-center px-4 gap-4">
              <Radar className="w-6 h-6 text-[#2E7D32] dark:text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-800 dark:text-white uppercase">Ultrasonic</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{activeDevice?.ultrasonic ? 'Alert' : 'Clear sector'}</span>
              </div>
            </div>

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
