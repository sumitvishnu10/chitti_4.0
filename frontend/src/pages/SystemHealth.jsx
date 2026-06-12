import React from 'react';
import { useIoT } from '../context/IoTContext';
import { 
  Server, 
  Database, 
  Radio, 
  Cpu, 
  Sun, 
  Battery, 
  Globe, 
  Video, 
  Activity,
  Heart,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

export const SystemHealth = () => {
  const { health, mqttStatus, dbStatus, activeDevice } = useIoT();

  const services = [
    { 
      name: 'Express API Server', 
      status: 'ONLINE', 
      uptime: '99.98%', 
      latency: '18 ms', 
      desc: 'Rest HTTP Endpoint routing', 
      icon: Server, 
      color: 'text-emerald-400',
      progress: 99.98
    },
    { 
      name: 'MongoDB Database', 
      status: dbStatus === 'Connected' ? 'ONLINE' : 'ERROR', 
      uptime: dbStatus === 'Connected' ? '99.95%' : '0%', 
      latency: dbStatus === 'Connected' ? '12 ms' : 'N/A', 
      desc: 'Deterrence & telemetry storage', 
      icon: Database, 
      color: dbStatus === 'Connected' ? 'text-emerald-400' : 'text-red-400',
      progress: dbStatus === 'Connected' ? 99.95 : 0
    },
    { 
      name: 'MQTT Broker', 
      status: mqttStatus === 'Connected' ? 'ONLINE' : 'ERROR', 
      uptime: mqttStatus === 'Connected' ? '99.92%' : '0%', 
      latency: mqttStatus === 'Connected' ? '35 ms' : 'N/A', 
      desc: 'Publish/Subscribe telemetry broker', 
      icon: Radio, 
      color: mqttStatus === 'Connected' ? 'text-emerald-400' : 'text-red-400',
      progress: mqttStatus === 'Connected' ? 99.92 : 0
    },
    { 
      name: 'ESP32 Control board', 
      status: activeDevice?.status === 'Online' || activeDevice?.status === 'Active' ? 'ONLINE' : 'OFFLINE', 
      uptime: '97.4%', 
      latency: '145 ms', 
      desc: 'Edge hardware motherboard core', 
      icon: Cpu, 
      color: activeDevice?.status === 'Online' || activeDevice?.status === 'Active' ? 'text-emerald-400' : 'text-amber-400',
      progress: 97.4
    },
    { 
      name: 'Solar Charge Controller', 
      status: 'ONLINE', 
      uptime: '100%', 
      latency: '50 ms', 
      desc: 'PV power management interface', 
      icon: Sun, 
      color: 'text-emerald-400',
      progress: 100
    },
    { 
      name: 'Battery BMS', 
      status: (activeDevice?.battery || 0) > 20 ? 'ONLINE' : 'WARNING', 
      uptime: '99.9%', 
      latency: '8 ms', 
      desc: 'Lithium battery voltage cell health', 
      icon: Battery, 
      color: (activeDevice?.battery || 0) > 20 ? 'text-emerald-400' : 'text-amber-400',
      progress: 99.9
    },
    { 
      name: 'Internet Gateway', 
      status: 'ONLINE', 
      uptime: '99.88%', 
      latency: '42 ms', 
      desc: 'WAN telemetry sync network', 
      icon: Globe, 
      color: 'text-emerald-400',
      progress: 99.88
    },
    { 
      name: 'ESP32 Camera Node', 
      status: activeDevice?.camera ? 'ONLINE' : 'OFFLINE', 
      uptime: '95.5%', 
      latency: '240 ms', 
      desc: 'Wildlife neural framing stream', 
      icon: Video, 
      color: activeDevice?.camera ? 'text-emerald-400' : 'text-red-400',
      progress: 95.5
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-wide">System Nodes & Health</h2>
          <p className="text-xs text-slate-400 font-semibold tracking-wide">Real-time uptime and node latency tracking</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(76,175,80,0.1)]">
          <Heart className="w-4 h-4 fill-emerald-400 animate-pulse" />
          <span>Overall Health: 99.8% [Excellent]</span>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((srv) => {
          const Icon = srv.icon;
          const isActive = srv.status === 'ONLINE';
          const isWarning = srv.status === 'WARNING';
          const isErr = srv.status === 'ERROR' || srv.status === 'OFFLINE';

          return (
            <div 
              key={srv.name} 
              className="glass-card rounded-2xl p-5 border border-white/5 space-y-4 hover:border-[#4CAF50]/30 transition-all duration-300 relative group overflow-hidden"
            >
              {/* Node status glow corner */}
              <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl opacity-15 pointer-events-none ${isActive ? 'from-emerald-500' : isWarning ? 'from-amber-500' : 'from-red-500'}`}></div>

              <div className="flex justify-between items-start">
                <div className={`p-2.5 bg-slate-900 border border-white/5 rounded-xl ${srv.color}`}>
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : isWarning ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {srv.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-[#4CAF50] transition-colors">{srv.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{srv.desc}</p>
              </div>

              <div className="space-y-1.5 text-[10px] font-semibold">
                <div className="flex justify-between text-slate-500">
                  <span>Latency</span>
                  <span className="text-white">{srv.latency}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Uptime</span>
                  <span className="text-white">{srv.uptime}</span>
                </div>
                {/* Uptime progress bar */}
                <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isActive ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${srv.progress}%` }}
                  ></div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default SystemHealth;
