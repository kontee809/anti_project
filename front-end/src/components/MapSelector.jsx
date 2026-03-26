import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const reverseGeocode = async (lat, lng, setAddress) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await response.json();
    if (data && data.display_name) {
      setAddress(data.display_name);
    }
  } catch (error) {
    console.error("Geocoding failed", error);
  }
};

const MapEvents = ({ position, setPosition, setAddress }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      reverseGeocode(lat, lng, setAddress);
    },
  });
  return position ? <Marker position={position} /> : null;
};

const MapSelector = ({ position, setPosition, setAddress, triggerFocus }) => {
  const mapRef = useRef();

  useEffect(() => {
    if (position && mapRef.current) {
      mapRef.current.flyTo(position, 15);
    }
  }, [triggerFocus]); // Fly to position only when triggerFocus changes (manual focus request)

  return (
    <div className="absolute inset-0 z-0 h-full w-full" data-test-id="map-selector">
      {position ? (
        <MapContainer 
          center={position} 
          zoom={15} 
          style={{ width: '100%', height: '100%' }}
          ref={mapRef}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          />
          <MapEvents position={position} setPosition={setPosition} setAddress={setAddress} />
        </MapContainer>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 gap-3" data-test-id="map-selector-loading">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
          <span className="text-sm font-semibold text-slate-500">Đang tìm vị trí của bạn...</span>
        </div>
      )}
    </div>
  );
};

export default MapSelector;
