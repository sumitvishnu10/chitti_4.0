import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIoT } from '../context/IoTContext';
import { 
  Camera, 
  Maximize2, 
  Minimize2, 
  Wifi, 
  WifiOff,
  Activity,
  Gauge,
  Volume2,
  Lightbulb,
  Radio,
  AlertTriangle,
  Clock,
  ShieldCheck,
  BrainCircuit,
  Crosshair
} from 'lucide-react';

export const LiveCamera = () => {
  const { 
    activeDevice, 
    events, 
    alerts,
    mqttStatus 
  } = useIoT();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamStatus, setStreamStatus] = useState('loading'); // 'loading', 'online', 'offline'
  const videoContainerRef = useRef(null);
  
  const CAMERA_URL = "http://192.168.1.8"; // Default from requirements

  // Check if there is an active motion/object detection for highlighting
  const hasActiveAlert = activeDevice?.pir || activeDevice?.ultrasonic;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Simulate Stream loading and auto-reconnect
  useEffect(() => {
    // Basic connection simulation setup
    const timer = setTimeout(() => {
      // In a real app, an img.onload would set this to 'online' and img.onerror to 'offline'
      setStreamStatus('online');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleStreamError = () => {
    setStreamStatus('offline');
    // Auto-reconnect logic simulation
    setTimeout(() => {
      setStreamStatus('loading');
      setTimeout(() => setStreamStatus('online'), 2000);
    }, 5000);
  };

  // UI Status Helpers
  const getStatusColor = (isActive) => isActive 
    ? 'text-amber-400 bg-amber-500/20 border-amber-500/40 glow-yellow animate-pulse' 
    : 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20';

  const getConnectivityColor = (status) => status === 'Connected'
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    : 'text-red-400 bg-red-500/10 border-red-500/30 glow-red animate-pulse';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
            <Camera className="w-6 h-6 text-[#4CAF50]" /> Live Surveillance
          </h2>
          <p className="text-xs text-slate-400 font-semibold tracking-wide">Real-time camera feed and sensor fusion</p>
        </div>
        
        {/* Active Alert Banner if Motion Detected */}
        <AnimatePresence>
          {hasActiveAlert && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className="flex items-center gap-3 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-xl glow-red shadow-lg backdrop-blur-sm"
            >
              <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
              <div>
                <p className="text-xs font-black text-white tracking-widest uppercase">Intrusion Detected</p>
                <p className="text-[10px] font-bold text-red-300">
                  {activeDevice?.pir ? 'Motion (PIR)' : ''} 
                  {activeDevice?.pir && activeDevice?.ultrasonic ? ' & ' : ''} 
                  {activeDevice?.ultrasonic ? 'Proximity (Ultrasonic)' : ''}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Grid: Top Section (Left and Right Panels) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Panel: Live Camera Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div 
            ref={videoContainerRef}
            className={`relative w-full aspect-video bg-slate-950 rounded-3xl overflow-hidden border-2 transition-all duration-300 shadow-2xl flex items-center justify-center
              ${hasActiveAlert ? 'border-red-500 glow-red' : 'border-white/5'}
            `}
          >
            {/* Camera Viewport */}
            {streamStatus === 'online' ? (
              <img 
                src={CAMERA_URL} 
                alt="Live Camera Stream" 
                className={`w-full h-full object-cover ${hasActiveAlert ? 'scale-105' : 'scale-100'} transition-transform duration-700`}
                onError={handleStreamError}
              />
            ) : streamStatus === 'loading' ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase animate-pulse">Establishing Secure Link...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <WifiOff className="w-12 h-12 text-red-500/50" />
                <div className="text-center">
                  <span className="block text-sm font-bold text-red-400 uppercase tracking-wider">Connection Lost</span>
                  <span className="block text-xs text-slate-500 mt-1">Attempting auto-reconnect...</span>
                </div>
              </div>
            )}

            {/* Overlays */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${streamStatus === 'online' ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">LIVE</span>
              </div>
              <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[10px] font-bold text-slate-300 uppercase">
                CAM_01
              </div>
            </div>

            <div className="absolute bottom-4 right-4">
              <button 
                onClick={toggleFullscreen}
                className="p-2 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-white transition-all"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* AI Bounding Box Overlay Simulation (Appears on alert) */}
            <AnimatePresence>
              {hasActiveAlert && streamStatus === 'online' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <div className="absolute top-[20%] left-[30%] w-[40%] h-[50%] border-2 border-red-500 bg-red-500/10 transition-all duration-500 flex flex-col justify-end p-2">
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 self-start uppercase tracking-wider">Subject Identified (92%)</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Camera Status & Stream Health */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${streamStatus === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {streamStatus === 'online' ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stream Health</p>
                  <p className={`text-sm font-black ${streamStatus === 'online' ? 'text-emerald-400' : 'text-red-400'} uppercase`}>{streamStatus}</p>
                </div>
              </div>
              {streamStatus === 'online' && <span className="text-[10px] font-mono text-emerald-400/70">30 FPS | 720p</span>}
            </div>
            
            <div className={`glass-card p-4 rounded-2xl border flex items-center justify-between transition-colors ${hasActiveAlert ? 'bg-red-500/10 border-red-500/30' : 'border-white/5'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${hasActiveAlert ? 'bg-red-500/20 text-red-400' : 'bg-[#4CAF50]/10 text-[#4CAF50]'}`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sector Status</p>
                  <p className={`text-sm font-black ${hasActiveAlert ? 'text-red-400' : 'text-[#4CAF50]'} uppercase`}>
                    {hasActiveAlert ? 'Compromised' : 'Secure'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Sensors, Actuators & AI */}
        <div className="space-y-4">
          
          {/* Active Sensors */}
          <div className="glass-card rounded-2xl border border-white/5 p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">Hardware Telemetry</h3>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Connectivity */}
              <div className={`col-span-2 flex items-center justify-between p-3 rounded-xl border ${getConnectivityColor(mqttStatus)}`}>
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">MQTT Node</span>
                </div>
                <span className="text-xs font-black uppercase">{mqttStatus}</span>
              </div>

              {/* PIR */}
              <div className={`flex flex-col justify-center items-center gap-1.5 p-3 rounded-xl border ${getStatusColor(activeDevice?.pir)}`}>
                <Activity className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase">PIR Motion</span>
                <span className="text-xs font-black">{activeDevice?.pir ? 'DETECTED' : 'CLEAR'}</span>
              </div>

              {/* Ultrasonic */}
              <div className={`flex flex-col justify-center items-center gap-1.5 p-3 rounded-xl border ${getStatusColor(activeDevice?.ultrasonic)}`}>
                <Gauge className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase">Ultrasonic</span>
                <span className="text-xs font-black">{activeDevice?.ultrasonic ? 'PROXIMITY' : 'CLEAR'}</span>
              </div>

              {/* Buzzer */}
              <div className={`flex flex-col justify-center items-center gap-1.5 p-3 rounded-xl border ${getStatusColor(activeDevice?.buzzer)}`}>
                <Volume2 className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase">Buzzer</span>
                <span className="text-xs font-black">{activeDevice?.buzzer ? 'SOUNDING' : 'OFF'}</span>
              </div>

              {/* LED */}
              <div className={`flex flex-col justify-center items-center gap-1.5 p-3 rounded-xl border ${getStatusColor(activeDevice?.led)}`}>
                <Lightbulb className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase">Strobe LED</span>
                <span className="text-xs font-black">{activeDevice?.led ? 'ACTIVE' : 'OFF'}</span>
              </div>
            </div>
            
            {activeDevice?.ultrasonic && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 p-3 bg-red-500/20 border border-red-500/40 rounded-xl flex items-center justify-between">
                <span className="text-xs text-red-300 font-bold">Target Distance</span>
                <span className="text-sm text-red-400 font-black animate-pulse">2.4 Meters</span>
              </motion.div>
            )}
          </div>

          {/* AI Ready Architecture Placeholder */}
          <div className="glass-card rounded-2xl border border-indigo-500/20 p-5 space-y-4 bg-indigo-950/20 shadow-[0_0_20px_rgba(99,102,241,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <BrainCircuit className="w-24 h-24 text-indigo-400" />
            </div>
            
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" /> AI Animal Recognition
            </h3>
            
            {hasActiveAlert ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 relative z-10">
                <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Classified Type</span>
                  <span className="text-xs text-indigo-400 font-black tracking-wider">Wild Boar</span>
                </div>
                <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Confidence</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[92%] h-full bg-indigo-500" />
                    </div>
                    <span className="text-xs text-indigo-400 font-black">92%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Action</span>
                  <span className="text-xs text-amber-400 font-bold tracking-wider">Audio + Visual</span>
                </div>
              </motion.div>
            ) : (
              <div className="h-28 flex flex-col items-center justify-center text-slate-500 gap-2 relative z-10">
                <Crosshair className="w-6 h-6 opacity-50" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-center">Awaiting Detection<br/>TensorFlow Core Idle</p>
              </div>
            )}
          </div>
          
        </div>
      </div>

      {/* Bottom Panel: Event Logs & Detection History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Alerts */}
        <div className="glass-card rounded-2xl border border-white/5 p-5 flex flex-col h-72">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Critical Alerts
          </h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {alerts.slice(0, 5).map(alert => (
              <div key={alert._id} className="p-3 bg-black/30 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider ${alert.severity === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(alert.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">No active alerts</p>
              </div>
            )}
          </div>
        </div>

        {/* Detection History */}
        <div className="glass-card rounded-2xl border border-white/5 p-5 flex flex-col h-72">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#4CAF50]" /> Detection Log
          </h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {events.slice(0, 5).map(event => (
              <div key={event._id} className="p-3 bg-black/30 border border-white/5 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-900 border border-white/10 overflow-hidden flex-shrink-0">
                  <img src={event.imageUrl} alt="Detection" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white uppercase">{event.sensor} Event</p>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Deterrent: <span className="text-emerald-400 font-bold">{event.deterrent}</span></p>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Log empty</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default LiveCamera;
