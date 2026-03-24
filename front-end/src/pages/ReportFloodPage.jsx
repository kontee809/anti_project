import React, { useState } from 'react';
import MapDisplay from '../components/Map/MapDisplay';
import { Upload, ShieldCheck } from 'lucide-react';

const ReportFloodPage = () => {
  const [activeTab, setActiveTab] = useState('Điểm ngập');
  const tabs = ['Điểm ngập', 'Đường ngập', 'Cây ngã đổ', 'Khu vực sạt lở'];

  return (
    <div className="relative w-full h-full" data-test-id="report-page">
      <div className="absolute inset-0 z-0">
        <MapDisplay />
      </div>

      <div className="absolute inset-0 z-[1000] pointer-events-none p-6 flex justify-center lg:justify-start lg:pl-16 overflow-y-auto">
        
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl pointer-events-auto flex flex-col my-auto border border-slate-100 overflow-hidden" data-test-id="report-form-container">
          
          <div className="bg-blue-600 text-white p-4">
            <h2 className="text-xl font-bold">Gửi thông tin ngập</h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-wrap gap-2" data-test-id="report-tabs">
              {tabs.map((tab, idx) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  data-test-id={`report-tab-${idx}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div>
              <select className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-medium" data-test-id="report-select-address">
                <option value="">Địa chỉ điểm ngập *</option>
                <option value="dn" data-test-id="report-option-dn">123 Trần Phú, Hải Châu, Đà Nẵng</option>
              </select>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-800 mb-3">Mức ngập</h3>
              
              <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                <div>
                  <label className="block text-xs text-slate-500 font-semibold mb-1">Chọn kiểu ngập *</label>
                  <select className="w-full p-2.5 rounded-lg bg-white border border-slate-200 outline-none focus:border-blue-500 font-medium" data-test-id="report-select-type">
                    <option data-test-id="report-option-indoor">Trong nhà</option>
                    <option data-test-id="report-option-outdoor">Ngoài đường</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-slate-500 font-semibold mb-1">Mức ngập (cm) *</label>
                  <input type="number" defaultValue={10} className="w-full p-2.5 rounded-lg bg-white border border-slate-200 outline-none focus:border-blue-500 font-medium" data-test-id="report-input-level" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 font-semibold mb-1">Thời gian ngập *</label>
              <input type="datetime-local" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 outline-none font-medium" defaultValue="2026-03-24T13:18" data-test-id="report-input-time" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-2">Hình ảnh</h3>
              <button type="button" className="w-16 h-16 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 transition-colors" data-test-id="report-button-upload">
                <Upload size={24} />
              </button>
            </div>

            <div>
              <h3 className="text-sm font-bold text-red-600 mb-1">Thường xuyên ngập</h3>
              <label className="flex items-start gap-3 cursor-pointer" data-test-id="report-label-frequent">
                <p className="text-xs text-slate-500 flex-1 leading-relaxed">
                  Địa điểm thường xuyên xảy ra tình trạng ngập, gây khó khăn trong các hoạt động giao thông và sinh hoạt của người dân
                </p>
                <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" data-test-id="report-checkbox-frequent" />
              </label>
            </div>

            <div className="w-64 h-16 bg-slate-50 border border-slate-200 rounded-lg flex items-center px-4 gap-3">
              <input type="checkbox" className="w-6 h-6 border-slate-300 rounded-sm" data-test-id="report-checkbox-captcha" />
              <span className="text-sm font-medium text-slate-600">I'm not a robot</span>
              <ShieldCheck className="ml-auto text-slate-400" size={28} />
            </div>

            <button type="button" className="w-full py-3.5 rounded-xl bg-slate-200 text-slate-500 font-bold uppercase tracking-wider cursor-not-allowed hover:bg-slate-300 transition-colors" data-test-id="report-button-submit">
              Gửi thông tin
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportFloodPage;
