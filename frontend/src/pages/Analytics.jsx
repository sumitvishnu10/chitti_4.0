import React from 'react';
import { useIoT } from '../context/IoTContext';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  BarChart2, 
  TrendingUp, 
  PieChart as PieIcon, 
  Calendar,
  Layers
} from 'lucide-react';

export const Analytics = () => {
  const { sensorHistory, events, alerts } = useIoT();

  // 1. Telemetry Trends (Line/Area charts)
  const trendData = sensorHistory.map(h => ({
    time: new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: h.temperature,
    humidity: h.humidity,
    battery: h.battery
  })).reverse();

  // 2. Wildlife Detection Counts (Bar chart)
  const wildlifeData = [
    { name: 'Wild Boar', count: 18, color: '#EF4444' },
    { name: 'Elephant', count: 14, color: '#F59E0B' },
    { name: 'Deer', count: 8, color: '#3B82F6' },
    { name: 'Birds/Others', count: 5, color: '#4CAF50' }
  ];

  // 3. Sensor Usage shares (Pie chart)
  const sensorShares = [
    { name: 'PIR Sensor', value: 24, color: '#4CAF50' },
    { name: 'Ultrasonic', value: 12, color: '#3B82F6' },
    { name: 'Vibration', value: 6, color: '#FFC107' }
  ];

  // 4. Alert Severity shares
  const alertSeverityData = [
    { name: 'HIGH Severity', count: 6, fill: '#EF4444' },
    { name: 'MEDIUM Severity', count: 7, fill: '#F59E0B' },
    { name: 'LOW Severity', count: 2, fill: '#3B82F6' }
  ];

  // 5. System performance trend
  const performanceData = [
    { day: 'Mon', uptime: 99.8, latency: 24 },
    { day: 'Tue', uptime: 99.9, latency: 20 },
    { day: 'Wed', uptime: 99.7, latency: 28 },
    { day: 'Thu', uptime: 99.8, latency: 22 },
    { day: 'Fri', uptime: 99.9, latency: 18 },
    { day: 'Sat', uptime: 100.0, latency: 15 },
    { day: 'Sun', uptime: 99.8, latency: 19 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 rounded-xl border border-white/10 text-xs font-mono">
          <p className="font-bold text-white mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color || p.fill }}>
              {p.name}: <strong className="text-white">{p.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-wide">IoT Analytics Suite</h2>
        <p className="text-xs text-slate-400 font-semibold tracking-wide">Historical analytics and telemetry graph trends</p>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Temp & Humidity Trends */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4 shadow-lg">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2.5">
            <TrendingUp className="w-4.5 h-4.5 text-[#4CAF50]" />
            Atmospheric Trends (Temperature & Humidity)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                <Area type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#EF4444" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={2} />
                <Area type="monotone" dataKey="humidity" name="Humidity (% RH)" stroke="#3B82F6" fillOpacity={1} fill="url(#colorHum)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Battery Discharge Trend */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4 shadow-lg">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2.5">
            <TrendingUp className="w-4.5 h-4.5 text-[#4CAF50]" />
            Solar Battery Level Discharge Curve
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                <Line type="monotone" dataKey="battery" name="Battery Level (%)" stroke="#4CAF50" strokeWidth={2.5} dot={{ fill: '#4CAF50', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Wildlife Intrusion Counts */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4 shadow-lg">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2.5">
            <BarChart2 className="w-4.5 h-4.5 text-[#4CAF50]" />
            Wildlife intruder Classification Counts
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wildlifeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Detections" radius={[8, 8, 0, 0]}>
                  {wildlifeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Sensor Trigger Shares */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4 shadow-lg">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2.5">
            <PieIcon className="w-4.5 h-4.5 text-[#4CAF50]" />
            Sensor Activation Usage Shares
          </h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sensorShares}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sensorShares.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Alert Severity Distributions */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4 shadow-lg">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2.5">
            <BarChart2 className="w-4.5 h-4.5 text-[#4CAF50]" />
            Alert Severity Class Log Counts
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertSeverityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis type="number" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Alert Count" radius={[0, 6, 6, 0]}>
                  {alertSeverityData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. System Performance latency */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4 shadow-lg">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2.5">
            <TrendingUp className="w-4.5 h-4.5 text-[#4CAF50]" />
            Broker Gateway Latency Index
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                <Area type="monotone" dataKey="latency" name="Broker Latency (ms)" stroke="#4CAF50" fillOpacity={1} fill="url(#colorLatency)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Analytics;
