import React, { useState, useMemo } from 'react';
import { MapPin, Droplets, Clock, Upload, AlertTriangle, CheckCircle, Navigation, CloudRain } from 'lucide-react';

const QUICK_TAGS = ['Cống tắc', 'Mưa lớn', 'Triều cường', 'Sạt lở', 'Đường ngập sâu'];
const FLOOD_TYPES = [
  { value: 'URBAN', label: 'Ngập đô thị' },
  { value: 'RIVER', label: 'Ngập sông' },
  { value: 'FLASH_FLOOD', label: 'Lũ quét' },
];
const SOURCE_TABS = [
  { key: 'USER', label: 'Báo cáo', icon: <MapPin size={14} /> },
  { key: 'SENSOR', label: 'Cảm biến', icon: <Droplets size={14} /> },
  { key: 'SYSTEM', label: 'AI', icon: <CloudRain size={14} /> },
];
const CATEGORY_TABS = ['Điểm ngập', 'Đường ngập', 'Cảnh báo'];

const getSeverityFromLevel = (cm) => {
  if (cm > 100) return { label: 'Nghiêm trọng', color: 'bg-red-500 text-white', key: 'CRITICAL' };
  if (cm > 50) return { label: 'Cao', color: 'bg-orange-500 text-white', key: 'HIGH' };
  if (cm >= 20) return { label: 'Trung bình', color: 'bg-yellow-400 text-yellow-900', key: 'MEDIUM' };
  return { label: 'Thấp', color: 'bg-blue-400 text-white', key: 'LOW' };
};

const FloodReportForm = ({
  formData, setFormData,
  addressMode, setAddressMode,
  onSubmit, isSubmitting,
  requestLocationFocus
}) => {
  const [toast, setToast] = useState(null);
  const [source, setSource] = useState('USER');
  const [category, setCategory] = useState('Điểm ngập');

  const severity = useMemo(() => getSeverityFromLevel(formData.floodLevelCm || 0), [formData.floodLevelCm]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagClick = (tag) => {
    const curr = formData.description || '';
    const sep = curr.length > 0 && !curr.endsWith(' ') ? ', ' : '';
    handleChange('description', curr + sep + tag);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({ ...formData, reportedBy: source });
      setToast({ type: 'success', msg: 'Gửi báo cáo ngập thành công!' });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', msg: err.message || 'Có lỗi xảy ra.' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="relative z-10 w-full lg:w-[450px] bg-white lg:rounded-2xl shadow-2xl flex flex-col h-full lg:h-auto lg:max-h-[calc(100vh-5rem)] overflow-hidden border border-slate-100">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-5 shrink-0 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 opacity-10">
          <Droplets size={120} />
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <CloudRain size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-wide">Gửi thông tin ngập</h2>
            <p className="text-white/70 text-xs mt-0.5 font-medium">Hệ thống giám sát thông minh</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        
        {toast && (
          <div className={`p-3 rounded-xl flex items-center gap-2 text-sm font-bold ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            {toast.msg}
          </div>
        )}

        {/* Source Tabs */}
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
          {SOURCE_TABS.map(t => (
            <button key={t.key} type="button" onClick={() => setSource(t.key)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${source === t.key ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORY_TABS.map(tab => (
            <button key={tab} type="button" onClick={() => setCategory(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${category === tab ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <form id="flood-report-form" onSubmit={handleSubmit} className="space-y-5">
          
          {/* Location Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={14} className="text-blue-500" /> Vị trí
              </h3>
              <div className="flex bg-slate-100 p-0.5 rounded-lg">
                <button type="button" onClick={() => setAddressMode('map')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${addressMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >Bản đồ</button>
                <button type="button" onClick={() => setAddressMode('manual')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${addressMode === 'manual' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >Nhập tay</button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <MapPin size={16} className="text-slate-400" />
              </div>
              <input type="text" value={formData.address || ''} 
                onChange={(e) => handleChange('address', e.target.value)}
                readOnly={addressMode === 'map'} required
                placeholder="Địa chỉ điểm ngập *"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none font-medium text-sm transition-all ${addressMode === 'map' ? 'bg-blue-50/50 border-blue-100 text-blue-900 cursor-not-allowed' : 'bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500'}`}
              />
            </div>

            {addressMode === 'map' && (
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium">Chạm vào bản đồ để chọn vị trí.</span>
                <button type="button" onClick={requestLocationFocus}
                  className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-600 hover:text-blue-600 transition"
                  title="Vị trí của tôi"
                ><Navigation size={14} /></button>
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Flood Level Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Droplets size={14} className="text-blue-500" /> Mức ngập
            </h3>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
              <div>
                <label className="block text-[11px] text-slate-500 font-bold mb-1">Loại ngập *</label>
                <select value={formData.floodType || 'URBAN'} onChange={(e) => handleChange('floodType', e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                >
                  {FLOOD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-[11px] text-slate-500 font-bold mb-1">Mức ngập (cm) *</label>
                <div className="flex items-center gap-3">
                  <input type="number" min="0" max="500" value={formData.floodLevelCm || ''} 
                    onChange={(e) => handleChange('floodLevelCm', parseInt(e.target.value) || 0)} required
                    placeholder="0"
                    className="flex-1 p-2.5 rounded-lg bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                  />
                  <span className={`px-3 py-2 rounded-lg text-xs font-bold ${severity.color} transition-all shrink-0`}>
                    {severity.label}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 font-bold mb-1 flex items-center gap-1"><Clock size={12} /> Thời gian ngập</label>
                <input type="datetime-local" value={formData.timestamp || ''} 
                  onChange={(e) => handleChange('timestamp', e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-blue-500" /> Mô tả
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {QUICK_TAGS.map(tag => (
                <button key={tag} type="button" onClick={() => handleTagClick(tag)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-[11px] font-bold rounded-lg border border-slate-200 hover:border-blue-200 transition-colors active:scale-95"
                >+ {tag}</button>
              ))}
            </div>

            <div className="relative">
              <textarea value={formData.description || ''} onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Mô tả tình trạng ngập (giao thông, nhà dân, độ sâu...)"
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium h-24 resize-none text-sm pb-8 transition-all"
              />
              <div className="absolute bottom-3 right-3.5 text-[11px] font-bold text-slate-400">
                {(formData.description || '').length} / 500
              </div>
            </div>
          </div>

          {/* Image */}
          <div>
            <button type="button" className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-blue-300 transition-all flex items-center justify-center gap-2 group">
              <Upload size={18} className="text-slate-400 group-hover:text-blue-500 transition" />
              <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600">Tải ảnh hiện trường (tùy chọn)</span>
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="p-5 bg-slate-50 border-t border-slate-100 shrink-0">
        <button form="flood-report-form" type="submit" disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 active:scale-[0.98] text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Đang gửi...</span>
            </div>
          ) : 'Gửi thông tin ngập'}
        </button>
      </div>
    </div>
  );
};

export default FloodReportForm;
