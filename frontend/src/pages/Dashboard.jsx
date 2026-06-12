import React from 'react';
import { motion } from 'framer-motion';
import { useIoT } from '../context/IoTContext';
import { 
  Cpu, 
  BatteryCharging, 
  Activity, 
  Eye, 
  AlertTriangle, 
  Radio, 
  ShieldAlert, 
  Database,
  RefreshCw,
  Zap,
  ArrowRight,
  Gauge
} from 'lucide-react';

export const Dashboard = () => {
  const { 
    activeDevice, 
    summary, 
    health, 
    lastSync, 
    refreshData, 
    mqttStatus, 
    dbStatus 
  } = useIoT();

  // Determine component status colors based on active device telemetry
  const getComponentColor = (type, value) => {
    switch (type) {
      case 'battery':
        if (value > 40) return { border: 'border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'glow-green' };
        if (value > 20) return { border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/10', glow: 'glow-yellow' };
        return { border: 'border-red-500/30', text: 'text-red-400', bg: 'bg-red-500/10', glow: 'glow-red' };
      case 'sensor':
        return value 
          ? { border: 'border-amber-500/40', text: 'text-amber-400 animate-pulse', bg: 'bg-amber-500/20', glow: 'glow-yellow' }
          : { border: 'border-emerald-500/20', text: 'text-emerald-400', bg: 'bg-emerald-500/5', glow: 'glow-green' };
      case 'camera':
        return value 
          ? { border: 'border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'glow-green' }
          : { border: 'border-red-500/30', text: 'text-red-400', bg: 'bg-red-500/10', glow: 'glow-red' };
      case 'actuator':
        return value 
          ? { border: 'border-amber-500/40', text: 'text-amber-400 animate-pulse', bg: 'bg-amber-500/20', glow: 'glow-yellow' }
          : { border: 'border-slate-500/20', text: 'text-slate-400', bg: 'bg-slate-500/5', glow: '' };
      default:
        return { border: 'border-emerald-500/20', text: 'text-emerald-400', bg: 'bg-emerald-500/5', glow: '' };
    }
  };

  const batColor = getComponentColor('battery', activeDevice?.battery || 0);
  const pirColor = getComponentColor('sensor', activeDevice?.pir);
  const ultraColor = getComponentColor('sensor', activeDevice?.ultrasonic);
  const vibColor = getComponentColor('sensor', activeDevice?.vibration);
  const camColor = getComponentColor('camera', activeDevice?.camera);
  const buzColor = getComponentColor('actuator', activeDevice?.buzzer);
  const ledColor = getComponentColor('actuator', activeDevice?.led);
  const motColor = getComponentColor('actuator', activeDevice?.motor || activeDevice?.status === 'Active');

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Navbar Aggregates & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-wide">IoT Telemetry Dashboard</h2>
          <p className="text-xs text-slate-400 font-semibold tracking-wide">Real-time status of CHITTI Smart Scarecrow fields</p>
        </div>
        <div className="flex items-center gap-3.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Telemetry Sync: <strong className="text-white font-semibold">{lastSync}</strong></span>
          </div>
          <button 
            onClick={refreshData}
            className="px-3 py-1.5 bg-[#111827] border border-white/5 hover:border-[#4CAF50]/30 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Force Sync</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Device Online Status */}
        <motion.div 
          variants={cardVariants} initial="hidden" animate="visible"
          className="glass-card rounded-2xl p-5 border border-white/5 flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold tracking-wider uppercase">Active Scaffolds</span>
            <h3 className="text-2xl font-extrabold text-white">01 / 01</h3>
            <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              All nodes responsive
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Cpu className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Battery Health */}
        <motion.div 
          variants={cardVariants} initial="hidden" animate="visible"
          className="glass-card rounded-2xl p-5 border border-white/5 flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold tracking-wider uppercase">Battery Health</span>
            <h3 className="text-2xl font-extrabold text-white">{activeDevice?.battery || 0}%</h3>
            <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {(activeDevice?.solarVoltage || 0) > 4.5 ? 'Solar charging active' : 'Solar stand-by'}
            </p>
          </div>
          <div className={`p-3 rounded-xl bg-emerald-500/10 text-emerald-400`}>
            <BatteryCharging className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Today's Events */}
        <motion.div 
          variants={cardVariants} initial="hidden" animate="visible"
          className="glass-card rounded-2xl p-5 border border-white/5 flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold tracking-wider uppercase">Threat Detections</span>
            <h3 className="text-2xl font-extrabold text-white">{summary?.totalEvents || 0}</h3>
            <p className="text-[10px] text-amber-400 font-bold">
              Wild boars, Deers, Elephants
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Active Alarm Logs */}
        <motion.div 
          variants={cardVariants} initial="hidden" animate="visible"
          className="glass-card rounded-2xl p-5 border border-white/5 flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold tracking-wider uppercase">Active Alerts</span>
            <h3 className="text-2xl font-extrabold text-red-500">{summary?.unreadAlerts || 0}</h3>
            <p className="text-[10px] text-red-400 font-bold">
              Require operator check
            </p>
          </div>
          <div className="p-3 bg-red-500/10 text-red-400 rounded-xl">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
        </motion.div>

      </div>

      {/* Main Grid: Digital Twin & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Large Digital Twin Card */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 lg:col-span-2 space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#4CAF50]/30 to-transparent"></div>
          
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">CHITTI 4.0 Schematic Digital Twin</h3>
              <p className="text-xs text-slate-400">Glow indicators represent live node parameters</p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-full animate-pulse uppercase">
              Online
            </span>
          </div>

          {/* SVG Digital Twin Interactive Diagram */}
          <div className="relative w-full h-[380px] bg-slate-950/60 rounded-2xl border border-white/5 flex items-center justify-center p-4">
            
            {/* Ambient tech grid overlay */}
            <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none rounded-2xl"></div>

            {/* Glowing lines background SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 360">
              {/* Lines from solar to battery */}
              <path d="M 120,60 L 120,150" stroke="#4CAF50" strokeWidth="2" fill="none" opacity="0.4" strokeDasharray="5, 5" />
              
              {/* Line from Battery to ESP32 CAM */}
              <path d="M 120,180 L 300,180" stroke="#4CAF50" strokeWidth="2" strokeDasharray="5" className="animate-flow" fill="none" opacity="0.6" />
              
              {/* Line from ESP32 to Sensors */}
              <path d="M 300,160 L 480,80" stroke="#4CAF50" strokeWidth="1.5" fill="none" opacity="0.4" />
              <path d="M 300,180 L 480,180" stroke="#4CAF50" strokeWidth="1.5" fill="none" opacity="0.4" />
              <path d="M 300,200 L 480,280" stroke="#4CAF50" strokeWidth="1.5" fill="none" opacity="0.4" />
              
              {/* Line from ESP32 to Actuators */}
              <path d="M 300,210 L 120,290" stroke="#4CAF50" strokeWidth="1.5" fill="none" opacity="0.3" />
              <path d="M 300,210 L 300,290" stroke="#4CAF50" strokeWidth="1.5" fill="none" opacity="0.3" />
            </svg>

            {/* Nodes placement */}

            {/* 1. Solar Panel Node */}
            <div className="absolute top-8 left-12 flex flex-col items-center">
              <div className="w-18 h-18 rounded-xl bg-slate-900 border border-white/10 flex flex-col items-center justify-center glow-green p-1">
                <SunIcon className="w-6 h-6 text-amber-400" />
                <span className="text-[9px] font-bold text-white mt-1">Solar PV</span>
                <span className="text-[9px] text-emerald-400 font-mono font-bold">{activeDevice?.solarVoltage || 0}V</span>
              </div>
            </div>

            {/* 2. Battery Node */}
            <div className="absolute top-36 left-12 flex flex-col items-center">
              <div className={`w-18 h-18 rounded-xl bg-slate-900 border flex flex-col items-center justify-center p-1 ${batColor.border} ${batColor.glow}`}>
                <BatteryCharging className={`w-6 h-6 ${batColor.text}`} />
                <span className="text-[9px] font-bold text-white mt-1">Battery</span>
                <span className="text-[9px] text-slate-300 font-mono font-bold">{activeDevice?.battery || 0}%</span>
              </div>
            </div>

            {/* 3. ESP32 CAM Center Node */}
            <div className="absolute top-32 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
              <div className={`w-24 h-24 rounded-2xl bg-[#0F172A] border flex flex-col items-center justify-center p-2 shadow-2xl ${camColor.border} ${camColor.glow}`}>
                <div className="relative">
                  <Cpu className={`w-10 h-10 ${camColor.text}`} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                </div>
                <span className="text-[10px] font-black text-white mt-2">ESP32 Core</span>
                <span className="text-[8px] text-[#4CAF50] font-bold tracking-widest mt-0.5 uppercase">CAM Controller</span>
              </div>
            </div>

            {/* Sensors column (Right) */}
            <div className="absolute right-12 top-8 flex flex-col gap-6">
              
              {/* PIR Sensor */}
              <div className={`w-28 px-3 py-2 bg-slate-900 border rounded-xl flex items-center gap-2.5 ${pirColor.border} ${pirColor.glow}`}>
                <Activity className={`w-5 h-5 ${pirColor.text}`} />
                <div>
                  <p className="text-[9px] font-bold text-white">PIR Sensor</p>
                  <p className="text-[8px] text-slate-400 font-bold">{activeDevice?.pir ? "MOTION DETECTED" : "Scanning..."}</p>
                </div>
              </div>

              {/* Ultrasonic Sensor */}
              <div className={`w-28 px-3 py-2 bg-slate-900 border rounded-xl flex items-center gap-2.5 ${ultraColor.border} ${ultraColor.glow}`}>
                <Gauge className={`w-5 h-5 ${ultraColor.text}`} />
                <div>
                  <p className="text-[9px] font-bold text-white">Ultrasonic</p>
                  <p className="text-[8px] text-slate-400 font-bold">{activeDevice?.ultrasonic ? "RANGE EXCEEDED" : "Clear sector"}</p>
                </div>
              </div>

              {/* Vibration Sensor */}
              <div className={`w-28 px-3 py-2 bg-slate-900 border rounded-xl flex items-center gap-2.5 ${vibColor.border} ${vibColor.glow}`}>
                <Radio className={`w-5 h-5 ${vibColor.text}`} />
                <div>
                  <p className="text-[9px] font-bold text-white">Vibration</p>
                  <p className="text-[8px] text-slate-400 font-bold">{activeDevice?.vibration ? "SEISMIC INTENT" : "Stabilized"}</p>
                </div>
              </div>

            </div>

            {/* Actuators row (Bottom) */}
            <div className="absolute bottom-6 left-12 right-12 flex justify-between gap-4">
              
              {/* Buzzer Alert */}
              <div className={`px-4 py-2.5 bg-slate-900 border rounded-xl flex items-center gap-2 ${buzColor.border} ${buzColor.glow}`}>
                <span className={`w-2 h-2 rounded-full ${activeDevice?.buzzer ? 'bg-amber-400 animate-ping' : 'bg-slate-700'}`} />
                <span className="text-[9px] font-bold text-slate-300">Buzzer: {activeDevice?.buzzer ? 'SOUND' : 'OFF'}</span>
              </div>

              {/* LED Strobe */}
              <div className={`px-4 py-2.5 bg-slate-900 border rounded-xl flex items-center gap-2 ${ledColor.border} ${ledColor.glow}`}>
                <span className={`w-2 h-2 rounded-full ${activeDevice?.led ? 'bg-amber-400 animate-ping' : 'bg-slate-700'}`} />
                <span className="text-[9px] font-bold text-slate-300">LED Strobe: {activeDevice?.led ? 'ACTIVE' : 'OFF'}</span>
              </div>

              {/* Motor Arm */}
              <div className={`px-4 py-2.5 bg-slate-900 border rounded-xl flex items-center gap-2 ${motColor.border} ${motColor.glow}`}>
                <span className={`w-2 h-2 rounded-full ${motColor.glow ? 'bg-amber-400 animate-ping' : 'bg-slate-700'}`} />
                <span className="text-[9px] font-bold text-slate-300">Motor Rotator: {activeDevice?.motor || activeDevice?.status === 'Active' ? 'ACTIVE' : 'OFF'}</span>
              </div>

            </div>

          </div>

        </div>

        {/* Right column: Data Pipeline Workflow */}
        <div className="space-y-6">
          
          {/* Data Flow Card */}
          <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-5 shadow-lg relative">
            <h3 className="text-md font-bold text-white tracking-wide border-b border-white/5 pb-3">Telemetry Data Flow</h3>
            
            <div className="space-y-4">
              
              {/* Sensor Node */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Activity className="w-4 h-4" /></div>
                  <span className="text-xs font-bold text-slate-200">1. Sensors (PIR, Ultrasonic)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Analog Telemetry</span>
              </div>

              <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-[#4CAF50] rotate-90" /></div>

              {/* ESP32 Node */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Cpu className="w-4 h-4" /></div>
                  <span className="text-xs font-bold text-slate-200">2. ESP32 CAM Node</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">Processing</span>
              </div>

              <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-[#4CAF50] rotate-90" /></div>

              {/* MQTT Broker Node */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Radio className="w-4 h-4 animate-pulse" /></div>
                  <span className="text-xs font-bold text-slate-200">3. MQTT Broker Connection</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">Publisher</span>
              </div>

              <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-[#4CAF50] rotate-90" /></div>

              {/* Express Server Node */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Cpu className="w-4 h-4" /></div>
                  <span className="text-xs font-bold text-slate-200">4. Backend API Server</span>
                </div>
                <span className="text-[10px] text-[#4CAF50] font-mono">Receiver</span>
              </div>

              <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-[#4CAF50] rotate-90" /></div>

              {/* MongoDB Node */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Database className="w-4 h-4" /></div>
                  <span className="text-xs font-bold text-slate-200">5. MongoDB Database</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold font-mono">Persistence</span>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

// Simple Sun helper icon
const SunIcon = (props) => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
  </svg>
);

export default Dashboard;
