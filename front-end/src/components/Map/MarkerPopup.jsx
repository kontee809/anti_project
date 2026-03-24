import React from 'react';

const MarkerPopup = ({ data }) => {
  const getHeaderStyle = () => {
    if (data.type === 'waterLevel') {
      if (data.status === 'critical') return 'bg-red-500';
      if (data.status === 'warning') return 'bg-orange-500';
      if (data.status === 'elevated') return 'bg-blue-500';
      return 'bg-emerald-500';
    }
    if (data.type === 'rainfall') return 'bg-indigo-500';
    return 'bg-red-600';
  };

  const getIcon = () => {
    if (data.type === 'waterLevel') return '💦';
    if (data.type === 'rainfall') return '🌧️';
    return '🚨';
  }

  return (
    <div className="w-64 bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-100" data-test-id="map-popup">
      <div className={`${getHeaderStyle()} text-white px-4 py-3 font-semibold flex items-center justify-between`}>
        <span className="truncate pr-2" title={data.name} data-test-id="map-popup-title">{data.name}</span>
        <span className="text-lg opacity-80" data-test-id="map-popup-icon">{getIcon()}</span>
      </div>
      <div className="p-4 space-y-4">
        {data.type !== 'warning' ? (
          <div className="flex justify-between items-end border-b border-slate-100 pb-3">
            <span className="text-slate-500 text-sm font-medium">Giá trị đo:</span>
            <span className="text-3xl font-bold bg-gradient-to-br from-slate-700 to-slate-900 bg-clip-text text-transparent" data-test-id="map-popup-value">
              {data.value} <span className="text-sm font-semibold text-slate-400">{data.unit}</span>
            </span>
          </div>
        ) : (
          <div className="text-sm font-medium text-rose-600 border-l-2 border-rose-500 pl-3 bg-rose-50 p-2 rounded-r-md" data-test-id="map-popup-message">
            {data.message}
          </div>
        )}
        
        <div className="flex justify-between items-center text-xs text-slate-400 font-medium bg-slate-50 px-3 py-2 rounded-md">
          <span>🕒 Cập nhật:</span>
          <span data-test-id="map-popup-time">{new Date(data.timestamp).toLocaleTimeString('vi-VN')}</span>
        </div>
      </div>
    </div>
  );
};

export default MarkerPopup;
