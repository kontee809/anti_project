import React, { useState, useEffect } from 'react';
import { simulateWaterStation, stopSimulation } from '../services/api';
import { FlaskConical, Play, Square, Activity, AlertTriangle } from 'lucide-react';

const IoTSimulatorPanel = ({ stations, onUpdate }) => {
  const [stationId, setStationId] = useState('');
  const [mode, setMode] = useState('AUTO');
  const [value, setValue] = useState('');
  const [duration, setDuration] = useState('60');
  const [simulating, setSimulating] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    let interval;
    if (simulating && mode !== 'MANUAL') {
      interval = setInterval(() => {
        onUpdate();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [simulating, mode, onUpdate]);

  const handleStart = async () => {
    if (!stationId) {
      showToast('Please select a station', 'error');
      return;
    }
    try {
      await simulateWaterStation({
        stationId: parseInt(stationId),
        mode,
        value: value ? parseFloat(value) : null,
        duration: parseInt(duration)
      });
      showToast('Simulation started!');
      if (mode === 'MANUAL') {
        setTimeout(onUpdate, 500); // give backend a moment to save
      } else {
        setSimulating(true);
        // Automatically stop polling after duration
        setTimeout(() => setSimulating(false), parseInt(duration) * 1000 + 1000);
      }
    } catch (error) {
      showToast('Failed to start: ' + (error.response?.data || error.message), 'error');
    }
  };

  const handleStop = async () => {
    if (!stationId) return;
    try {
      await stopSimulation(parseInt(stationId));
      setSimulating(false);
      showToast('Simulation stopped');
    } catch (error) {
      showToast('Failed to stop: ' + error.message, 'error');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-8 text-white shadow-xl relative overflow-hidden" data-test-id="iot-simulator-panel">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
          <FlaskConical size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            DEV: IoT Simulator Panel 
            {simulating && (
              <span className="flex items-center text-xs font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full animate-pulse border border-emerald-500/30">
                <Activity size={12} className="mr-1" /> RUNNING
              </span>
            )}
          </h2>
          <p className="text-sm text-slate-400">Simulate realistic water level sensor data for testing.</p>
        </div>
      </div>

      {toast && (
        <div className={`absolute top-4 right-4 px-4 py-2 rounded-lg font-semibold shadow-lg text-sm flex items-center gap-2 z-10 transition-all ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
          {toast.type === 'error' ? <AlertTriangle size={16} /> : <FlaskConical size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Station</label>
          <select 
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
            value={stationId}
            onChange={(e) => setStationId(e.target.value)}
            data-test-id="iot-sim-select-station"
          >
            <option value="">Select Station...</option>
            {stations.map(s => (
              <option key={s.id} value={s.id}>ST-{s.id} ({s.name})</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mode</label>
          <select 
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            data-test-id="iot-sim-select-mode"
          >
            <option value="AUTO">AUTO (Gradual change)</option>
            <option value="RANDOM">RANDOM (Crazy jumps)</option>
            <option value="MANUAL">MANUAL (Set exact value)</option>
          </select>
        </div>

        {mode === 'MANUAL' ? (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Water Level (m)</label>
            <input 
              type="number" step="any"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition placeholder-slate-500"
              placeholder="e.g. 75"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              data-test-id="iot-sim-input-value"
            />
          </div>
        ) : (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Duration (sec)</label>
            <input 
              type="number"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition placeholder-slate-500"
              placeholder="60"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              data-test-id="iot-sim-input-duration"
            />
          </div>
        )}

        <div className="space-y-1.5 flex flex-col justify-end">
          <div className="flex gap-2 h-[46px]">
            <button 
              onClick={handleStart}
              disabled={simulating && mode !== 'MANUAL'}
              className="flex-1 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              data-test-id="iot-sim-btn-start"
            >
              <Play size={16} /> Start
            </button>
            <button 
              onClick={handleStop}
              className="px-4 bg-slate-700 hover:bg-red-500/80 active:scale-95 text-white rounded-xl flex items-center justify-center transition border border-slate-600 hover:border-red-500"
              title="Stop Simulation"
              data-test-id="iot-sim-btn-stop"
            >
              <Square size={16} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IoTSimulatorPanel;
