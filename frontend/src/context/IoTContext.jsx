import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import deviceService from '../services/deviceService';
import dashboardService from '../services/dashboardService';
import sensorService from '../services/sensorService';
import analyticsService from '../services/analyticsService';
import alertService from '../services/alertService';
import systemService from '../services/systemService';
import eventService from '../services/eventService';
import detectionService, { getImageUrl } from '../services/detectionService';
import { useAuth } from './AuthContext';

const IoTContext = createContext(null);

const mockDevice = {
  deviceId: "CHITTI_01",
  battery: 84,
  solarVoltage: 5.4,
  temperature: 28.5,
  humidity: 62.1,
  pir: false,
  ultrasonic: false,
  vibration: false,
  camera: true,
  buzzer: false,
  led: false,
  status: "Online",
  updatedAt: new Date().toISOString()
};

const mockSummary = {
  totalDevices: 1,
  totalEvents: 0,
  totalAlerts: 0,
  unreadAlerts: 0,
  systemStatus: "ONLINE"
};

const mockHealth = {
  success: true,
  status: "ONLINE",
  database: "CONNECTED",
  mqtt: "CONNECTED",
  timestamp: new Date().toISOString()
};

const mockSensorHistory = [
  { temperature: 24.2, humidity: 65, battery: 85, createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
  { temperature: 25.8, humidity: 63, battery: 85, createdAt: new Date(Date.now() - 3600000 * 4).toISOString() },
  { temperature: 27.5, humidity: 61, battery: 84, createdAt: new Date(Date.now() - 3600000 * 3).toISOString() },
  { temperature: 29.1, humidity: 59, battery: 84, createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
  { temperature: 28.5, humidity: 62, battery: 84, createdAt: new Date().toISOString() },
];

export const IoTProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [backendOffline, setBackendOffline] = useState(false);
  const [devices, setDevices] = useState([mockDevice]);
  const [activeDevice, setActiveDevice] = useState(mockDevice);
  const [summary, setSummary] = useState(mockSummary);
  const [health, setHealth] = useState(mockHealth);
  const [sensorHistory, setSensorHistory] = useState(mockSensorHistory);
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  // Real-time Detection State
  const [detections, setDetections] = useState([]);
  const [latestDetection, setLatestDetection] = useState(null);

  // Real-time statuses
  const [mqttStatus, setMqttStatus] = useState("Connected");
  const [dbStatus, setDbStatus] = useState("Connected");
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());
  const [toastMessage, setToastMessage] = useState(null);

  // Dynamic Statistics Calculation
  const stats = useMemo(() => {
    const total = detections.length;
    const persons = detections.filter(d => {
      const animal = (d.animal || '').toLowerCase();
      return animal.includes('person') || animal.includes('human');
    }).length;
    const dogs = detections.filter(d => (d.animal || '').toLowerCase().includes('dog')).length;
    const cows = detections.filter(d => (d.animal || '').toLowerCase().includes('cow')).length;
    const elephants = detections.filter(d => (d.animal || '').toLowerCase().includes('elephant')).length;
    
    const latestTime = latestDetection
      ? (latestDetection.timestamp || latestDetection.createdAt)
      : (detections[0] ? (detections[0].timestamp || detections[0].createdAt) : null);

    return {
      totalDetections: total,
      totalPersons: persons,
      totalDogs: dogs,
      totalCows: cows,
      totalElephants: elephants,
      latestDetectionTime: latestTime ? new Date(latestTime).toLocaleString() : 'N/A'
    };
  }, [detections, latestDetection]);

  const fetchIoTData = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      // 1. Fetch Real Detections from Backend
      let fetchedDetections = [];
      try {
        const detRes = await detectionService.getDetections();
        if (detRes && detRes.success && Array.isArray(detRes.data)) {
          fetchedDetections = detRes.data;
        } else if (Array.isArray(detRes)) {
          fetchedDetections = detRes;
        }
        setBackendOffline(false);
      } catch (detError) {
        console.warn("Backend offline or detection endpoint unreachable:", detError.message);
        setBackendOffline(true);
      }

      // Process detections if backend is reachable
      if (fetchedDetections.length > 0) {
        // Sort newest first
        fetchedDetections.sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
        
        setDetections(fetchedDetections);
        setLatestDetection(fetchedDetections[0]);

        // Map real detections into Events feed
        const mappedEvents = fetchedDetections.map((d) => {
          const animalName = d.animal ? (d.animal.charAt(0).toUpperCase() + d.animal.slice(1)) : 'Unknown';
          const isPerson = (d.animal || '').toLowerCase().includes('person') || (d.animal || '').toLowerCase().includes('human');
          return {
            _id: d._id || Math.random().toString(),
            deviceId: d.camera || 'Laptop Webcam',
            sensor: isPerson ? 'Human Detection' : 'Wildlife Detection',
            deterrent: isPerson ? 'Warning Alarm' : 'Strobe & Sound',
            status: isPerson ? 'Human Detected' : 'Wildlife Intrusion Detected',
            timestamp: d.timestamp || d.createdAt || new Date().toISOString(),
            animal: animalName,
            confidence: d.confidence,
            camera: d.camera || 'Laptop Webcam',
            image: d.image,
            imageUrl: getImageUrl(d.image)
          };
        });
        setEvents(mappedEvents);

        // Map real detections into Alerts feed
        const mappedAlerts = fetchedDetections.map((d) => {
          const isPerson = (d.animal || '').toLowerCase().includes('person') || (d.animal || '').toLowerCase().includes('human');
          const alertHeading = isPerson ? 'Human Detected' : 'Wildlife Intrusion Detected';
          const animalName = d.animal ? (d.animal.charAt(0).toUpperCase() + d.animal.slice(1)) : 'Unknown';
          return {
            _id: d._id || Math.random().toString(),
            deviceId: d.camera || 'Laptop Webcam',
            type: isPerson ? 'HUMAN' : 'WILDLIFE',
            message: `${alertHeading}: ${animalName} (${d.confidence ? Number(d.confidence).toFixed(2) : 0}% confidence)`,
            severity: isPerson ? 'HIGH' : 'MEDIUM',
            status: 'UNREAD',
            createdAt: d.timestamp || d.createdAt || new Date().toISOString(),
            image: getImageUrl(d.image)
          };
        });
        setAlerts(mappedAlerts);

        // Update summary metrics
        setSummary({
          totalDevices: 1,
          totalEvents: fetchedDetections.length,
          totalAlerts: mappedAlerts.length,
          unreadAlerts: mappedAlerts.filter(a => a.status === 'UNREAD').length,
          systemStatus: "ONLINE"
        });
      }

      // 2. Fetch Devices
      try {
        const devData = await deviceService.getDevices();
        if (devData && devData.success && devData.data && devData.data.length > 0) {
          setDevices(devData.data);
          setActiveDevice(devData.data[0]);
        }
      } catch (e) {
        console.warn("Failed fetching device list from API.");
      }

      // 3. Fetch Health
      try {
        const hData = await systemService.getHealth();
        if (hData && hData.success) {
          setHealth(hData);
          setMqttStatus(hData.mqtt === "CONNECTED" ? "Connected" : "Disconnected");
          setDbStatus(hData.database === "CONNECTED" ? "Connected" : "Disconnected");
        }
      } catch (e) {
        setHealth({ ...mockHealth, status: "ERROR", database: "ERROR", mqtt: "ERROR" });
      }

      setLastSync(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("General error in IoT data fetching:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleMarkAlertRead = async (id) => {
    try {
      setAlerts(prev => prev.map(alert => alert._id === id ? { ...alert, status: "READ" } : alert));
      setSummary(prev => ({ ...prev, unreadAlerts: Math.max(0, prev.unreadAlerts - 1) }));
    } catch (e) {
      console.error("Failed to mark alert as read:", e);
    }
  };

  // Set up 3-second auto-refresh polling for real-time updates as per requirement
  useEffect(() => {
    if (isAuthenticated) {
      fetchIoTData();
      
      const refreshInterval = setInterval(() => {
        fetchIoTData();
      }, 3000); // 3 seconds auto refresh

      return () => {
        clearInterval(refreshInterval);
      };
    }
  }, [isAuthenticated, fetchIoTData]);

  return (
    <IoTContext.Provider value={{
      loading,
      backendOffline,
      devices,
      activeDevice,
      summary,
      health,
      sensorHistory,
      events,
      alerts,
      analytics,
      detections,
      latestDetection,
      stats,
      mqttStatus,
      dbStatus,
      lastSync,
      toastMessage,
      clearToast: () => setToastMessage(null),
      refreshData: fetchIoTData,
      markAlertRead: handleMarkAlertRead,
      getImageUrl
    }}>
      {children}
    </IoTContext.Provider>
  );
};

export const useIoT = () => {
  const context = useContext(IoTContext);
  if (!context) {
    throw new Error('useIoT must be used within an IoTProvider');
  }
  return context;
};
