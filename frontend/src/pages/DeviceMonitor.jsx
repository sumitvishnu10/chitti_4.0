import React from 'react';
import { motion } from 'framer-motion';
import { useIoT } from '../context/IoTContext';
import { 
  Sun, 
  Cpu, 
  Battery, 
  Activity, 
  Compass, 
  Volume2, 
  Lightbulb, 
  Radio, 
  Wifi,
  Server,
  Activity as ActivityIcon
} from 'lucide-react';

export const DeviceMonitor = () => {
  const { activeDevice, mqttStatus, dbStatus } = useIoT();

  const components = [
    { id: 'pv', name: 'Solar PV Panel', type: 'Power Input', value: `${activeDevice?.solarVoltage || 0} V`, status: 'Charging', health: 98, icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { id: 'bms', name: 'Lithium Battery Stack', type: 'Power Output', value: `${activeDevice?.battery || 0}%`, status: (activeDevice?.battery || 0) > 20 ? 'Healthy' : 'Low', health: activeDevice?.battery || 0, icon: Battery, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { id: 'esp', name: 'Control Unit', type: 'Core CPU', value: activeDevice?.camera ? 'Streaming' : 'Offline', status: activeDevice?.camera ? 'Online' : 'Offline', health: activeDevice?.camera ? 100 : 0, icon: Cpu, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { id: 'pir', name: 'Motion Sensor', type: 'Sensor Input', value: activeDevice?.pir ? 'Motion' : 'Static', status: activeDevice?.pir ? 'Active' : 'Scanning', health: 96, icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { id: 'sonar', name: 'Proximity Sensor', type: 'Sensor Input', value: activeDevice?.ultrasonic ? 'Alert' : 'Clear', status: activeDevice?.ultrasonic ? 'Active' : 'Scanning', health: 95, icon: Compass, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
    { id: 'vib', name: 'Vibration Sensor', type: 'Sensor Input', value: activeDevice?.vibration ? 'Seismic' : 'Stable', status: activeDevice?.vibration ? 'Active' : 'Scanning', health: 97, icon: Radio, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-500/10' },
    { id: 'buzzer', name: 'Acoustic Deterrent', type: 'Actuator', value: activeDevice?.buzzer ? 'Active' : 'Muted', status: activeDevice?.buzzer ? 'Fired' : 'Standby', health: 100, icon: Volume2, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
    { id: 'led', name: 'Strobe Deterrent', type: 'Actuator', value: activeDevice?.led ? 'Active' : 'Off', status: activeDevice?.led ? 'Fired' : 'Standby', health: 100, icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10' },
  ];

  const networkMetrics = [
    { label: 'Database', status: dbStatus, icon: Server, color: dbStatus === 'Connected' ? 'text-emerald-500' : 'text-red-500' },
    { label: 'System Uptime', status: '99.9%', icon: ActivityIcon, color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Device Monitor</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time diagnostics and component health status.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full">
           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
           <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Device Online</span>
        </div>
      </div>

      {/* Network Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {networkMetrics.map((metric, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-white/5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 ${metric.color}`}>
                <metric.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{metric.label}</p>
                <p className={`text-sm font-bold mt-0.5 ${metric.color}`}>{metric.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Component Status Grid */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Hardware Components</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {components.map((comp, idx) => {
            const isHealthy = comp.health > 40;
            const isOffline = comp.health === 0;

            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={comp.id} 
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl ${comp.bg} ${comp.color}`}>
                    <comp.icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isHealthy ? 'bg-emerald-500' : isOffline ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isHealthy ? 'text-emerald-600 dark:text-emerald-400' : isOffline ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {comp.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{comp.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{comp.type}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div>
                     <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Readout</p>
                     <p className="text-sm font-mono font-medium text-slate-700 dark:text-slate-300 mt-0.5">{comp.value}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Health</p>
                     <p className={`text-sm font-bold mt-0.5 ${isHealthy ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                       {comp.health}%
                     </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default DeviceMonitor;
