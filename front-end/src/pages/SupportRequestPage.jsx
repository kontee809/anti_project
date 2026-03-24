import React from 'react';
import MapDisplay from '../components/Map/MapDisplay';
import { Upload, ShieldCheck } from 'lucide-react';

const SupportRequestPage = () => {
  return (
    <div className="relative w-full h-full">
      {/* Background Map layer, to keep consistency with the whole app vibe */}
      <div className="absolute inset-0 z-0">
        <MapDisplay />
      </div>

      {/* Form Overlay Container */}
      <div className="absolute inset-0 z-[1000] pointer-events-none p-6 flex justify-center lg:justify-start lg:pl-16 overflow-y-auto">
        
        {/* The Form Card */}
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl pointer-events-auto flex flex-col my-auto border border-slate-100 overflow-hidden">
          
          {/* Header */}
          <div className="bg-blue-600 text-white p-4">
            <h2 className="text-xl font-bold">Yêu cầu cứu trợ</h2>
          </div>

          <div className="p-6 space-y-5">

            <input 
              type="text" 
              placeholder="Họ và tên *" 
              className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
            />
            
            <input 
              type="tel" 
              placeholder="Số điện thoại *" 
              className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
            />

            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="addressType" defaultChecked className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-semibold text-slate-700">Tìm theo địa chỉ</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="addressType" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-semibold text-slate-700">Nhập địa chỉ thủ công</span>
              </label>
            </div>

            <select className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-medium">
              <option value="">Địa chỉ *</option>
              <option value="dn">Hòa Vang, Đà Nẵng</option>
            </select>

            <p className="text-xs font-semibold text-slate-600 leading-relaxed italic">
              Để giúp cho việc cứu trợ được nhanh hơn, hãy giúp chúng tôi chọn vị trí chính xác trên bản đồ <span className="text-red-500">*</span>
            </p>

            {/* Embedded Mini Map */}
            <div className="w-full h-48 rounded-xl border border-slate-200 overflow-hidden relative">
              {/* For simplicity we just use the MapDisplay without controls */}
              <div className="absolute inset-0 pointer-events-none brightness-110 contrast-125 saturate-50">
                <MapDisplay />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
                {/* Fake target crosshair */}
                <div className="w-4 h-4 rounded-full bg-blue-500/20 border-2 border-blue-600 animate-ping"></div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-2">Hình ảnh</h3>
              <button className="w-16 h-16 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                <Upload size={24} />
              </button>
            </div>

            {/* reCAPTCHA Placeholder */}
            <div className="w-64 h-16 bg-slate-50 border border-slate-200 rounded-lg flex items-center px-4 gap-3">
              <input type="checkbox" className="w-6 h-6 border-slate-300 rounded-sm" />
              <span className="text-sm font-medium text-slate-600">I'm not a robot</span>
              <ShieldCheck className="ml-auto text-slate-400" size={28} />
            </div>

            {/* Submit button */}
            <button className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider shadow-lg shadow-red-500/30 transition-all active:scale-[0.98]">
              Gửi yêu cầu khẩn cấp
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportRequestPage;
