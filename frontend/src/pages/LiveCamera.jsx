import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIoT } from '../context/IoTContext';
import { 
  Camera, 
  Maximize2, 
  Minimize2, 
  Wifi, 
  WifiOff,
  AlertTriangle,
  Clock,
  Crosshair,
  Image as ImageIcon
} from 'lucide-react';

const ImageWithFallback = ({ src, alt, className, onClick }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (error || !src) {
    return (
      <div 
        onClick={onClick} 
        className={`${className} bg-slate-800/90 flex flex-col items-center justify-center text-slate-400 p-2 gap-1.5 border border-slate-700/50`}
      >
        <Camera className="w-6 h-6 text-emerald-500 opacity-80" />
        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-300">Camera Snapshot</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onClick={onClick} 
      onError={() => setError(true)} 
    />
  );
};

export const LiveCamera = () => {
  const { 
    activeDevice, 
    events, 
    detections,
    latestDetection,
    getImageUrl
  } = useIoT();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamStatus, setStreamStatus] = useState('loading');
  const [captureFlash, setCaptureFlash] = useState(false);
  const videoContainerRef = useRef(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  
  const CAMERA_URL = "http://10.198.214.50";

  const hasActiveAlert = activeDevice?.pir || activeDevice?.ultrasonic || !!latestDetection;

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setStreamStatus('online');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const displayList = detections.length > 0 ? detections : events;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Camera className="w-6 h-6 text-emerald-500" /> Live Feed & AI Detections
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time surveillance and threat detection pipeline.</p>
        </div>
      </div>

      {/* Main Content Grid: Top Section Camera */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Live Camera Feed / Latest Snapshot */}
        <div className="lg:col-span-3 space-y-4">
          <div 
            ref={videoContainerRef}
            className={`relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden border transition-all duration-300 shadow-lg flex items-center justify-center
              ${hasActiveAlert ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-slate-200 dark:border-white/5'}
            `}
          >
            {/* Capture Flash Overlay */}
            <AnimatePresence>
              {captureFlash && (
                <motion.div 
                  initial={{ opacity: 1 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-white z-50 pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Hidden canvas for capturing */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera Viewport or Latest Snapshot View */}
            {latestDetection ? (
              <ImageWithFallback 
                src={getImageUrl(latestDetection.image)} 
                alt="Latest Detection Snapshot" 
                className="w-full h-full object-cover border-0 transition-transform duration-700"
              />
            ) : streamStatus === 'online' ? (
              <img 
                ref={imgRef}
                src={CAMERA_URL} 
                alt="Live Camera Stream" 
                className="w-full h-full object-cover border-0 scale-100 transition-transform duration-700"
                onError={() => setStreamStatus('offline')}
              />
            ) : streamStatus === 'loading' ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                <span className="text-sm font-semibold text-emerald-500 tracking-wider">Connecting to Camera Feed...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <WifiOff className="w-12 h-12 text-slate-400" />
                <div className="text-center">
                  <span className="block text-sm font-semibold text-slate-900 dark:text-white">Connection Lost</span>
                  <span className="block text-xs text-slate-500 mt-1">Waiting for stream or detection input...</span>
                </div>
              </div>
            )}

            {/* Overlays */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${latestDetection || streamStatus === 'online' ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-[10px] font-bold text-white tracking-wider">
                  {latestDetection ? 'LATEST DETECTION' : 'LIVE'}
                </span>
              </div>
            </div>

            <div className="absolute bottom-4 right-4">
              <button 
                onClick={toggleFullscreen}
                className="p-2 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-white transition-all cursor-pointer"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Alert Overlay */}
            <AnimatePresence>
              {latestDetection && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-red-500/90 backdrop-blur-md border border-red-400 rounded-lg shadow-lg"
                >
                  <AlertTriangle className="w-4 h-4 text-white animate-pulse" />
                  <span className="text-xs font-bold text-white tracking-wide capitalize">
                    {(latestDetection.animal || '').toLowerCase().includes('person') || (latestDetection.animal || '').toLowerCase().includes('human')
                      ? 'Human Detected'
                      : 'Wildlife Intrusion Detected'} ({latestDetection.animal})
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex justify-between items-center px-2">
             <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${latestDetection || streamStatus === 'online' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'}`}>
                  {latestDetection || streamStatus === 'online' ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {latestDetection ? `Active AI Feed: ${latestDetection.camera || 'Laptop Webcam'}` : 'Stream Active'}
                </span>
             </div>
             <span className="text-xs font-mono text-slate-500">YOLOv8 Real-time</span>
          </div>

        </div>

        {/* Right Panel: Detected Logs */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-5 h-full flex flex-col max-h-[600px]">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-4 mb-4">
               <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                 <ImageIcon className="w-4 h-4 text-emerald-500" /> Detected Logs
               </h3>
               <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                 {displayList.length} captures
               </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
              {displayList.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-70">
                    <Crosshair className="w-8 h-8 mb-2" />
                    <p className="text-sm text-center">No detections yet.</p>
                 </div>
              ) : (
                displayList.map(item => {
                  const imgUrl = getImageUrl(item.image || item.imageUrl);
                  const animalName = item.animal || item.sensor || 'Detection';
                  const confidenceVal = item.confidence ? Number(item.confidence).toFixed(1) : '95.0';
                  return (
                    <div key={item._id} className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden hover:border-emerald-500/30 transition-colors">
                      <div className="aspect-video w-full bg-slate-100 dark:bg-black relative">
                        <ImageWithFallback 
                          src={imgUrl} 
                          alt={animalName} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-medium text-white flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(item.timestamp || item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                            {animalName}
                          </p>
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{confidenceVal}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-xs text-slate-500">Camera:</span>
                           <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                             {item.camera || item.deviceId || 'Laptop Webcam'}
                           </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default LiveCamera;
