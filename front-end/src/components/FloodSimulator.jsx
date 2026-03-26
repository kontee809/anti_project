import React, { useState, useRef } from 'react';
import { FlaskConical, Play, Square, Activity } from 'lucide-react';
import { createFloodReport } from '../services/api';

const FloodSimulator = ({ position, onReportCreated }) => {
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  const generateRandomReport = async (centerLat, centerLng) => {
    const offsetLat = (Math.random() - 0.5) * 0.04;
    const offsetLng = (Math.random() - 0.5) * 0.04;
    const level = Math.floor(Math.random() * 150) + 5;
    const types = ['URBAN', 'RIVER', 'FLASH_FLOOD'];
    const sources = ['USER', 'SENSOR', 'SYSTEM'];
    const descriptions = [
      'Nước dâng cao, giao thông bị ảnh hưởng',
      'Ngập nặng khu dân cư, cần hỗ trợ',
      'Cống thoát nước bị tắc nghẽn',
      'Mưa lớn kéo dài gây ngập',
      'Triều cường kết hợp mưa lớn',
      'Lũ quét từ thượng nguồn',
    ];

    try {
      await createFloodReport({
        latitude: centerLat + offsetLat,
        longitude: centerLng + offsetLng,
        address: `Khu vực ${Math.floor(Math.random() * 20) + 1}, Phường ${Math.floor(Math.random() * 10) + 1}`,
        floodLevelCm: level,
        floodType: types[Math.floor(Math.random() * types.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        durationEstimate: `${Math.floor(Math.random() * 5) + 1} giờ`,
        reportedBy: sources[Math.floor(Math.random() * sources.length)],
      });
      setCount(prev => prev + 1);
      if (onReportCreated) onReportCreated();
    } catch (err) {
      console.error('Simulation error:', err);
    }
  };

  const start = () => {
    if (!position) return;
    setRunning(true);
    setCount(0);
    // Generate one immediately
    generateRandomReport(position[0], position[1]);
    intervalRef.current = setInterval(() => {
      generateRandomReport(position[0], position[1]);
    }, 4000);
  };

  const stop = () => {
    setRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  if (localStorage.getItem('role') !== 'ADMIN') return null;

  return (
    <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-white shadow-xl">
      <div className="flex items-center gap-2 mb-3">
        <FlaskConical size={16} className="text-cyan-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">DEV: Flood Simulator</span>
        {running && (
          <span className="flex items-center text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full animate-pulse border border-emerald-500/30 ml-auto">
            <Activity size={10} className="mr-1" /> {count} generated
          </span>
        )}
      </div>
      
      <div className="flex gap-2">
        <button onClick={start} disabled={running || !position}
          className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play size={14} /> Start
        </button>
        <button onClick={stop}
          className="px-4 py-2 bg-slate-700 hover:bg-red-500/80 active:scale-95 text-white rounded-lg flex items-center justify-center transition border border-slate-600 hover:border-red-500"
        >
          <Square size={14} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default FloodSimulator;
