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
      <div className="absolute inset-0 pointer-events-none z-[1000] p-6 flex justify-between">
        {/* Left column */}
        <div className="flex flex-col gap-4 w-80 pointer-events-auto">
          <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-5 border border-white/50">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent leading-tight">
              Thủy Phổ Minh
            </h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">
              Hệ thống giám sát ngập lụt 
            </p>
          </div>
          <Legend />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 w-80 pointer-events-auto items-end">
          <LayerControl />
          
          <div className="mt-auto pointer-events-auto group">
            <button className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white px-6 py-4 rounded-full shadow-lg shadow-red-500/40 transition-all duration-300 active:scale-95 font-semibold text-lg hover:shadow-red-500/60 ring-2 ring-white/20">
              <PhoneCall size={22} className="animate-pulse" />
              <span>SĐT Khẩn cấp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
