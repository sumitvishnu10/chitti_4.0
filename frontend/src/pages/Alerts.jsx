import React, { useState } from 'react';
import { useIoT } from '../context/IoTContext';
import { 
  Bell, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Trash2, 
  Filter, 
  AlertOctagon,
  Clock
} from 'lucide-react';

export const Alerts = () => {
  const { alerts, markAlertRead } = useIoT();
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter alerts based on selection
  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = severityFilter === 'ALL' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || 
                          (statusFilter === 'UNREAD' && alert.status === 'UNREAD') ||
                          (statusFilter === 'READ' && alert.status === 'READ');
    return matchesSeverity && matchesStatus;
  });

  const getAlertIcon = (type, severity) => {
    if (severity === 'HIGH') {
      return (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <AlertOctagon className="w-6 h-6 animate-pulse" />
        </div>
      );
    }
    return (
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
        <AlertTriangle className="w-6 h-6" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-wide">Alarms & Notifications Ticker</h2>
        <p className="text-xs text-slate-400 font-semibold tracking-wide">Intrusion signals and sensor health notifications</p>
      </div>

      {/* Filters Toolbar */}
      <div className="glass-card rounded-2xl p-4.5 border border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-lg">
        
        {/* Severity filter */}
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-slate-400 font-medium whitespace-nowrap">Severity:</span>
          <div className="flex gap-1.5 overflow-x-auto">
            {['ALL', 'HIGH', 'MEDIUM'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${severityFilter === sev ? 'bg-[#2E7D32] border-[#4CAF50]/30 text-white' : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'}`}
              >
                {sev === 'ALL' ? 'All Alerts' : `${sev} Severity`}
              </button>
            ))}
          </div>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2.5 text-xs w-full sm:w-auto">
          <span className="text-slate-400 font-medium">Resolution Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-white/5 focus:border-[#4CAF50]/30 rounded-xl text-white outline-none focus:ring-1 focus:ring-[#4CAF50]/30 transition-all cursor-pointer"
          >
            <option value="ALL">Show All</option>
            <option value="UNREAD">Unresolved</option>
            <option value="READ">Resolved</option>
          </select>
        </div>

      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="glass-card rounded-3xl p-10 border border-white/5 text-center text-slate-500 text-sm">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <span>No warnings detected in this log query. All sectors cleared.</span>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div 
              key={alert._id} 
              className={`glass-card rounded-3xl p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:bg-slate-900/10 ${alert.status === 'UNREAD' ? 'border-red-500/25 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.03)]' : 'border-white/5'}`}
            >
              
              <div className="flex items-center gap-4">
                {getAlertIcon(alert.type, alert.severity)}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${alert.severity === 'HIGH' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'}`}>
                      {alert.severity} Severity
                    </span>
                    <span className="font-mono text-slate-500 text-[10px]">{alert.deviceId}</span>
                  </div>
                  <p className={`text-sm ${alert.status === 'UNREAD' ? 'font-bold text-white' : 'text-slate-300'}`}>
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold">
                    <Clock className="w-3.5 h-3.5 text-[#4CAF50]" />
                    <span>{new Date(alert.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {alert.status === 'UNREAD' && (
                <button
                  onClick={() => markAlertRead(alert._id)}
                  className="px-4 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Mark Resolved</span>
                </button>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default Alerts;
