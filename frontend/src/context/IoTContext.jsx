import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import deviceService from '../services/deviceService';
import dashboardService from '../services/dashboardService';
import sensorService from '../services/sensorService';
import analyticsService from '../services/analyticsService';
import alertService from '../services/alertService';
import systemService from '../services/systemService';
import eventService from '../services/eventService';
import { useAuth } from './AuthContext';

const IoTContext = createContext(null);

// Premium Mock Data Fallbacks in case backend is empty or unreachable
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
  totalEvents: 42,
  totalAlerts: 15,
  unreadAlerts: 3,
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

const mockEvents = [
  { _id: "e1", deviceId: "CHITTI_01", sensor: "PIR", status: "Active", deterrent: "Buzzer + LED Flash", imageUrl: "https://images.unsplash.com/photo-1507666405895-422efe53f00d?w=400&q=80", timestamp: new Date(Date.now() - 60000 * 12).toISOString() },
  { _id: "e2", deviceId: "CHITTI_01", sensor: "Ultrasonic", status: "Active", deterrent: "Motor Arm Rotation", imageUrl: "https://images.unsplash.com/photo-1484406566174-9da000fda645?w=400&q=80", timestamp: new Date(Date.now() - 60000 * 45).toISOString() },
  { _id: "e3", deviceId: "CHITTI_01", sensor: "Vibration", status: "Active", deterrent: "Buzzer Sound", imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&q=80", timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
];

const mockAlerts = [
  { _id: "a1", deviceId: "CHITTI_01", type: "WILDLIFE_DETECTED", message: "Wild Boar detected in Sector 3 (Confidence 94%)", severity: "HIGH", status: "UNREAD", createdAt: new Date(Date.now() - 60000 * 5).toISOString() },
  { _id: "a2", deviceId: "CHITTI_01", type: "BATTERY_LOW", message: "Battery level fell below 20%", severity: "MEDIUM", status: "UNREAD", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: "a3", deviceId: "CHITTI_01", type: "CAMERA_OFFLINE", message: "ESP32 Camera stream unavailable", severity: "HIGH", status: "UNREAD", createdAt: new Date(Date.now() - 7200000).toISOString() },
];

const mockAnalytics = {
  totalEvents: 42,
  sensorStats: [
    { _id: "PIR", count: 24 },
    { _id: "Ultrasonic", count: 12 },
    { _id: "Vibration", count: 6 }
  ],
  statusStats: [
    { _id: "Resolved", count: 35 },
    { _id: "Active", count: 7 }
  ]
};

export const IoTProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState([mockDevice]);
  const [activeDevice, setActiveDevice] = useState(mockDevice);
  const [summary, setSummary] = useState(mockSummary);
  const [health, setHealth] = useState(mockHealth);
  const [sensorHistory, setSensorHistory] = useState(mockSensorHistory);
  const [events, setEvents] = useState(mockEvents);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [analytics, setAnalytics] = useState(mockAnalytics);
  
  // Real-time statuses
  const [mqttStatus, setMqttStatus] = useState("Connected");
  const [dbStatus, setDbStatus] = useState("Connected");
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());
  const [toastMessage, setToastMessage] = useState(null);

  const fetchIoTData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      // 1. Fetch Summary
      try {
        const sumData = await dashboardService.getSummary();
        if (sumData && sumData.success) {
          setSummary(sumData.summary);
        }
      } catch (e) {
        console.warn("Failed fetching summary from API, using fallback.");
      }

      // 2. Fetch Devices
      try {
        const devData = await deviceService.getDevices();
        if (devData && devData.success && devData.data && devData.data.length > 0) {
          setDevices(devData.data);
          
          // Try to get latest device status
          const activeRes = await deviceService.getDeviceStatus();
          if (activeRes && activeRes.success && activeRes.data) {
            setActiveDevice(activeRes.data);
          } else {
            setActiveDevice(devData.data[0]);
          }
        } else {
          // If no devices exist on backend, try to create one to populate the DB
          try {
            const createRes = await deviceService.createDevice(mockDevice);
            if (createRes && createRes.success) {
              setDevices([createRes.data]);
              setActiveDevice(createRes.data);
            }
          } catch (createErr) {
            console.warn("Failed to create default device on API.");
          }
        }
      } catch (e) {
        console.warn("Failed fetching device list from API, using fallback.");
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
        setMqttStatus("Disconnected");
        setDbStatus("Disconnected");
      }

      // 4. Fetch Sensor Readings
      try {
        const sData = await sensorService.getSensorData();
        if (sData && sData.success && sData.data && sData.data.length > 0) {
          setSensorHistory(sData.data);
        }
      } catch (e) {
        console.warn("Failed fetching sensor history from API.");
      }

      // 5. Fetch Events
      try {
        const eData = await eventService.getEvents();
        if (eData && eData.success && eData.data && eData.data.length > 0) {
          setEvents(eData.data);
        }
      } catch (e) {
        console.warn("Failed fetching event logs from API.");
      }

      // 6. Fetch Alerts
      try {
        const aData = await alertService.getAlerts();
        if (aData && aData.success && aData.data) {
          setAlerts(aData.data);
        }
      } catch (e) {
        console.warn("Failed fetching alerts list from API.");
      }

      // 7. Fetch Analytics
      try {
        const analyticsData = await analyticsService.getAnalytics();
        if (analyticsData && analyticsData.success) {
          setAnalytics(analyticsData);
        }
      } catch (e) {
        console.warn("Failed fetching analytics from API.");
      }

      setLastSync(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("General error in IoT data fetching:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Handle Mark Alert as Read
  const handleMarkAlertRead = async (id) => {
    try {
      // Optimistic update
      setAlerts(prev => prev.map(alert => alert._id === id ? { ...alert, status: "READ" } : alert));
      setSummary(prev => ({ ...prev, unreadAlerts: Math.max(0, prev.unreadAlerts - 1) }));
      
      await alertService.markAsRead(id);
    } catch (e) {
      console.error("Failed to mark alert as read:", e);
    }
  };

  // Trigger Mock Live Threat Detections to demonstrate real-time notifications
  const simulateLiveThreat = useCallback(() => {
    const threats = [
      { type: "Elephant", sensor: "Ultrasonic", deterrent: "High-Pitch Buzzer", img: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&q=80" },
      { type: "Wild Boar", sensor: "PIR", deterrent: "Buzzer + Strobe LED", img: "https://images.unsplash.com/photo-1507666405895-422efe53f00d?w=400&q=80" },
      { type: "Deer", sensor: "Vibration", deterrent: "Buzzer Sound", img: "https://images.unsplash.com/photo-1484406566174-9da000fda645?w=400&q=80" }
    ];
    
    const randomThreat = threats[Math.floor(Math.random() * threats.length)];
    const confidence = Math.floor(Math.random() * 15) + 81; // 81% to 95%
    
    const newEvent = {
      _id: `mock-event-${Date.now()}`,
      deviceId: "CHITTI_01",
      sensor: randomThreat.sensor,
      status: "Active",
      deterrent: randomThreat.deterrent,
      imageUrl: randomThreat.img,
      timestamp: new Date().toISOString()
    };

    const newAlert = {
      _id: `mock-alert-${Date.now()}`,
      deviceId: "CHITTI_01",
      type: "WILDLIFE_DETECTED",
      message: `${randomThreat.type} detected in Field sector (Confidence ${confidence}%)`,
      severity: "HIGH",
      status: "UNREAD",
      createdAt: new Date().toISOString()
    };

    // Update state instantly for visual effect
    setEvents(prev => [newEvent, ...prev.slice(0, 19)]);
    setAlerts(prev => [newAlert, ...prev]);
    setSummary(prev => ({
      ...prev,
      totalEvents: prev.totalEvents + 1,
      totalAlerts: prev.totalAlerts + 1,
      unreadAlerts: prev.unreadAlerts + 1
    }));
    
    // Show premium toast alert
    setToastMessage({
      title: "🚨 Real-time Threat Alert",
      message: newAlert.message,
      type: "DANGER"
    });

    // Also push to backend if running, in background
    try {
      eventService.createEvent(newEvent);
      alertService.createAlert(newAlert);
    } catch (e) {
      // fail silently
    }
  }, []);

  // Set up 10s auto-refresh
  useEffect(() => {
    if (isAuthenticated) {
      fetchIoTData();
      
      const refreshInterval = setInterval(() => {
        fetchIoTData();
      }, 10000); // 10 seconds auto refresh

      // Threat simulation every 65 seconds
      const simulationInterval = setInterval(() => {
        simulateLiveThreat();
      }, 65000);

      return () => {
        clearInterval(refreshInterval);
        clearInterval(simulationInterval);
      };
    }
  }, [isAuthenticated, fetchIoTData, simulateLiveThreat]);

  return (
    <IoTContext.Provider value={{
      loading,
      devices,
      activeDevice,
      summary,
      health,
      sensorHistory,
      events,
      alerts,
      analytics,
      mqttStatus,
      dbStatus,
      lastSync,
      toastMessage,
      clearToast: () => setToastMessage(null),
      refreshData: fetchIoTData,
      markAlertRead: handleMarkAlertRead,
      triggerSimulation: simulateLiveThreat
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
