import React from 'react';

const legendItems = [
  { label: '> 75cm (Nguy hiểm)', color: 'bg-red-500' },
  { label: '> 50cm (Cảnh báo)', color: 'bg-orange-500' },
  { label: '> 25cm (Báo động)', color: 'bg-blue-500' },
  { label: '< 25cm (An toàn)', color: 'bg-emerald-500' },
];

const Legend = () => {
  return (
    <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-5 border border-white/50" data-test-id="map-legend">
      <h3 className="text-sm font-bold tracking-tight text-slate-800 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
        <span>Chú thích bản đồ</span>
      </h3>
      
      <div className="space-y-5">
        <div>
          <h4 className="text-[11px] text-slate-400 uppercase font-black mb-3 tracking-widest">Trạm Mực nước</h4>
          <ul className="space-y-3">
            {legendItems.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <span className={`w-3.5 h-3.5 rounded-full ${item.color} shadow-sm border border-black/5`}></span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pt-4 border-t border-slate-100/80">
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <span className="w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs shadow-md shadow-indigo-500/30 font-bold border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A5.85 5.85 0 0 1 8.5 7.502h.1A6.29 6.29 0 0 1 20 8.5c0 1.25-.461 2.39-1.22 3.284"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>
              </span>
              Trạm lượng mưa
            </li>
            <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <span className="w-7 h-7 rounded-full bg-red-600 animate-[pulse_1.5s_ease-in-out_infinite] text-white flex items-center justify-center text-xs shadow-md shadow-red-600/30 font-bold border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              </span>
              Tháp cảnh báo (Kích hoạt)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Legend;
