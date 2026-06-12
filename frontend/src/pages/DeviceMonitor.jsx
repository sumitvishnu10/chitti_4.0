import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIoT } from '../context/IoTContext';
import { 
  Sun, 
  Cpu, 
  Battery, 
  Activity, 
  Compass, 
  Volume2, 
  Lightbulb, 
  Maximize2, 
  Minimize2, 
  Clock, 
  AlertOctagon, 
  CheckCircle, 
  Radio, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  TableProperties
} from 'lucide-react';

export const DeviceMonitor = () => {
  const { activeDevice, events, alerts, markAlertRead } = useIoT();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraImage, setCameraImage] = useState('https://images.unsplash.com/photo-1507666405895-422efe53f00d?w=800&q=80');
  const [detectedAnimal, setDetectedAnimal] = useState('Wild Boar');
  const [confidence, setConfidence] = useState(94);
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());

  // Watch for live threat events and update camera feed/details
  useEffect(() => {
    if (events && events.length > 0) {
      const latestEvent = events[0];
      if (latestEvent.imageUrl) {
        setCameraImage(latestEvent.imageUrl);
        if (latestEvent.imageUrl.includes('photo-1507666405895-422efe53f00d')) {
          setDetectedAnimal('Wild Boar');
          setConfidence(94);
        } else if (latestEvent.imageUrl.includes('photo-1484406566174-9da000fda645')) {
          setDetectedAnimal('Deer');
          setConfidence(88);
        } else {
          setDetectedAnimal('Elephant');
          setConfidence(92);
        }
        setTimestamp(new Date(latestEvent.timestamp).toLocaleTimeString());
      }
    }
  }, [events]);

  const components = [
    { id: 'pv', name: 'Solar PV Panel', type: 'Power Input', value: `${activeDevice?.solarVoltage || 0} V`, status: 'Charging', health: 98, icon: Sun, color: 'text-amber-400' },
    { id: 'bms', name: 'Lithium Battery Stack', type: 'Power Output', value: `${activeDevice?.battery || 0}%`, status: (activeDevice?.battery || 0) > 20 ? 'Healthy' : 'Low', health: activeDevice?.battery || 0, icon: Battery, color: 'text-emerald-400' },
    { id: 'esp', name: 'ESP32 CAM Controller', type: 'Core CPU', value: activeDevice?.camera ? 'Streaming' : 'Offline', status: activeDevice?.camera ? 'Online' : 'Offline', health: activeDevice?.camera ? 100 : 0, icon: Cpu, color: 'text-[#4CAF50]' },
    { id: 'pir', name: 'PIR Motion Sensor', type: 'Sensor Input', value: activeDevice?.pir ? 'Motion' : 'Static', status: activeDevice?.pir ? 'Active' : 'Scanning', health: 96, icon: Activity, color: 'text-amber-400' },
    { id: 'sonar', name: 'Ultrasonic Proximity', type: 'Sensor Input', value: activeDevice?.ultrasonic ? 'Alert' : 'Clear', status: activeDevice?.ultrasonic ? 'Active' : 'Scanning', health: 95, icon: Compass, color: 'text-indigo-400' },
    { id: 'vib', name: 'Vibration (Seismic)', type: 'Sensor Input', value: activeDevice?.vibration ? 'Seismic' : 'Stable', status: activeDevice?.vibration ? 'Active' : 'Scanning', health: 97, icon: Radio, color: 'text-sky-400' },
    { id: 'buzzer', name: 'Acoustic Buzzer', type: 'Actuator', value: activeDevice?.buzzer ? 'Active' : 'Muted', status: activeDevice?.buzzer ? 'Fired' : 'Standby', health: 100, icon: Volume2, color: 'text-rose-400' },
    { id: 'led', name: 'LED Flash Strobe', type: 'Actuator', value: activeDevice?.led ? 'Active' : 'Off', status: activeDevice?.led ? 'Fired' : 'Standby', health: 100, icon: Lightbulb, color: 'text-yellow-400' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-wide">CHITTI 4.0 Device Monitor</h2>
          <p className="text-xs text-slate-400 font-semibold tracking-wide">High fidelity inspection of agricultural smart scarecrow modules</p>
        </div>
      </div>

      {/* Three Column Industrial IoT Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* ================= COLUMN 1: DIGITAL TWIN SCHEMATIC ================= */}
        <div className="glass-card rounded-3xl p-5 border border-white/5 space-y-5 flex flex-col shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#4CAF50]/30 to-transparent"></div>
          
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5 text-[#4CAF50]" />
              Digital Twin Topology
            </h3>
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full animate-pulse uppercase">
              Operational
            </span>
          </div>

          {/* Interactive SVG schematic representation */}
          <div className="flex-1 min-h-[360px] bg-slate-950/60 rounded-2xl border border-white/5 relative flex items-center justify-center p-4">
            
            {/* Tech grid overlay */}
            <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none rounded-2xl"></div>

            {/* Topology SVG lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 360">
              {/* Solar to Battery */}
              <line x1="60" y1="65" x2="60" y2="155" stroke="#4CAF50" strokeWidth="1.5" strokeDasharray="4" opacity="0.4" />
              {/* Battery to ESP32 CAM */}
              <path d="M 60,185 L 150,185" stroke="#4CAF50" strokeWidth="1.5" strokeDasharray="4" className="animate-flow" fill="none" opacity="0.6" />
              {/* ESP32 to Sensors */}
              <path d="M 150,165 L 240,85" stroke="#4CAF50" strokeWidth="1" fill="none" opacity="0.4" />
              <path d="M 150,185 L 240,185" stroke="#4CAF50" strokeWidth="1" fill="none" opacity="0.4" />
              <path d="M 150,205 L 240,285" stroke="#4CAF50" strokeWidth="1" fill="none" opacity="0.4" />
              {/* ESP32 to Actuators */}
              <path d="M 150,215 L 60,285" stroke="#4CAF50" strokeWidth="1" fill="none" opacity="0.3" />
              <path d="M 150,215 L 150,285" stroke="#4CAF50" strokeWidth="1" fill="none" opacity="0.3" />
            </svg>

            {/* Nodes */}
            
            {/* Solar PV Node */}
            <div className="absolute top-6 left-6 flex flex-col items-center">
              <div className="w-14 h-14 rounded-lg bg-slate-900 border border-white/10 flex flex-col items-center justify-center glow-green p-1">
                <Sun className="w-5 h-5 text-amber-400" />
                <span className="text-[8px] text-emerald-400 font-bold mt-1">{activeDevice?.solarVoltage || 0}V</span>
              </div>
            </div>

            {/* Battery Node */}
            <div className="absolute top-36 left-6 flex flex-col items-center">
              <div className="w-14 h-14 rounded-lg bg-slate-900 border border-emerald-500/30 flex flex-col items-center justify-center glow-green p-1">
                <Battery className="w-5 h-5 text-emerald-400" />
                <span className="text-[8px] text-slate-300 font-bold mt-1">{activeDevice?.battery || 0}%</span>
              </div>
            </div>

            {/* ESP32 Controller Center Node */}
            <div className="absolute top-32 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
              <div className="w-20 h-20 rounded-xl bg-slate-900 border border-[#4CAF50]/30 flex flex-col items-center justify-center p-2 glow-green shadow-xl">
                <Cpu className="w-8 h-8 text-[#4CAF50]" />
                <span className="text-[8px] text-white font-bold mt-1.5">ESP32 Core</span>
              </div>
            </div>

            {/* Sensors (Right column) */}
            <div className="absolute right-6 top-6 flex flex-col gap-6">
              
              {/* PIR Node */}
              <div className={`w-20 px-2 py-1 bg-slate-900 border rounded-lg flex items-center gap-1.5 ${activeDevice?.pir ? 'border-amber-500/40 glow-yellow' : 'border-white/5'}`}>
                <Activity className={`w-4 h-4 ${activeDevice?.pir ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
                <span className="text-[8px] font-bold text-slate-300">PIR</span>
              </div>

              {/* Ultrasonic Node */}
              <div className={`w-20 px-2 py-1 bg-slate-900 border rounded-lg flex items-center gap-1.5 ${activeDevice?.ultrasonic ? 'border-amber-500/40 glow-yellow' : 'border-white/5'}`}>
                <Compass className={`w-4 h-4 ${activeDevice?.ultrasonic ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="text-[8px] font-bold text-slate-300">Sonar</span>
              </div>

              {/* Vibration Node */}
              <div className={`w-20 px-2 py-1 bg-slate-900 border rounded-lg flex items-center gap-1.5 ${activeDevice?.vibration ? 'border-amber-500/40 glow-yellow' : 'border-white/5'}`}>
                <Radio className={`w-4 h-4 ${activeDevice?.vibration ? 'text-sky-400 animate-pulse' : 'text-slate-400'}`} />
                <span className="text-[8px] font-bold text-slate-300">Seismic</span>
              </div>

            </div>

            {/* Actuators (Bottom row) */}
            <div className="absolute bottom-4 left-6 right-6 flex justify-between">
              
              {/* Buzzer */}
              <div className={`px-2.5 py-1 bg-slate-900 border rounded-lg flex items-center gap-1.5 ${activeDevice?.buzzer ? 'border-amber-500/40 glow-yellow' : 'border-white/5'}`}>
                <Volume2 className={`w-4 h-4 ${activeDevice?.buzzer ? 'text-rose-400 animate-bounce' : 'text-slate-500'}`} />
                <span className="text-[8px] font-bold text-slate-400">Buzzer</span>
              </div>

              {/* LED */}
              <div className={`px-2.5 py-1 bg-slate-900 border rounded-lg flex items-center gap-1.5 ${activeDevice?.led ? 'border-amber-500/40 glow-yellow' : 'border-white/5'}`}>
                <Lightbulb className={`w-4 h-4 ${activeDevice?.led ? 'text-yellow-400 animate-pulse' : 'text-slate-500'}`} />
                <span className="text-[8px] font-bold text-slate-400">LED</span>
              </div>

            </div>

          </div>
        </div>

        {/* ================= COLUMN 2: COMPONENT STATUS TABLE ================= */}
        <div className="glass-card rounded-3xl p-5 border border-white/5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <TableProperties className="w-4.5 h-4.5 text-[#4CAF50]" />
              Edge Registry Inventory
            </h3>
            <span className="text-[9px] bg-slate-800 border border-white/5 text-slate-400 font-bold px-2 py-0.5 rounded-full">
              {components.length} Nodes
            </span>
          </div>

          <div className="overflow-x-auto h-[380px] overflow-y-auto pr-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="pb-3 text-[10px]">Node</th>
                  <th className="pb-3 text-[10px]">Readout</th>
                  <th className="pb-3 text-center text-[10px]">Health</th>
                  <th className="pb-3 text-right text-[10px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-semibold">
                {components.map((comp) => {
                  const isHealthy = comp.health > 40;
                  const isOffline = comp.health === 0;

                  return (
                    <tr key={comp.id} className="hover:bg-slate-900/20 transition-all">
                      <td className="py-3.5 pr-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg bg-slate-900 border border-white/5 ${comp.color}`}>
                            <comp.icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-white leading-tight">{comp.name}</p>
                            <p className="text-[9px] text-slate-500 font-normal mt-0.5">{comp.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 font-mono text-[11px] text-white pr-2">{comp.value}</td>
                      <td className="py-3.5 text-center">
                        <span className={`text-[10px] font-bold ${isHealthy ? 'text-emerald-400' : isOffline ? 'text-red-500' : 'text-amber-500'}`}>
                          {comp.health}%
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isHealthy ? 'bg-emerald-500 animate-pulse' : isOffline ? 'bg-red-500' : 'bg-amber-500 animate-ping'}`} />
                          <span className={`text-[10px] uppercase font-bold ${isHealthy ? 'text-emerald-400' : isOffline ? 'text-red-400' : 'text-amber-400'}`}>
                            {comp.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= COLUMN 3: LIVE CAMERA & ALERTS ================= */}
        <div className="space-y-6">
          
          {/* Live Camera Feed Panel */}
          <div className="glass-card rounded-3xl p-5 border border-white/5 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Live Camera [Active]</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#4CAF50]" />
                {timestamp}
              </span>
            </div>

            {/* Video Box */}
            <div className="relative bg-slate-900 border border-white/5 rounded-2xl overflow-hidden h-44 flex items-center justify-center">
              
              {/* Target grid overlay */}
              <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none"></div>

              {/* Neural Network Bounding Box */}
              {detectedAnimal && (
                <div className="absolute border border-red-500 bg-red-500/10 rounded-lg p-1.5 flex flex-col justify-between" style={{ top: '15%', left: '20%', width: '55%', height: '60%' }}>
                  <div className="bg-red-600 text-[8px] font-black text-white px-1 py-0.5 rounded uppercase self-start shadow-md">
                    {detectedAnimal} ({confidence}%)
                  </div>
                  <div className="w-2 h-2 border-b-2 border-r-2 border-red-500 absolute bottom-0 right-0"></div>
                  <div className="w-2 h-2 border-t-2 border-l-2 border-red-500 absolute top-0 left-0"></div>
                </div>
              )}

              {/* Scanning lines */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none h-4 animate-scan"></div>

              {/* Camera Stream frame */}
              <img 
                src={cameraImage} 
                alt="Live stream feed" 
                className="w-full h-full object-cover"
              />

            </div>
          </div>

          {/* Real-time Alerts Feed panel */}
          <div className="glass-card rounded-3xl p-5 border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-red-500" />
              Active System Alerts
            </h3>
            
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <div className="text-center py-6 text-[10px] text-slate-500">
                  No critical faults detected in sector.
                </div>
              ) : (
                alerts.slice(0, 3).map((alert) => (
                  <div 
                    key={alert._id} 
                    className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${alert.status === 'UNREAD' ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-900/50 border-white/5'}`}
                  >
                    <div className="space-y-1">
                      <p className="font-bold text-white text-[11px]">{alert.message}</p>
                      <span className="text-[9px] text-slate-500 block">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                    </div>
                    {alert.status === 'UNREAD' && (
                      <button 
                        onClick={() => markAlertRead(alert._id)}
                        className="text-[9px] bg-red-500/20 hover:bg-red-500/30 text-white px-2 py-0.5 rounded font-bold cursor-pointer transition-all"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default DeviceMonitor;
