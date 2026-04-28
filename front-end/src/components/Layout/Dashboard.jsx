import React from 'react';
import MapDisplay from '../Map/MapDisplay';
import LayerControl from '../Sidebar/LayerControl';
import Legend from '../Sidebar/Legend';
import { PhoneCall } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="relative w-full h-full">
      {/* Background Map Layer */}
      <MapDisplay />

      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none z-[1000] p-4 md:p-6 flex justify-between">
        {/* Left column */}
        <div className="hidden md:flex flex-col gap-4 w-80 pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-md shadow-[var(--shadow-lg)] rounded-[14px] p-5 border border-white/60">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent leading-tight">
              AnTi Flood
            </h1>
            <p className="text-sm text-slate-600 mt-2">
              Hệ thống giám sát ngập lụt
            </p>
          </div>
          <Legend />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 w-72 pointer-events-auto items-end">
          <LayerControl />

          <div className="mt-auto pointer-events-auto group">
            <button className="ui-btn ui-btn-danger ui-btn-lg rounded-full px-6 shadow-[var(--shadow-lg)]">
              <PhoneCall size={20} className="animate-pulse" />
              <span>SĐT Khẩn cấp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
