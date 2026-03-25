import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Droplets, CloudRain, TriangleAlert, LifeBuoy } from 'lucide-react';
import { useMapStore } from '../../store/useMapStore';
import { waterLevelStations, rainfallStations, warningTowers } from '../../data/mockData';
import MarkerPopup from './MarkerPopup';
import { getRescueRequests } from '../../services/api';

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
    case 'critical': return 'bg-red-500';
    case 'warning': return 'bg-orange-500';
    case 'elevated': return 'bg-blue-500';
    default: return 'bg-emerald-500';
  }
};

const MapDisplay = () => {
  const { activeLayers, mapCenter, mapZoom } = useMapStore();
  const [timestamp, setTimestamp] = useState(Date.now());
  const [activeMarkerId, setActiveMarkerId] = useState(null);
  const [flyToTarget, setFlyToTarget] = useState(null);
  const [rescueRequests, setRescueRequests] = useState([]);

  useEffect(() => {
    if (activeLayers.rescueRequests) {
      getRescueRequests().then(data => setRescueRequests(data)).catch(err => console.error("Failed to fetch rescue requests", err));
    }
  }, [activeLayers.rescueRequests]);

  useEffect(() => {
    const interval = setInterval(() => setTimestamp(Date.now()), 5000);
    return () => clearInterval(interval);
  }, []);

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

        {activeLayers.waterLevel && waterLevelStations.map((station) => {
          const simulatedValue = (station.value + Math.sin(timestamp / 1000 + Number(station.id.split('-')[1])) * 5).toFixed(1);
          const isActive = activeMarkerId === station.id;
          
          return (
            <Marker 
              key={station.id} 
              position={station.coordinates}
              icon={createCustomIcon(<Droplets size={isActive ? 20 : 16} />, getWaterLevelColor(station.status), isActive)}
              eventHandlers={{ click: () => handleMarkerClick(station) }}
            >
              <Popup 
                className="custom-popup border-0 bg-transparent m-0 p-0"
                onClose={() => setActiveMarkerId(null)}
              >
                <div data-test-id={`map-marker-waterLevel-${station.id}`}>
                  <MarkerPopup data={{...station, value: simulatedValue}} />
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
