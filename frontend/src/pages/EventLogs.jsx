import React, { useState, useEffect } from 'react';
import { useIoT } from '../context/IoTContext';
import { 
  Search, 
  ArrowUpDown, 
  Download, 
  Clock, 
  Eye, 
  Camera,
  X
} from 'lucide-react';

const ImageWithFallback = ({ src, alt, className, style, onClick }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (error || !src) {
    return (
      <div 
        onClick={onClick} 
        className={`${className} bg-slate-800/90 flex flex-col items-center justify-center text-slate-400 p-1.5 gap-1 border border-slate-700/50 cursor-pointer`}
        style={style}
      >
        <Camera className="w-4 h-4 text-emerald-500 opacity-80" />
        <span className="text-[9px] font-bold tracking-wider uppercase text-slate-300">Snapshot</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      style={style}
      onClick={onClick} 
      onError={() => setError(true)} 
    />
  );
};

export const EventLogs = () => {
  const { detections, events, getImageUrl } = useIoT();
  
  // Modal State for Image Lightbox
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Table states
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('All');
  const [sortField, setSortField] = useState('timestamp');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'timeline'
  const itemsPerPage = 8;

  // Primary list: use detections array if available, fallback to events
  const dataList = detections.length > 0 ? detections : events;

  // Filter logs
  const filteredItems = dataList.filter(item => {
    const animalName = item.animal || item.sensor || '';
    const cameraName = item.camera || item.deviceId || '';
    const matchesSearch = animalName.toLowerCase().includes(search.toLowerCase()) || 
                          cameraName.toLowerCase().includes(search.toLowerCase());
    const matchesSpecies = speciesFilter === 'All' || animalName.toLowerCase() === speciesFilter.toLowerCase();
    return matchesSearch && matchesSpecies;
  });

  // Sort logs
  const sortedItems = [...filteredItems].sort((a, b) => {
    let aVal = a[sortField] || a.timestamp || a.createdAt;
    let bVal = b[sortField] || b.timestamp || b.createdAt;
    
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
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

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
    const headers = ['Timestamp', 'Animal / Event', 'Confidence (%)', 'Camera', 'Image URL'];
    const rows = sortedItems.map(item => [
      new Date(item.timestamp || item.createdAt).toLocaleString(),
      item.animal || item.sensor || 'Detection',
      item.confidence ? Number(item.confidence).toFixed(2) : 'N/A',
      item.camera || item.deviceId || 'Laptop Webcam',
      getImageUrl(item.image || item.imageUrl)
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CHITTI_DetectionLogs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Lightbox Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl p-4" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-all cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <ImageWithFallback src={selectedImage.url} alt={selectedImage.title} className="w-full h-full object-contain" />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 px-2 text-white">
              <div>
                <h4 className="text-xl font-bold capitalize">{selectedImage.title} Detection Snapshot</h4>
                <p className="text-xs text-slate-400">Camera: {selectedImage.camera} • Confidence: {selectedImage.confidence}%</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-semibold">{new Date(selectedImage.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-wide">Detection History Logs</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide">Historical records of AI wildlife and human intrusion detections</p>
        </div>
        
        {/* Toggle View & Export Actions */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-white/5 p-1 rounded-xl flex gap-1 text-xs shadow-sm">
            <button 
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${viewMode === 'table' ? 'bg-[#2E7D32] text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Spreadsheet View
            </button>
            <button 
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${viewMode === 'timeline' ? 'bg-[#2E7D32] text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Timeline View
            </button>
          </div>
          <button 
            onClick={exportCSV}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-[#4CAF50]/30 text-slate-900 dark:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search animal or camera..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 focus:border-[#4CAF50]/50 dark:focus:border-[#4CAF50]/30 rounded-xl focus:outline-none text-xs text-slate-900 dark:text-white placeholder-slate-500 shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">Filter Species:</span>
          <select
            value={speciesFilter}
            onChange={(e) => { setSpeciesFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 focus:border-[#4CAF50]/50 dark:focus:border-[#4CAF50]/30 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-[#4CAF50]/30 transition-all cursor-pointer shadow-inner"
          >
            <option value="All">All Species</option>
            <option value="person">Person / Human</option>
            <option value="dog">Dog</option>
            <option value="cow">Cow</option>
            <option value="elephant">Elephant</option>
          </select>
        </div>
      </div>

      {/* Spreadsheet / Table Mode */}
      {viewMode === 'table' ? (
        <div className="glass-card rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-md dark:shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Thumbnail</th>
                  <th className="p-4 cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => handleSort('animal')}>
                    <div className="flex items-center gap-1.5">Detected Object <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="p-4">Confidence</th>
                  <th className="p-4 cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => handleSort('timestamp')}>
                    <div className="flex items-center gap-1.5">Timestamp <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="p-4">Camera Source</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300 font-medium bg-white dark:bg-transparent">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">No detection logs found matching specified criteria.</td>
                  </tr>
                ) : (
                  currentItems.map((evt) => {
                    const imgUrl = getImageUrl(evt.image || evt.imageUrl);
                    const animalName = evt.animal || evt.sensor || 'Detection';
                    const confidenceVal = evt.confidence ? Number(evt.confidence).toFixed(2) : '95.00';
                    const cameraSource = evt.camera || evt.deviceId || 'Laptop Webcam';
                    const timestampStr = evt.timestamp || evt.createdAt || new Date().toISOString();

                    return (
                      <tr key={evt._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-all">
                        <td className="p-3">
                          <ImageWithFallback 
                            src={imgUrl} 
                            alt={animalName} 
                            onClick={() => setSelectedImage({ url: imgUrl, title: animalName, confidence: confidenceVal, camera: cameraSource, timestamp: timestampStr })}
                            className="w-14 h-10 rounded-lg object-cover border border-slate-200 dark:border-white/10 cursor-pointer hover:scale-105 transition-transform" 
                          />
                        </td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white capitalize">
                          {animalName}
                        </td>
                        <td className="p-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          {confidenceVal}%
                        </td>
                        <td className="p-4 font-mono text-slate-500 dark:text-slate-400">
                          {new Date(timestampStr).toLocaleString()}
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-300">
                          {cameraSource}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setSelectedImage({ url: imgUrl, title: animalName, confidence: confidenceVal, camera: cameraSource, timestamp: timestampStr })}
                            className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/20 text-slate-700 dark:text-slate-300 hover:text-emerald-400 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/20 text-xs">
              <span className="text-slate-500">Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedItems.length)} of {sortedItems.length} detections</span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-transparent border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:border-white/10 text-slate-700 dark:text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed shadow-sm dark:shadow-none cursor-pointer"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-transparent border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:border-white/10 text-slate-700 dark:text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed shadow-sm dark:shadow-none cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Timeline View Mode */
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-white/5 space-y-8 relative overflow-hidden shadow-md dark:shadow-2xl">
          <div className="relative pl-6 border-l border-slate-200 dark:border-white/10 space-y-8">
            {sortedItems.slice(0, 10).map((evt) => {
              const imgUrl = getImageUrl(evt.image || evt.imageUrl);
              const animalName = evt.animal || evt.sensor || 'Detection';
              const confidenceVal = evt.confidence ? Number(evt.confidence).toFixed(2) : '95.00';
              const cameraSource = evt.camera || evt.deviceId || 'Laptop Webcam';
              const timestampStr = evt.timestamp || evt.createdAt || new Date().toISOString();

              return (
                <div key={evt._id} className="relative group">
                  <span className="absolute -left-[30px] top-1.5 w-4.5 h-4.5 rounded-full bg-white dark:bg-slate-900 border-2 border-[#2E7D32] dark:border-emerald-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] dark:bg-emerald-400"></span>
                  </span>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-mono text-[#2E7D32] dark:text-emerald-400 font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(timestampStr).toLocaleString()}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg text-slate-500 dark:text-slate-300 font-mono text-[10px]">
                        {cameraSource}
                      </span>
                    </div>
                    
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 hover:border-[#4CAF50]/30 transition-all max-w-xl space-y-3 shadow-sm">
                      <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">Detection Alert: {animalName} Identified ({confidenceVal}% confidence)</p>
                      
                      {imgUrl && (
                        <div 
                          className="mt-2.5 max-w-xs rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 cursor-pointer group/img relative"
                          onClick={() => setSelectedImage({ url: imgUrl, title: animalName, confidence: confidenceVal, camera: cameraSource, timestamp: timestampStr })}
                        >
                          <ImageWithFallback 
                            src={imgUrl} 
                            alt={animalName} 
                            className="w-full h-36 object-cover group-hover/img:scale-105 transition-transform" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                            <Eye className="w-4 h-4" /> View Fullscreen
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default EventLogs;
