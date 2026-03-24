import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Droplets, CloudRain, TriangleAlert } from 'lucide-react';
import { useMapStore } from '../../store/useMapStore';
import { waterLevelStations, rainfallStations, warningTowers } from '../../data/mockData';
import MarkerPopup from './MarkerPopup';

// Hook-based component to programmatically control Leaflet's map view
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

  // Optional real-time simulation update
  useEffect(() => {
    const interval = setInterval(() => setTimestamp(Date.now()), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkerClick = (station) => {
    setActiveMarkerId(station.id);
    setFlyToTarget(station.coordinates);
  };

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={mapZoom} 
      zoomControl={false}
      className="w-full h-full !bg-blue-50/50"
      onClick={() => setActiveMarkerId(null)}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <ZoomControl position="bottomleft" />
      
      <MapController targetCoord={flyToTarget} zoomLevel={14} />

      {/* Water Level Layer */}
      {activeLayers.waterLevel && waterLevelStations.map((station) => {
        const simulatedValue = (station.value + Math.sin(timestamp / 1000 + Number(station.id.split('-')[1])) * 5).toFixed(1);
        const isActive = activeMarkerId === station.id;
        
        return (
          <Marker 
            key={station.id} 
            position={station.coordinates}
            icon={createCustomIcon(<Droplets size={isActive ? 20 : 16} />, getWaterLevelColor(station.status), isActive)}
            eventHandlers={{
              click: () => handleMarkerClick(station)
            }}
          >
            <Popup 
              className="custom-popup border-0 bg-transparent m-0 p-0"
              onClose={() => setActiveMarkerId(null)}
            >
              <MarkerPopup data={{...station, value: simulatedValue}} />
            </Popup>
          </Marker>
        );
      })}

      {/* Rainfall Layer */}
      {activeLayers.rainfall && rainfallStations.map((station) => {
        const isActive = activeMarkerId === station.id;
        
        return (
          <Marker 
            key={station.id} 
            position={station.coordinates}
            icon={createCustomIcon(<CloudRain size={isActive ? 20 : 16} />, 'bg-indigo-500', isActive)}
            eventHandlers={{
              click: () => handleMarkerClick(station)
            }}
          >
            <Popup 
              className="custom-popup border-0 bg-transparent m-0 p-0"
              onClose={() => setActiveMarkerId(null)}
            >
              <MarkerPopup data={station} />
            </Popup>
          </Marker>
        );
      })}

      {/* Warning Towers Layer */}
      {activeLayers.warnings && warningTowers.map((tower) => {
        if (!tower.active) return null;
        const isActive = activeMarkerId === tower.id;
        
        return (
          <Marker 
            key={tower.id} 
            position={tower.coordinates}
            icon={createCustomIcon(<TriangleAlert size={isActive ? 20 : 16} />, isActive ? 'bg-red-500' : 'bg-red-600 animate-[pulse_1.5s_ease-in-out_infinite]', isActive)}
            eventHandlers={{
              click: () => handleMarkerClick(tower)
            }}
          >
            <Popup 
              className="custom-popup border-0 bg-transparent m-0 p-0"
              onClose={() => setActiveMarkerId(null)}
            >
              <MarkerPopup data={tower} />
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapDisplay;
