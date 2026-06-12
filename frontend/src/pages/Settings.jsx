import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Cpu, 
  Volume2, 
  Sliders, 
  Bell, 
  Save, 
  ShieldCheck, 
  UserCircle
} from 'lucide-react';

export const Settings = () => {
  // Config states (persisted via mock logic or saved locally)
  const [pollingRate, setPollingRate] = useState(10);
  const [rangeLimit, setRangeLimit] = useState(150);
  const [vibeThreshold, setVibeThreshold] = useState(4.5);
  const [batLimit, setBatLimit] = useState(20);
  
  // Actuator toggles
  const [buzzerEnabled, setBuzzerEnabled] = useState(true);
  const [ledEnabled, setLedEnabled] = useState(true);
  const [motorEnabled, setMotorEnabled] = useState(true);
  const [notifyApp, setNotifyApp] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    // Save configurations to localStorage for demo persistence
    localStorage.setItem('chitti_polling_rate', pollingRate);
    localStorage.setItem('chitti_range_limit', rangeLimit);
    localStorage.setItem('chitti_vibe_threshold', vibeThreshold);
    localStorage.setItem('chitti_bat_limit', batLimit);

    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-wide">Configuration Parameters</h2>
        <p className="text-xs text-slate-400 font-semibold tracking-wide">Adjust device boundaries and system notifications triggers</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Hardware parameters */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6 shadow-xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
              <Sliders className="w-5 h-5 text-[#4CAF50]" />
              Edge Trigger Thresholds
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              
              {/* Telemetry Polling Rate */}
              <div className="space-y-2">
                <label className="text-slate-400 font-bold">Telemetry Polling Rate (seconds)</label>
                <input 
                  type="number" 
                  min="2"
                  max="60"
                  value={pollingRate} 
                  onChange={(e) => setPollingRate(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/5 focus:border-[#4CAF50]/30 rounded-xl focus:outline-none text-white text-sm focus:ring-1 focus:ring-[#4CAF50]/30 transition-all font-mono"
                />
                <p className="text-[10px] text-slate-500">Speed at which telemetry is fetched from the local broker</p>
              </div>

              {/* Ultrasonic Range */}
              <div className="space-y-2">
                <label className="text-slate-400 font-bold">Ultrasonic Range Trigger Limit (cm)</label>
                <input 
                  type="number" 
                  min="20"
                  max="500"
                  value={rangeLimit} 
                  onChange={(e) => setRangeLimit(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/5 focus:border-[#4CAF50]/30 rounded-xl focus:outline-none text-white text-sm focus:ring-1 focus:ring-[#4CAF50]/30 transition-all font-mono"
                />
                <p className="text-[10px] text-slate-500">Trigger scare actions if crop proximity falls below this value</p>
              </div>

              {/* Vibration Threshold */}
              <div className="space-y-2">
                <label className="text-slate-400 font-bold">Soil Vibration Threshold (Hz)</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="1"
                  max="10"
                  value={vibeThreshold} 
                  onChange={(e) => setVibeThreshold(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/5 focus:border-[#4CAF50]/30 rounded-xl focus:outline-none text-white text-sm focus:ring-1 focus:ring-[#4CAF50]/30 transition-all font-mono"
                />
                <p className="text-[10px] text-slate-500">Intrusion flag limit for soil seismic activity</p>
              </div>

              {/* Battery Warn Limit */}
              <div className="space-y-2">
                <label className="text-slate-400 font-bold">Battery Critical Limit Warning (%)</label>
                <input 
                  type="number" 
                  min="5"
                  max="50"
                  value={batLimit} 
                  onChange={(e) => setBatLimit(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/5 focus:border-[#4CAF50]/30 rounded-xl focus:outline-none text-white text-sm focus:ring-1 focus:ring-[#4CAF50]/30 transition-all font-mono"
                />
                <p className="text-[10px] text-slate-500">Sends alerts when solar battery bank drops under this</p>
              </div>

            </div>
          </div>
        </div>

        {/* Right column: Actuators controls */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6 shadow-xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
              <Volume2 className="w-5 h-5 text-[#4CAF50]" />
              Edge Deterrent Toggles
            </h3>

            <div className="space-y-4 text-xs font-semibold">
              
              {/* Buzzer */}
              <div className="flex items-center justify-between p-3.5 bg-slate-900/40 rounded-2xl border border-white/5">
                <div>
                  <p className="text-white">Audible Buzzer Sounder</p>
                  <p className="text-[10px] text-slate-400 font-normal">Triggers high pitch acoustic deterrence</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={buzzerEnabled}
                  onChange={(e) => setBuzzerEnabled(e.target.checked)}
                  className="w-5 h-5 text-[#2E7D32] border-white/5 focus:ring-0 rounded-lg cursor-pointer"
                />
              </div>

              {/* LED Flash */}
              <div className="flex items-center justify-between p-3.5 bg-slate-900/40 rounded-2xl border border-white/5">
                <div>
                  <p className="text-white">LED Flash Strobe</p>
                  <p className="text-[10px] text-slate-400 font-normal">Emits visual flash triggers during dark cycles</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={ledEnabled}
                  onChange={(e) => setLedEnabled(e.target.checked)}
                  className="w-5 h-5 text-[#2E7D32] border-white/5 focus:ring-0 rounded-lg cursor-pointer"
                />
              </div>

              {/* Motor Rotator */}
              <div className="flex items-center justify-between p-3.5 bg-slate-900/40 rounded-2xl border border-white/5">
                <div>
                  <p className="text-white">Deterrent Motor Rotator</p>
                  <p className="text-[10px] text-slate-400 font-normal">Activates physical spin arms for deterrent motion</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={motorEnabled}
                  onChange={(e) => setMotorEnabled(e.target.checked)}
                  className="w-5 h-5 text-[#2E7D32] border-white/5 focus:ring-0 rounded-lg cursor-pointer"
                />
              </div>

              {/* Notification Toggles */}
              <div className="flex items-center justify-between p-3.5 bg-slate-900/40 rounded-2xl border border-white/5">
                <div>
                  <p className="text-white">Push Alert Broadcast</p>
                  <p className="text-[10px] text-slate-400 font-normal">Dispatches real-time pop-ups on operator terminal</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyApp}
                  onChange={(e) => setNotifyApp(e.target.checked)}
                  className="w-5 h-5 text-[#2E7D32] border-white/5 focus:ring-0 rounded-lg cursor-pointer"
                />
              </div>

            </div>

            {/* Save Button */}
            <div className="pt-2 border-t border-white/5 flex flex-col gap-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] hover:from-[#338e38] hover:to-[#57c25c] text-white font-bold text-xs rounded-xl transition-all shadow-[0_4px_15px_rgba(76,175,80,0.25)] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Parameters</span>
                  </>
                )}
              </button>

              {saveSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1.5 justify-center">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Thresholds Dispatched to ESP32 Node!</span>
                </div>
              )}
            </div>

          </div>
        </div>

      </form>

    </div>
  );
};

export default Settings;
