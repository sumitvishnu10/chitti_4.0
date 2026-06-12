import React from 'react';
import { useIoT } from '../context/IoTContext';
import { 
  Thermometer, 
  Droplets, 
  Battery, 
  Sun, 
  Activity, 
  Compass, 
  Zap, 
  Video,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export const SensorMonitoring = () => {
  const { activeDevice } = useIoT();

  const mockGauge = (val, max, colorClass, unit) => {
    const percentage = Math.min(100, Math.max(0, (val / max) * 100));
    const radius = 50;
    const strokeDashoffset = 314 - (314 * percentage) / 100;

    return (
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="64" cy="64" r={radius} className="stroke-slate-800" strokeWidth="8" fill="transparent" />
          <motion.circle 
            cx="64" cy="64" r={radius} 
            className={colorClass} 
            strokeWidth="8" 
            fill="transparent" 
            strokeDasharray="314"
            initial={{ strokeDashoffset: 314 }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-lg font-mono font-extrabold text-white">{val}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{unit}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-wide">Sensor Telemetry Monitor</h2>
        <p className="text-xs text-slate-400 font-semibold tracking-wide">Granular telemetry feeds from active CHITTI field sensors</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Temperature Gauge */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-between shadow-lg">
          <div className="flex items-center justify-between w-full border-b border-white/5 pb-3">
            <span className="text-xs font-bold text-slate-300">Ambient Temperature</span>
            <Thermometer className="w-5 h-5 text-red-400" />
          </div>
          <div className="my-6">
            {mockGauge(activeDevice?.temperature || 28.5, 50, 'stroke-red-500', '°C')}
          </div>
          <div className="text-center text-slate-400 text-xs">
            <p className="font-semibold text-white">Status: Normal Range</p>
            <p className="text-[10px] mt-1">Acceptable limit: 10°C to 45°C</p>
          </div>
        </div>

        {/* Humidity Gauge */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-between shadow-lg">
          <div className="flex items-center justify-between w-full border-b border-white/5 pb-3">
            <span className="text-xs font-bold text-slate-300">Ambient Humidity</span>
            <Droplets className="w-5 h-5 text-blue-400" />
          </div>
          <div className="my-6">
            {mockGauge(activeDevice?.humidity || 62.1, 100, 'stroke-blue-500', '% RH')}
          </div>
          <div className="text-center text-slate-400 text-xs">
            <p className="font-semibold text-white">Status: Optimal Soil moisture</p>
            <p className="text-[10px] mt-1">Acceptable limit: 20% to 90%</p>
          </div>
        </div>

        {/* Solar Panel & Battery Stack */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6 shadow-lg">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs font-bold text-slate-300">Solar Energy Stack</span>
            <Sun className="w-5 h-5 text-amber-400" />
          </div>
          
          <div className="space-y-4 text-xs">
            
            {/* Solar Panel Voltage */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-400">Solar Output Voltage</span>
                <span className="font-bold text-white">{activeDevice?.solarVoltage || 0} V</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${((activeDevice?.solarVoltage || 0) / 12) * 100}%` }}></div>
              </div>
            </div>

            {/* Current draw */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-400">Current Load Draw</span>
                <span className="font-bold text-white">125 mA</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-[#4CAF50] rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            {/* Battery state */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-400">Battery Status</span>
                <span className="font-bold text-white">{activeDevice?.battery || 0}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-emerald-400">{(activeDevice?.battery || 0) > 20 ? 'OPERATIONAL' : 'CRITICAL'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Motion & Proximity Card */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6 shadow-lg">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs font-bold text-slate-300">Intruder Detectors</span>
            <Activity className="w-5 h-5 text-[#4CAF50]" />
          </div>

          <div className="space-y-4">
            
            {/* PIR */}
            <div className="flex items-center justify-between p-3.5 bg-slate-900/40 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${activeDevice?.pir ? 'bg-amber-500 animate-ping' : 'bg-slate-700'}`} />
                <span className="text-xs font-bold text-slate-200">PIR Thermal Sensor</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">{activeDevice?.pir ? 'MOTION TRIGGERED' : 'QUIET'}</span>
            </div>

            {/* Ultrasonic */}
            <div className="flex items-center justify-between p-3.5 bg-slate-900/40 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${activeDevice?.ultrasonic ? 'bg-amber-500 animate-ping' : 'bg-slate-700'}`} />
                <span className="text-xs font-bold text-slate-200">Ultrasonic Proximity</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">{activeDevice?.ultrasonic ? 'INTRUSION DETECTED' : 'CLEAR'}</span>
            </div>

            {/* Vibration */}
            <div className="flex items-center justify-between p-3.5 bg-slate-900/40 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${activeDevice?.vibration ? 'bg-amber-500 animate-ping' : 'bg-slate-700'}`} />
                <span className="text-xs font-bold text-slate-200">Soil Seismic Sensor</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">{activeDevice?.vibration ? 'VIBRATING' : 'STABILIZED'}</span>
            </div>

          </div>
        </div>

        {/* Camera stream monitor */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4 shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs font-bold text-slate-300">ESP32 Camera Stream Node</span>
            <Video className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
            <div className="space-y-3">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Stream Status</span>
                <span className="text-emerald-400 font-bold">ONLINE</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Capture Resolution</span>
                <span className="text-white font-mono">1024x768 px</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">FPS / Compression</span>
                <span className="text-white font-mono">15 fps / JPEG</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-slate-400">Camera Lens status</span>
                <span className="text-emerald-400 font-bold">CLEAN</span>
              </div>
            </div>
            
            <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 flex flex-col justify-center gap-2 text-slate-400">
              <p className="text-[10px] uppercase font-bold text-white flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Network Telemetry Specs
              </p>
              <p className="text-[11px] leading-relaxed">
                The ESP32-CAM module operates on local Wi-Fi, streaming high-definition wildlife detection frames directly to the local broker. Image buffers are parsed by the edge server.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SensorMonitoring;
