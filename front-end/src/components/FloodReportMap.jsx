import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Droplets, AlertTriangle, Navigation } from 'lucide-react';

// Fix Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await response.json();
    return data?.display_name || '';
  } catch { return ''; }
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'CRITICAL': return 'bg-red-600';
    case 'HIGH': return 'bg-orange-500';
    case 'MEDIUM': return 'bg-yellow-500';
    case 'LOW': return 'bg-blue-500';
    default: return 'bg-slate-400';
  }
};

const getSeverityLabel = (severity) => {
  switch (severity) {
    case 'CRITICAL': return 'Nghiêm trọng';
    case 'HIGH': return 'Cao';
    case 'MEDIUM': return 'Trung bình';
    case 'LOW': return 'Thấp';
    default: return severity;
  }
};

const createFloodIcon = (severity) => {
  const bg = getSeverityColor(severity);
  return L.divIcon({
    html: renderToStaticMarkup(
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white text-white ${bg} ${severity === 'CRITICAL' ? 'animate-[pulse_1.5s_ease-in-out_infinite]' : ''}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
      </div>
    ),
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const MapClickHandler = ({ setPosition, setAddress }) => {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      const addr = await reverseGeocode(lat, lng);
      if (addr) setAddress(addr);
    },
  });
  return null;
};

const FlyToController = ({ target }) => {
  const map = useMap();
  const prevTarget = useRef(null);
  useEffect(() => {
    if (target && target !== prevTarget.current) {
      map.flyTo(target, 15, { duration: 0.8 });
      prevTarget.current = target;
    }
  }, [target, map]);
  return null;
};

const FloodReportMap = ({ 
  position, setPosition, setAddress, 
  floodReports = [], stations = [],
  flyTarget
}) => {
  return (
    <div className="absolute inset-0 z-0 h-full w-full">
      <MapContainer 
        center={position || [16.047, 108.206]} 
        zoom={13} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />

        <MapClickHandler setPosition={setPosition} setAddress={setAddress} />
        <FlyToController target={flyTarget} />

        {/* User's selected position */}
        {position && (
          <Marker position={position}>
            <Popup>
              <div className="text-sm font-semibold text-slate-700 p-1">📍 Vị trí bạn chọn</div>
            </Popup>
          </Marker>
        )}

        {/* Existing flood reports */}
        {floodReports.map(report => (
          <Marker 
            key={`flood-${report.id}`} 
            position={[report.latitude, report.longitude]}
            icon={createFloodIcon(report.severityLevel)}
          >
            <Popup>
              <div className="p-2 w-[240px]">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                  <div className={`p-1.5 rounded-lg text-white ${getSeverityColor(report.severityLevel)}`}>
                    <AlertTriangle size={14} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">Báo cáo ngập #{report.id}</div>
                    <div className={`text-[10px] font-bold uppercase ${getSeverityColor(report.severityLevel).replace('bg-', 'text-')}`}>{getSeverityLabel(report.severityLevel)}</div>
                  </div>
                </div>
                <div className="text-xs space-y-1.5 text-slate-600">
                  <p><span className="text-slate-400">Mức ngập:</span> <strong className="text-blue-600">{report.floodLevelCm} cm</strong></p>
                  <p><span className="text-slate-400">Loại:</span> <strong>{report.floodType}</strong></p>
                  <p><span className="text-slate-400">Độ tin cậy:</span> <strong>{report.reliabilityScore}%</strong></p>
                  <p><span className="text-slate-400">Thời gian:</span> <strong>{report.createdAt ? new Date(report.createdAt).toLocaleString('vi-VN') : 'N/A'}</strong></p>
                  {report.description && <p className="bg-slate-50 p-1.5 rounded text-slate-700 mt-1">{report.description}</p>}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Water stations overlay */}
        {stations.map(s => {
          const color = s.status === 'DANGER' ? 'bg-red-500' : s.status === 'WARNING' ? 'bg-orange-500' : s.status === 'NORMAL' ? 'bg-emerald-500' : 'bg-slate-400';
          const icon = L.divIcon({
            html: renderToStaticMarkup(
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow border-2 border-white text-white ${color}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
              </div>
            ),
            className: 'custom-leaflet-icon',
            iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -14],
          });
          return (
            <Marker key={`ws-${s.id}`} position={[s.latitude, s.longitude]} icon={icon}>
              <Popup>
                <div className="p-2 w-[200px] text-xs">
                  <div className="font-bold text-sm text-slate-800 mb-1">{s.name}</div>
                  <p><span className="text-slate-400">Mực nước:</span> <strong className="text-blue-600">{s.lastWaterLevel?.toFixed(2) ?? 'N/A'}m</strong></p>
                  <p><span className="text-slate-400">Trạng thái:</span> <strong>{s.status}</strong></p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Loading overlay */}
      {!position && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/80 gap-3 z-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <span className="text-sm font-semibold text-slate-500">Đang tải bản đồ...</span>
        </div>
      )}
    </div>
  );
};

export default FloodReportMap;
