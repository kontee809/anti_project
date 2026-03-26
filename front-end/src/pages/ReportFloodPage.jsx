import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFloodReport, getFloodReports, getPublicStations } from '../services/api';
import FloodReportMap from '../components/FloodReportMap';
import FloodReportForm from '../components/FloodReportForm';
import FloodSimulator from '../components/FloodSimulator';

const ReportFloodPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    floodLevelCm: 10,
    floodType: 'URBAN',
    description: '',
    durationEstimate: '',
    imageUrl: '',
    timestamp: '',
  });
  const [position, setPosition] = useState(null);
  const [addressMode, setAddressMode] = useState('map');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [floodReports, setFloodReports] = useState([]);
  const [stations, setStations] = useState([]);
  const [flyTarget, setFlyTarget] = useState(null);

  // Fetch current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latlng = [pos.coords.latitude, pos.coords.longitude];
          setPosition(latlng);
          setFlyTarget(latlng);
        },
        () => setPosition([16.047079, 108.206230])
      );
    } else {
      setPosition([16.047079, 108.206230]);
    }
  }, []);

  // Fetch flood reports and stations
  const fetchOverlays = useCallback(async () => {
    try {
      const [reports, stns] = await Promise.all([
        getFloodReports().catch(() => []),
        getPublicStations().catch(() => []),
      ]);
      setFloodReports(reports);
      setStations(stns);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    fetchOverlays();
    const intv = setInterval(fetchOverlays, 8000); // Refresh every 8s
    return () => clearInterval(intv);
  }, [fetchOverlays]);

  const handleSetAddress = useCallback((addr) => {
    setFormData(prev => ({ ...prev, address: addr }));
  }, []);

  const handleSetPosition = useCallback((pos) => {
    setPosition(pos);
  }, []);

  const handleLocationFocus = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const latlng = [pos.coords.latitude, pos.coords.longitude];
        setPosition(latlng);
        setFlyTarget(latlng);
      });
    }
  };

  const handleSubmit = async (data) => {
    if (!position && addressMode === 'map') {
      throw new Error('Vui lòng chọn vị trí trên bản đồ.');
    }
    setIsSubmitting(true);
    try {
      await createFloodReport({
        ...data,
        latitude: position ? position[0] : 0,
        longitude: position ? position[1] : 0,
      });
      // Reset form
      setFormData({
        address: '',
        floodLevelCm: 10,
        floodType: 'URBAN',
        description: '',
        durationEstimate: '',
        imageUrl: '',
        timestamp: '',
      });
      fetchOverlays();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-100 flex pt-16" data-test-id="report-page">
      
      {/* Fullscreen Map */}
      <FloodReportMap
        position={position}
        setPosition={handleSetPosition}
        setAddress={handleSetAddress}
        floodReports={floodReports}
        stations={stations}
        flyTarget={flyTarget}
      />

      {/* Floating Panel */}
      <div className="pointer-events-none absolute inset-0 z-10 px-0 lg:px-6 lg:pl-10 pt-20 pb-4 flex justify-center lg:justify-start items-end lg:items-center">
        <div className="pointer-events-auto w-full lg:w-auto h-full lg:h-auto mt-auto lg:mt-0 max-h-[90vh]">
          <FloodReportForm
            formData={formData}
            setFormData={setFormData}
            addressMode={addressMode}
            setAddressMode={setAddressMode}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            requestLocationFocus={handleLocationFocus}
          />
        </div>
      </div>

      {/* DEV Simulator (ADMIN only, bottom-right) */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-auto">
        <FloodSimulator position={position} onReportCreated={fetchOverlays} />
      </div>
    </div>
  );
};

export default ReportFloodPage;
