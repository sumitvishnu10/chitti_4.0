import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  LabelList
} from 'recharts';
import { Calendar, ChevronDown, Download, Clock, BarChart2 } from 'lucide-react';

export const Analytics = () => {
  const todayData = [
    { time: '00:00', value: 120 },
    { time: '04:00', value: 300 },
    { time: '08:00', value: 450 },
    { time: '12:00', value: 200 },
    { time: '16:00', value: 400 },
    { time: '20:00', value: 650 },
    { time: '24:00', value: 180 },
  ];

  const weekData = [
    { day: 'Mon', value: 300 },
    { day: 'Tues', value: 450 },
    { day: 'Wed', value: 200 },
    { day: 'Thurs', value: 400 },
    { day: 'Fri', value: 650 },
    { day: 'Sat', value: 350 },
    { day: 'Sun', value: 250 },
  ];

  return (
    <div className="space-y-6 pb-8 text-slate-900 dark:text-white bg-[#FAFAFA] dark:bg-transparent min-h-full">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Analytics</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and visualize animal intrusion detection trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm text-slate-700 dark:text-slate-300">
            <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            07 May 2025
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm text-slate-700 dark:text-slate-300">
            Today
            <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] dark:bg-emerald-600 hover:bg-[#1B5E20] dark:hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* TIMELY DETECTION CHART */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#E8F5E9] dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#2E7D32] dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-[#2E7D32] dark:text-emerald-400 text-sm uppercase tracking-wide">TIMELY DETECTION (Today)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Number of intrusions detected at different times of the day</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">
            Today
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={todayData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#475569" strokeOpacity={0.2} />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                dy={15} 
              />
              <YAxis 
                domain={[0, 700]} 
                ticks={[0, 100, 200, 300, 400, 500, 600, 700]}
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                dx={-10}
                label={{ value: 'Detections', angle: -90, position: 'insideLeft', offset: 10, style: { textAnchor: 'middle', fontWeight: 'bold', fontSize: 13, fill: '#94a3b8' } }}
              />
              <text x="50%" y="290" textAnchor="middle" style={{ fontWeight: 'bold', fontSize: 13, fill: '#94a3b8' }}>
                Time of Day
              </text>
              <Line 
                type="linear" 
                dataKey="value" 
                stroke="#dc2626" 
                strokeWidth={2} 
                dot={{ r: 4, fill: '#dc2626', strokeWidth: 0 }}
                isAnimationActive={false}
              >
                <LabelList dataKey="value" position="top" offset={10} fill="#ef4444" fontSize={12} fontWeight="bold" />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DAILY DETECTION CHART */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#E8F5E9] dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-[#2E7D32] dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-[#2E7D32] dark:text-emerald-400 text-sm uppercase tracking-wide">DAILY DETECTION (This Week)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total intrusions detected each day</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">
            This Week
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#475569" strokeOpacity={0.2} />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                dy={15} 
              />
              <YAxis 
                domain={[0, 700]} 
                ticks={[0, 100, 200, 300, 400, 500, 600, 700]}
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                dx={-10}
                label={{ value: 'Detections', angle: -90, position: 'insideLeft', offset: 10, style: { textAnchor: 'middle', fontWeight: 'bold', fontSize: 13, fill: '#94a3b8' } }}
              />
              <text x="50%" y="290" textAnchor="middle" style={{ fontWeight: 'bold', fontSize: 13, fill: '#94a3b8' }}>
                Day
              </text>
              <Line 
                type="linear" 
                dataKey="value" 
                stroke="#dc2626" 
                strokeWidth={2} 
                dot={{ r: 4, fill: '#dc2626', strokeWidth: 0 }}
                isAnimationActive={false}
              >
                <LabelList dataKey="value" position="top" offset={10} fill="#ef4444" fontSize={12} fontWeight="bold" />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Banner */}
      <div className="bg-[#F1F8F1] dark:bg-emerald-900/10 border border-[#C8E6C9] dark:border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#C8E6C9] dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
          <BarChart2 className="w-5 h-5 text-[#2E7D32] dark:text-emerald-400" />
        </div>
        <p className="text-sm text-slate-800 dark:text-slate-200">
          <span className="font-bold text-[#2E7D32] dark:text-emerald-400">Insights:</span> Highest intrusions detected on Friday (650). Stay alert during evening hours (16:00 - 20:00).
        </p>
      </div>

    </div>
  );
};

export default Analytics;
