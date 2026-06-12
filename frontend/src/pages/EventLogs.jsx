import React, { useState } from 'react';
import { useIoT } from '../context/IoTContext';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Download, 
  Calendar, 
  Clock, 
  Eye, 
  AlertTriangle,
  PlayCircle
} from 'lucide-react';

export const EventLogs = () => {
  const { events } = useIoT();
  
  // Table states
  const [search, setSearch] = useState('');
  const [sensorFilter, setSensorFilter] = useState('All');
  const [sortField, setSortField] = useState('timestamp');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'timeline'
  const itemsPerPage = 8;

  // Filter logs
  const filteredEvents = events.filter(evt => {
    const matchesSearch = evt.sensor.toLowerCase().includes(search.toLowerCase()) || 
                          evt.deterrent.toLowerCase().includes(search.toLowerCase()) ||
                          evt.deviceId.toLowerCase().includes(search.toLowerCase());
    const matchesSensor = sensorFilter === 'All' || evt.sensor === sensorFilter;
    return matchesSearch && matchesSensor;
  });

  // Sort logs
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortField === 'timestamp') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  // Paginate logs
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedEvents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // CSV Exporter
  const exportCSV = () => {
    const headers = ['Timestamp', 'Device ID', 'Sensor', 'Deterrent Triggered', 'Status'];
    const rows = sortedEvents.map(evt => [
      new Date(evt.timestamp).toLocaleString(),
      evt.deviceId,
      evt.sensor,
      evt.deterrent,
      evt.status
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CHITTI_EventLogs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-wide">Threat & Deterrence Logs</h2>
          <p className="text-xs text-slate-400 font-semibold tracking-wide">Historical records of sensor activations and scaring deterrents</p>
        </div>
        
        {/* Toggle View & Export Actions */}
        <div className="flex items-center gap-2">
          <div className="bg-[#111827] border border-white/5 p-1 rounded-xl flex gap-1 text-xs">
            <button 
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${viewMode === 'table' ? 'bg-[#2E7D32] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Spreadsheet View
            </button>
            <button 
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${viewMode === 'timeline' ? 'bg-[#2E7D32] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Timeline View
            </button>
          </div>
          <button 
            onClick={exportCSV}
            className="p-2.5 bg-slate-900 border border-white/5 hover:border-[#4CAF50]/30 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-card rounded-2xl p-4 border border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search logs..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-white/5 focus:border-[#4CAF50]/30 rounded-xl focus:outline-none text-xs text-white placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap">Sensor Filter:</span>
          <select
            value={sensorFilter}
            onChange={(e) => { setSensorFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-slate-900 border border-white/5 focus:border-[#4CAF50]/30 rounded-xl text-white outline-none focus:ring-1 focus:ring-[#4CAF50]/30 transition-all cursor-pointer"
          >
            <option value="All">All Sensors</option>
            <option value="PIR">PIR (Thermal)</option>
            <option value="Ultrasonic">Ultrasonic (Proximity)</option>
            <option value="Vibration">Vibration (Seismic)</option>
          </select>
        </div>
      </div>

      {/* Spreadsheet / Table Mode */}
      {viewMode === 'table' ? (
        <div className="glass-card rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('timestamp')}>
                    <div className="flex items-center gap-1.5">Timestamp <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="p-4">Device ID</th>
                  <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('sensor')}>
                    <div className="flex items-center gap-1.5">Activated Sensor <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="p-4">Deterrent Triggered</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">No logs found matching specified criteria.</td>
                  </tr>
                ) : (
                  currentItems.map((evt) => (
                    <tr key={evt._id} className="hover:bg-slate-900/30 transition-all">
                      <td className="p-4 font-mono">{new Date(evt.timestamp).toLocaleString()}</td>
                      <td className="p-4 font-mono">{evt.deviceId}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-slate-900 border border-white/5 rounded-lg text-white font-bold">
                          {evt.sensor}
                        </span>
                      </td>
                      <td className="p-4 flex items-center gap-2">
                        <PlayCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{evt.deterrent}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase">
                          {evt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-slate-950/20 text-xs">
              <span className="text-slate-500">Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedEvents.length)} of {sortedEvents.length} events</span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 rounded-xl border border-white/5 hover:border-white/10 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-3 py-1.5 rounded-xl border border-white/5 hover:border-white/10 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Timeline View Mode */
        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-8 relative overflow-hidden shadow-2xl">
          <div className="relative pl-6 border-l border-white/10 space-y-8">
            {sortedEvents.slice(0, 10).map((evt, idx) => (
              <div key={evt._id} className="relative group">
                
                {/* Timeline connector circle */}
                <span className="absolute -left-[30px] top-1.5 w-4.5 h-4.5 rounded-full bg-slate-900 border-2 border-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </span>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(evt.timestamp).toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-900 border border-white/5 rounded-lg text-slate-300 font-mono text-[10px]">
                      {evt.deviceId}
                    </span>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-[#4CAF50]/30 transition-all max-w-xl space-y-3">
                    <p className="text-sm font-bold text-white">Intrusion Alert detected via {evt.sensor} Sensor</p>
                    <p className="text-xs text-slate-400">Deterrence response triggered: <strong className="text-white font-semibold">{evt.deterrent}</strong></p>
                    
                    {evt.imageUrl && (
                      <div className="mt-2.5 max-w-xs rounded-lg overflow-hidden border border-white/5">
                        <img src={evt.imageUrl} alt="wildlife" className="w-full h-32 object-cover" />
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default EventLogs;
