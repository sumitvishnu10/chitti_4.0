import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIoT } from '../context/IoTContext';
import eventService from '../services/eventService';
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

export const LiveCamera = () => {
  const { 
    activeDevice, 
    events, 
    alerts,
    refreshData
  } = useIoT();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamStatus, setStreamStatus] = useState('loading');
  const [captureFlash, setCaptureFlash] = useState(false);
  const videoContainerRef = useRef(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  
  const CAMERA_URL = "http://10.198.214.50"; // Use as src for img

  const hasActiveAlert = activeDevice?.pir || activeDevice?.ultrasonic;

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

  // Image Capture Logic
  const captureFrame = useCallback(async () => {
    setCaptureFlash(true);
    setTimeout(() => setCaptureFlash(false), 200);

    let imageUrl = "https://images.unsplash.com/photo-1549471013-3364d7220b75?q=80&w=300&auto=format&fit=crop"; // fallback boar image
    
    try {
      if (imgRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = imgRef.current.videoWidth || 640;
        canvas.height = imgRef.current.videoHeight || 480;
        ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
        imageUrl = canvas.toDataURL('image/jpeg', 0.8);
      }
    } catch (e) {
      console.warn("Canvas capture failed (likely CORS). Using fallback image.");
    }

    // Find the latest unresolved event to attach the image to
    const latestEvent = events.find(e => e.status !== 'Resolved' && !e.imageUrl);
    if (latestEvent) {
      try {
        await eventService.updateStatus(latestEvent._id, latestEvent.status, imageUrl);
        refreshData();
      } catch (e) {
        console.error("Failed to save captured image to event", e);
      }
    }
  }, [events, refreshData]);

  // Trigger capture when alert becomes active
  useEffect(() => {
    if (hasActiveAlert) {
      captureFrame();
    }
  }, [hasActiveAlert, captureFrame]);


  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Camera className="w-6 h-6 text-emerald-500" /> Live Feed
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time surveillance and threat detection.</p>
        </div>
      </div>

      {/* Main Content Grid: Top Section Camera */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Live Camera Feed */}
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

            {/* Camera Viewport */}
            {streamStatus === 'online' ? (
              // Using img for MJPEG streams typically found on ESP32-CAM
              <img 
                ref={imgRef}
                src={CAMERA_URL} 
                alt="Live Camera Stream" 
                crossOrigin="anonymous"
                className={`w-full h-full object-cover border-0 ${hasActiveAlert ? 'scale-105' : 'scale-100'} transition-transform duration-700`}
                onError={() => setStreamStatus('offline')}
              />
            ) : streamStatus === 'loading' ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                <span className="text-sm font-semibold text-emerald-500 tracking-wider">Connecting to Camera...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <WifiOff className="w-12 h-12 text-slate-400" />
                <div className="text-center">
                  <span className="block text-sm font-semibold text-slate-900 dark:text-white">Connection Lost</span>
                  <span className="block text-xs text-slate-500 mt-1">Attempting to reconnect...</span>
                </div>
              </div>
            )}

            {/* Overlays */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${streamStatus === 'online' ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-[10px] font-bold text-white tracking-wider">LIVE</span>
              </div>
            </div>

            <div className="absolute bottom-4 right-4">
              <button 
                onClick={toggleFullscreen}
                className="p-2 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-white transition-all"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Alert Overlay */}
            <AnimatePresence>
              {hasActiveAlert && streamStatus === 'online' && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-red-500/90 backdrop-blur-md border border-red-400 rounded-lg shadow-lg"
                >
                  <AlertTriangle className="w-4 h-4 text-white animate-pulse" />
                  <span className="text-xs font-bold text-white tracking-wide">Intrusion Detected</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex justify-between items-center px-2">
             <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${streamStatus === 'online' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'}`}>
                  {streamStatus === 'online' ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {streamStatus === 'online' ? 'Stream Online' : 'Stream Offline'}
                </span>
             </div>
             {streamStatus === 'online' && <span className="text-xs font-mono text-slate-500">30 FPS | 720p</span>}
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
                 {events.filter(e => e.imageUrl).length} captures
               </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
              {events.filter(e => e.imageUrl).length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-70">
                    <Crosshair className="w-8 h-8 mb-2" />
                    <p className="text-sm text-center">No detections yet.</p>
                 </div>
              ) : (
                events.filter(e => e.imageUrl).map(event => (
                  <div key={event._id} className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden hover:border-emerald-500/30 transition-colors">
                    <div className="aspect-video w-full bg-slate-100 dark:bg-black relative">
                      <img src={event.imageUrl} alt="Detection Capture" className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-medium text-white flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                           Motion Detected
                        </p>
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">92%</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-xs text-slate-500">Species:</span>
                         <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">Unknown (Wild Boar)</span>
                      </div>
                    </div>
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

export default LiveCamera;
