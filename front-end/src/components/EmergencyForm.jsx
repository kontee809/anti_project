import React, { useState } from 'react';
import { AlertTriangle, User, Phone, MapPin, Upload, Navigation, CheckCircle } from 'lucide-react';

const QUICK_TAGS = ['Cần nước sạch', 'Cần lương thực', 'Cần y tế', 'Cần xuồng cứu hộ', 'Trẻ em/Người già'];

const EmergencyForm = ({ 
  formData, 
  handleInputChange, 
  handleSubmit, 
  isSubmitting, 
  addressMode, 
  setAddressMode,
  requestLocationFocus
}) => {
  const [toast, setToast] = useState(null);

  const handleTagClick = (tag) => {
    const current = formData.description;
    const separator = current.length > 0 && !current.endsWith(' ') ? ', ' : '';
    handleInputChange({
      target: { name: 'description', value: current + separator + tag }
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSubmit(e);
      setToast({ type: 'success', message: 'Gửi yêu cầu thành công!' });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Có lỗi xảy ra, vui lòng thử lại.' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="relative z-10 w-full lg:w-[450px] bg-white lg:rounded-2xl shadow-2xl flex flex-col h-full lg:h-auto lg:max-h-[calc(100vh-4rem)] overflow-hidden border border-slate-100">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-6 shrink-0 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-10 blur-[2px]">
          <AlertTriangle size={120} />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <AlertTriangle size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wide">Yêu cầu cứu trợ</h2>
            <p className="text-white/80 text-xs mt-1 font-medium">Hệ thống điều phối cứu hộ khẩn cấp</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {toast && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2 ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            {toast.message}
          </div>
        )}

        <form id="emergency-form" onSubmit={onSubmit} className="space-y-6">
          
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <User size={16} className="text-red-500" /> Thông tin liên hệ
            </h3>
            
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleInputChange} required
                  placeholder="Họ và tên *" 
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:ring-2 focus:ring-red-500 font-medium transition-all text-sm" 
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone size={18} className="text-slate-400" />
                </div>
                <input 
                  type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required
                  placeholder="Số điện thoại *" 
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:ring-2 focus:ring-red-500 font-medium transition-all text-sm" 
                />
              </div>
            </div>

            <label className="flex items-center gap-3 bg-red-50/50 p-3.5 rounded-xl border border-red-100 cursor-pointer hover:bg-red-50 transition-colors group">
              <div className="relative flex items-center justify-center">
                <input type="checkbox" name="isForSomeoneElse" checked={formData.isForSomeoneElse} onChange={handleInputChange} className="peer sr-only" />
                <div className="w-5 h-5 border-2 border-red-300 rounded bg-white peer-checked:bg-red-500 peer-checked:border-red-500 transition-all flex items-center justify-center">
                  <CheckCircle size={14} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-700 group-hover:text-red-700 transition">Tôi đặt hộ người khác</span>
                <span className="text-[11px] text-slate-500 font-medium">Đội cứu hộ sẽ ưu tiên liên hệ SDT trên</span>
              </div>
            </label>
          </div>

          <hr className="border-slate-100" />

          {/* Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" /> Tình trạng & Yêu cầu
            </h3>

            <div className="flex flex-wrap gap-2 mb-2">
              {QUICK_TAGS.map(tag => (
                <button
                  key={tag} type="button" onClick={() => handleTagClick(tag)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-[11px] font-bold rounded-lg border border-slate-200 hover:border-red-200 transition-colors active:scale-95"
                >
                  + {tag}
                </button>
              ))}
            </div>

            <div className="relative">
              <textarea 
                name="description" value={formData.description} onChange={handleInputChange} required
                placeholder="Mô tả chi tiết tình hình (mực nước, số người, nguy hiểm)... *"
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:ring-2 focus:ring-red-500 font-medium h-28 resize-none transition-all text-sm pb-8"
              />
              <div className="absolute bottom-3 right-4 text-xs font-bold text-slate-400">
                {formData.description.length} / 500
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Location */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <MapPin size={16} className="text-red-500" /> Vị trí cứu trợ
              </h3>
              
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  type="button" onClick={() => setAddressMode('map')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${addressMode === 'map' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Bản đồ
                </button>
                <button
                  type="button" onClick={() => setAddressMode('manual')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${addressMode === 'manual' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Nhập tay
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin size={18} className={addressMode === 'map' ? 'text-red-400' : 'text-slate-400'} />
              </div>
              <input 
                type="text" name="address" value={formData.address} onChange={handleInputChange}
                readOnly={addressMode === 'map'} required placeholder="Địa chỉ chi tiết *" 
                className={`w-full pl-11 pr-4 py-3.5 rounded-xl border outline-none font-medium transition-all text-sm ${addressMode === 'map' ? 'bg-red-50/50 border-red-100 text-red-900 focus:ring-0 cursor-not-allowed' : 'bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-red-500 text-slate-800'}`} 
              />
            </div>

            {addressMode === 'map' && (
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Chạm vào bản đồ để chọn vị trí chính xác của bạn.
                </span>
                <button 
                  type="button" onClick={requestLocationFocus}
                  className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 transition-colors"
                  title="Tìm vị trí của tôi"
                >
                  <Navigation size={16} />
                </button>
              </div>
            )}
          </div>

          {/* <div className="border-t border-slate-100 pt-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hình ảnh hiện trường (Tùy chọn)</h3>
            <button type="button" className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-red-300 transition-all flex flex-col items-center justify-center gap-2 group">
              <Upload size={24} className="text-slate-400 group-hover:text-red-500 transition-colors" />
              <span className="text-xs font-bold text-slate-500 group-hover:text-red-600">Tải ảnh lên (Hỗ trợ JPG, PNG)</span>
            </button>
          </div> */}
        </form>
      </div>

      {/* Footer Submit */}
      <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0">
        <button 
          form="emergency-form"
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-[0.98] text-white font-bold text-[15px] uppercase tracking-wider shadow-lg shadow-red-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Đang gửi...</span>
            </div>
          ) : 'Gửi yêu cầu khẩn cấp'}
        </button>
      </div>

    </div>
  );
};

export default EmergencyForm;
