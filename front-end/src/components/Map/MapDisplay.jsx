import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Droplets, CloudRain, TriangleAlert, LifeBuoy } from 'lucide-react';
import { useMapStore } from '../../store/useMapStore';
import { rainfallStations, warningTowers } from '../../data/mockData';
import MarkerPopup from './MarkerPopup';
import { getRescueRequests, getPublicStations } from '../../services/api';

const MapController = ({ targetCoord, zoomLevel }) => {
  const map = useMap();
  useEffect(() => {
    if (targetCoord) {
      map.flyTo(targetCoord, zoomLevel, { 
        duration: 1.2, 
        easeLinearity: 0.25 
      });
    }
  }, [targetCoord, zoomLevel, map]);
  return null;
};

const createCustomIcon = (iconElement, bgColorClass, isActive = false) => {
  return L.divIcon({
    html: renderToStaticMarkup(
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 transition-all duration-300 ${isActive ? 'border-yellow-400 scale-125 ring-4 ring-yellow-400/40 z-[1000] shadow-yellow-500/50' : 'border-white'} text-white ${bgColorClass}`}>
        {iconElement}
      </div>
    ),
    className: 'custom-leaflet-icon',
    iconSize: isActive ? [40, 40] : [32, 32],
    iconAnchor: isActive ? [20, 20] : [16, 16],
    popupAnchor: isActive ? [0, -20] : [0, -16],
  });
};

const getWaterLevelColor = (status) => {
  switch (status) {
    case 'DANGER': return 'bg-red-500';
    case 'WARNING': return 'bg-orange-500';
    case 'NORMAL': return 'bg-emerald-500';
    case 'OFFLINE': return 'bg-slate-500';
    default: return 'bg-emerald-500';
  }
};

const MapDisplay = () => {
  const { activeLayers, mapCenter, mapZoom } = useMapStore();
  const [activeMarkerId, setActiveMarkerId] = useState(null);
  const [flyToTarget, setFlyToTarget] = useState(null);
  const [rescueRequests, setRescueRequests] = useState([]);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    let intv;
    if (activeLayers.rescueRequests) {
      const fetchReqs = () => getRescueRequests().then(data => setRescueRequests(data)).catch(console.error);
      fetchReqs();
      intv = setInterval(fetchReqs, 10000);
    }
    return () => clearInterval(intv);
  }, [activeLayers.rescueRequests]);

  useEffect(() => {
    let intv;
    if (activeLayers.waterLevel) {
      const fetchStations = () => getPublicStations().then(data => setStations(data)).catch(console.error);
      fetchStations();
      intv = setInterval(fetchStations, 5000);
    }
    return () => clearInterval(intv);
  }, [activeLayers.waterLevel]);

  const handleMarkerClick = (station) => {
    setActiveMarkerId(station.id);
    setFlyToTarget(station.coordinates);
  };

  return (
    <div className="w-full h-full" data-test-id="map-container-wrapper">
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        zoomControl={false}
        className="w-full h-full !bg-blue-50/50"
        onClick={() => setActiveMarkerId(null)}
        data-test-id="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <ZoomControl position="bottomleft" />
        
        <MapController targetCoord={flyToTarget} zoomLevel={14} />

        {activeLayers.waterLevel && stations.map((station) => {
          const isActive = activeMarkerId === `station-${station.id}`;
          let pulseClass = station.status === 'DANGER' ? 'animate-[pulse_1.5s_ease-in-out_infinite]' : '';
          
          return (
            <Marker 
              key={`station-${station.id}`} 
              position={[station.latitude, station.longitude]}
              icon={createCustomIcon(<Droplets size={isActive ? 20 : 16} />, `${getWaterLevelColor(station.status)} ${pulseClass}`, isActive)}
              eventHandlers={{ click: () => {
                setActiveMarkerId(`station-${station.id}`);
                setFlyToTarget([station.latitude, station.longitude]);
              }}}
            >
              <Popup 
                className="custom-popup border-0 bg-transparent m-0 p-0"
                onClose={() => setActiveMarkerId(null)}
              >
                <div data-test-id={`map-marker-station-${station.id}`}>
                  <div className="bg-white rounded-xl shadow-2xl border border-slate-100 p-5 w-[280px]">
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-blue-100">
                      <div className={`p-1.5 text-white rounded-lg ${getWaterLevelColor(station.status)}`}>
                        <Droplets size={18} />
                      </div>
                      <h3 className="font-bold text-slate-800 text-base">{station.name}</h3>
                    </div>
                    <div className="text-sm space-y-2 text-slate-700">
                       <p className="flex justify-between items-center"><span className="text-slate-500 mb-0.5 block">Mức nước hiện tại:</span> <span className="font-black text-lg text-blue-600">{station.lastWaterLevel !== null ? station.lastWaterLevel.toFixed(2) + 'm' : 'N/A'}</span></p>
                       <p className="flex justify-between items-center"><span className="text-slate-500 mb-0.5 block">Cập nhật:</span> <span className="font-semibold">{station.lastUpdated ? new Date(station.lastUpdated).toLocaleTimeString('vi-VN') : 'N/A'}</span></p>
                       <div className="pt-2 border-t border-slate-50">
                         <span className="text-slate-500 block mb-1">Trạng thái:</span>
                         <div className={`p-2 rounded-lg font-bold text-center border uppercase tracking-wider ${
                            station.status === 'NORMAL' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            station.status === 'WARNING' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            station.status === 'DANGER' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                         }`}>{station.status}</div>
                       </div>
                       <a href={`/stations/${station.id}`} className="mt-3 block text-center w-full py-2 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition-colors">Xem lịch sử trạm</a>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {activeLayers.rainfall && rainfallStations.map((station) => {
          const isActive = activeMarkerId === station.id;
          
          return (
            <Marker 
              key={station.id} 
              position={station.coordinates}
              icon={createCustomIcon(<CloudRain size={isActive ? 20 : 16} />, 'bg-indigo-500', isActive)}
              eventHandlers={{ click: () => handleMarkerClick(station) }}
            >
              <Popup 
                className="custom-popup border-0 bg-transparent m-0 p-0"
                onClose={() => setActiveMarkerId(null)}
              >
                <div data-test-id={`map-marker-rainfall-${station.id}`}>
                  <MarkerPopup data={station} />
                </div>
              </Popup>
            </Marker>
          );
        })}

        {activeLayers.warnings && warningTowers.map((tower) => {
          if (!tower.active) return null;
          const isActive = activeMarkerId === tower.id;
          
          return (
            <Marker 
              key={tower.id} 
              position={tower.coordinates}
              icon={createCustomIcon(<TriangleAlert size={isActive ? 20 : 16} />, isActive ? 'bg-red-500' : 'bg-red-600 animate-[pulse_1.5s_ease-in-out_infinite]', isActive)}
              eventHandlers={{ click: () => handleMarkerClick(tower) }}
            >
              <Popup 
                className="custom-popup border-0 bg-transparent m-0 p-0"
                onClose={() => setActiveMarkerId(null)}
              >
                <div data-test-id={`map-marker-warnings-${tower.id}`}>
                  <MarkerPopup data={tower} />
                </div>
              </Popup>
            </Marker>
          );
        })}

        {activeLayers.rescueRequests && rescueRequests.map((request) => {
          if (request.status === 'CANCELLED') return null;
          
          const isActive = activeMarkerId === `rescue-${request.id}`;
          
          let iconColor = 'bg-slate-500';
          let pulseClass = '';
          if (request.status === 'PENDING') {
              iconColor = 'bg-red-600';
              pulseClass = 'animate-[pulse_1.5s_ease-in-out_infinite]';
          } else if (request.status === 'RECEIVED') {
              iconColor = 'bg-blue-500';
          } else if (request.status === 'IN_PROGRESS') {
              iconColor = 'bg-orange-500';
          } else if (request.status === 'COMPLETED') {
              iconColor = 'bg-green-500';
          }

          const finalClass = isActive ? iconColor.replace('600', '500') : `${iconColor} ${pulseClass}`;
          
          return (
            <Marker 
              key={`rescue-${request.id}`} 
              position={[request.latitude, request.longitude]}
              icon={createCustomIcon(<LifeBuoy size={isActive ? 20 : 16} />, finalClass, isActive)}
              eventHandlers={{ click: () => {
                setActiveMarkerId(`rescue-${request.id}`);
                setFlyToTarget([request.latitude, request.longitude]);
              }}}
            >
              <Popup 
                className="custom-popup border-0 bg-transparent m-0 p-0"
                onClose={() => setActiveMarkerId(null)}
              >
                <div data-test-id={`map-marker-rescue-${request.id}`}>
                  <div className="bg-white rounded-xl shadow-2xl border border-slate-100 p-5 w-[280px]">
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-red-100">
                      <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                        <LifeBuoy size={18} />
                      </div>
                      <h3 className="font-bold text-slate-800 text-base">Yêu cầu cứu trợ</h3>
                    </div>
                    <div className="text-sm space-y-2 text-slate-700">
                       <p className="flex justify-between items-center"><span className="text-slate-500 mb-0.5 block">Người liên hệ:</span> <span className="font-bold">{request.name}</span></p>
                       <p className="flex justify-between items-center"><span className="text-slate-500 mb-0.5 block">SĐT:</span> <span className="font-bold bg-slate-100 px-2 py-0.5 rounded text-blue-600">{request.phone}</span></p>
                       <div className="pt-2 border-t border-slate-50">
                         <span className="text-slate-500 block mb-1">Tình trạng khẩn cấp:</span>
                         <p className="bg-red-50 text-red-800 p-2 rounded-lg font-medium border border-red-100/50">{request.description}</p>
                       </div>
                       <div className="pt-2">
                         <span className="text-slate-500 font-medium">Trạng thái: </span>
                         <span className="font-bold text-slate-700">{
                            request.status === 'PENDING' ? 'Mới gửi' :
                            request.status === 'RECEIVED' ? 'Đã tiếp nhận' :
                            request.status === 'IN_PROGRESS' ? 'Đang xử lý' :
                            request.status === 'COMPLETED' ? 'Đã xong' : request.status
                         }</span>
                       </div>
                       {request.isForSomeoneElse && <p className="text-xs text-rose-500 font-bold mt-2 flex items-center gap-1">* <span className="underline">Lưu ý:</span> Đặt hộ người khác</p>}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapDisplay;
