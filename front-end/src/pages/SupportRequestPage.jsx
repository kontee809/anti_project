import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRescueRequest } from '../services/api';
import MapSelector from '../components/MapSelector';
import EmergencyForm from '../components/EmergencyForm';

const SupportRequestPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    description: '',
    address: '',
    isForSomeoneElse: false,
  });
  const [position, setPosition] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressMode, setAddressMode] = useState('map');
  const [triggerFocus, setTriggerFocus] = useState(0);

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          setTriggerFocus(prev => prev + 1);
        },
        (error) => {
          console.error("Error getting location", error);
          if (!position) setPosition([16.047079, 108.206230]); // Default Da Nang
        }
      );
    } else {
      if (!position) setPosition([16.047079, 108.206230]);
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInitialAddressSet = useCallback((addr) => {
    setFormData(prev => ({ ...prev, address: addr }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLocationFocus = () => {
    fetchCurrentLocation();
  };

  const handleSubmit = async (e) => {
    if (!position && addressMode === 'map') {
      throw new Error("Vui lòng đợi tải vị trí trên bản đồ.");
    }
    if (!formData.address) {
      throw new Error("Vui lòng nhập hoặc chọn địa chỉ.");
    }
    
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        latitude: position ? position[0] : 0,
        longitude: position ? position[1] : 0,
        imageUrl: '',
      };
      await createRescueRequest(payload);
      navigate('/');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-100 flex items-center justify-start pt-16">
      
      {/* Absolute fullscreen map */}
      <MapSelector 
        position={position}
        setPosition={setPosition}
        setAddress={handleInitialAddressSet}
        triggerFocus={triggerFocus}
      />

      {/* Floating Panel Container */}
      <div className="pointer-events-none absolute inset-0 z-10 px-0 lg:px-6 lg:pl-10 pt-20 pb-4 flex justify-center lg:justify-start items-end lg:items-center">
        <div className="pointer-events-auto w-full lg:w-auto h-full lg:h-auto mt-auto lg:mt-0 max-h-[90vh]">
          <EmergencyForm 
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            addressMode={addressMode}
            setAddressMode={setAddressMode}
            requestLocationFocus={handleLocationFocus}
          />
        </div>
      </div>

    </div>
  );
};

export default SupportRequestPage;
