import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Upload, Navigation } from 'lucide-react';
import { createRescueRequest } from '../services/api';

// Fix for default Leaflet icon not showing up in React wrapper directly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
  const mapRef = useRef();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          reverseGeocode(latitude, longitude, (addr) => setFormData(prev => ({ ...prev, address: addr })));
        },
        (error) => {
          console.error("Error getting location", error);
          setPosition([16.047079, 108.206230]); // Default to Da Nang
        }
      );
    } else {
      setPosition([16.047079, 108.206230]);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) {
      alert("Vui lòng chọn hoặc đợi tải vị trí trên bản đồ.");
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        latitude: position[0],
        longitude: position[1],
        imageUrl: '',
      };
      await createRescueRequest(payload);
      alert("Gửi yêu cầu khẩn cấp thành công!");
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col pt-20 pb-10 px-4 overflow-y-auto items-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative z-10">
        <div className="bg-red-600 text-white p-5 text-center shadow-md">
          <h2 className="text-2xl font-bold uppercase tracking-wider">Yêu cầu cứu trợ khẩn cấp</h2>
          <p className="text-white/80 text-sm mt-1">Hệ thống sẽ ghi nhận và điều phối đội cứu hộ gần nhất</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Họ và tên *" 
              className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-red-500 font-medium transition-all" 
              data-test-id="support-input-name"
            />
            
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="Số điện thoại *" 
              className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-red-500 font-medium transition-all" 
              data-test-id="support-input-phone"
            />
          </div>

          <textarea 
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            placeholder="Nội dung yêu cầu cứu trợ (Ví dụ: Cần thuyền, nước sạch, thuốc men...) *"
            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-red-500 font-medium h-32 resize-none transition-all"
            data-test-id="support-input-description"
          />

          <div className="flex items-center gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
            <input 
              type="checkbox" 
              name="isForSomeoneElse"
              id="isForSomeoneElse"
              checked={formData.isForSomeoneElse}
              onChange={handleInputChange}
              className="w-5 h-5 text-red-600 border-red-300 rounded focus:ring-red-500 cursor-pointer" 
              data-test-id="support-checkbox-someone-else"
            />
            <div className="flex flex-col">
              <label htmlFor="isForSomeoneElse" className="text-sm font-bold text-red-800 cursor-pointer">
                Tôi đặt hộ người khác
              </label>
              <span className="text-xs text-red-600">Đội cứu hộ sẽ ưu tiên liên hệ số điện thoại trên</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
              <h3 className="font-bold text-slate-800">Vị trí cần cứu trợ <span className="text-red-500">*</span></h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                  <input type="radio" name="addressType" value="map" checked={addressMode === 'map'} onChange={() => setAddressMode('map')} className="w-4 h-4 text-red-600 focus:ring-red-500" />
                  <span className="text-sm font-semibold text-slate-700">Theo bản đồ</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                  <input type="radio" name="addressType" value="manual" checked={addressMode === 'manual'} onChange={() => setAddressMode('manual')} className="w-4 h-4 text-red-600 focus:ring-red-500" />
                  <span className="text-sm font-semibold text-slate-700">Nhập thủ công</span>
                </label>
              </div>
            </div>

            <input 
              type="text" 
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              readOnly={addressMode === 'map'}
              placeholder="Địa chỉ chi tiết *" 
              className={`w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-red-500 font-medium mb-4 transition-all ${addressMode === 'map' ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-white'}`} 
            />

            <div className="w-full h-[350px] rounded-xl border-2 border-slate-200 overflow-hidden relative shadow-inner">
              {position && (
                <MapContainer 
                  center={position} 
                  zoom={15} 
                  style={{ width: '100%', height: '100%' }}
                  ref={mapRef}
                  className="z-0"
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                  />
                  <MapEvents position={position} setPosition={setPosition} setAddress={handleInitialAddressSet} />
                </MapContainer>
              )}
              {!position && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 gap-3 z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  <span className="text-sm font-medium text-slate-500">Đang tìm vị trí của bạn...</span>
                </div>
              )}
              
              <button 
                type="button"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(pos => {
                      const latlng = [pos.coords.latitude, pos.coords.longitude];
                      setPosition(latlng);
                      if (mapRef.current) {
                        mapRef.current.flyTo(latlng, 15);
                      }
                      reverseGeocode(pos.coords.latitude, pos.coords.longitude, handleInitialAddressSet);
                    });
                  } else {
                    alert("Trình duyệt của bạn không hỗ trợ định vị.");
                  }
                }}
                className="absolute bottom-5 right-5 z-[1000] bg-white p-3 rounded-full shadow-xl border border-slate-200 text-slate-700 hover:text-red-600 hover:bg-red-50 transition-all active:scale-95 group"
                title="Về vị trí của tôi"
              >
                <Navigation size={22} className="group-hover:animate-pulse" />
              </button>
            </div>
            <p className="text-sm font-medium text-slate-500 mt-2 text-center">
              Chạm vào bất kỳ đâu trên bản đồ để cập nhật vị trí chính xác.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Hình ảnh hiện trường (Tuỳ chọn)</h3>
            <div className="flex gap-4">
              <button type="button" className="w-24 h-24 rounded-2xl bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 transition-colors">
                <Upload size={28} className="mb-2 text-slate-400" />
                <span className="text-xs font-bold">Tải ảnh lên</span>
              </button>
              <div className="flex-1 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-sm text-slate-400 px-4 text-center">
                Giúp đội cứu hộ đánh giá mức độ nghiêm trọng nhanh hơn. (Hỗ trợ JPG, PNG)
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-5 mt-6 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-[0.98] text-white font-bold text-lg uppercase tracking-wider shadow-lg shadow-red-500/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed border border-red-500"
            data-test-id="support-button-submit"
          >
            {isSubmitting ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu khẩn cấp ngay'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportRequestPage;
