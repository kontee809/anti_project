import React, { useState, useEffect } from 'react';
import { getAdminRainfallStations, createRainfallStation, updateRainfallStation, deleteRainfallStation, simulateRainfall, stopRainfallSimulation } from '../services/api';
import { Plus, Edit, Trash2, X, CloudRain, Zap, Battery, Signal, Play, Square, Activity } from 'lucide-react';

const INTENSITY_CONFIG = {
  LIGHT: { label: 'Nhẹ', bg: 'bg-blue-100 text-blue-700' },
  MODERATE: { label: 'Vừa', bg: 'bg-yellow-100 text-yellow-700' },
  HEAVY: { label: 'Nặng', bg: 'bg-orange-100 text-orange-700' },
  EXTREME: { label: 'Cực đoan', bg: 'bg-red-100 text-red-700' },
};

const STATUS_CONFIG = {
  ACTIVE: { label: 'Hoạt động', bg: 'bg-emerald-100 text-emerald-700' },
  INACTIVE: { label: 'Không hoạt động', bg: 'bg-slate-100 text-slate-600' },
  MAINTENANCE: { label: 'Bảo trì', bg: 'bg-amber-100 text-amber-700' },
};

const RainfallManagementPage = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterIntensity, setFilterIntensity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [simRunning, setSimRunning] = useState({});
  const [formData, setFormData] = useState({
    id: null, name: '', latitude: '', longitude: '', address: '',
    thresholdWarning: 7.6, thresholdDanger: 50, thresholdExtreme: 100
  });

  const fetchStations = async () => {
    try {
      const data = await getAdminRainfallStations();
      setStations(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchStations();
    const intv = setInterval(fetchStations, 5000);
    return () => clearInterval(intv);
  }, []);

  const filtered = stations.filter(s => {
    if (search && !s.name?.toLowerCase().includes(search.toLowerCase()) && !s.address?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterIntensity && s.intensity !== filterIntensity) return false;
    if (filterStatus && s.status !== filterStatus) return false;
    return true;
  });

  const handleOpenModal = (station = null) => {
    if (station) {
      setFormData({ ...station });
    } else {
      setFormData({ id: null, name: '', latitude: '', longitude: '', address: '', thresholdWarning: 7.6, thresholdDanger: 50, thresholdExtreme: 100 });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await updateRainfallStation(formData.id, formData);
      } else {
        await createRainfallStation(formData);
      }
      setShowModal(false);
      fetchStations();
    } catch (err) { alert('Lỗi: ' + err.message); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xóa trạm mưa này?')) {
      try { await deleteRainfallStation(id); fetchStations(); }
      catch (err) { alert('Lỗi: ' + err.message); }
    }
  };

  const handleSimulate = async (stationId, mode) => {
    try {
      await simulateRainfall({ stationId, mode, duration: 120 });
      setSimRunning(prev => ({ ...prev, [stationId]: true }));
    } catch (err) { alert('Lỗi: ' + err.message); }
  };

  const handleStopSim = async (stationId) => {
    try {
      await stopRainfallSimulation(stationId);
      setSimRunning(prev => ({ ...prev, [stationId]: false }));
    } catch (err) { alert('Lỗi: ' + err.message); }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6" data-test-id="rainfall-mgmt-page">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Quản lý Trạm Đo Mưa</h1>
          <p className="text-slate-500 mt-1 font-medium">Giám sát dữ liệu lượng mưa thời gian thực</p>
        </div>
        <button onClick={() => handleOpenModal()} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20" data-test-id="rainfall-btn-add">
          <Plus size={18} /> Thêm trạm mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên, địa chỉ..."
          className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
          data-test-id="rainfall-input-search"
        />
        <select value={filterIntensity} onChange={(e) => setFilterIntensity(e.target.value)}
          className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-sm font-medium outline-none"
          data-test-id="rainfall-select-intensity"
        >
          <option value="">Tất cả cường độ</option>
          <option value="LIGHT">Nhẹ</option>
          <option value="MODERATE">Vừa</option>
          <option value="HEAVY">Nặng</option>
          <option value="EXTREME">Cực đoan</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-sm font-medium outline-none"
          data-test-id="rainfall-select-status"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="INACTIVE">Không hoạt động</option>
          <option value="MAINTENANCE">Bảo trì</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left" data-test-id="rainfall-table">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Mã</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Tên & Vị trí</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Lượng mưa (mm)</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Cường độ</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Pin / Tín hiệu</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Trạng thái</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Cập nhật</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="p-8 text-center text-slate-500">Đang tải...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="8" className="p-8 text-center text-slate-400">Không có trạm nào.</td></tr>
              ) : filtered.map(s => {
                const int = INTENSITY_CONFIG[s.intensity] || INTENSITY_CONFIG.LIGHT;
                const stat = STATUS_CONFIG[s.status] || STATUS_CONFIG.INACTIVE;
                return (
                  <tr key={s.id} className={`border-b border-slate-50 hover:bg-slate-50 transition ${s.intensity === 'EXTREME' ? 'bg-red-50/30' : ''}`} data-test-id={`rainfall-row-${s.id}`}>
                    <td className="p-4 font-bold text-slate-700 text-sm">RF-{s.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-sm">{s.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{s.address || `${s.latitude?.toFixed(4)}, ${s.longitude?.toFixed(4)}`}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span><span className="text-slate-400">Hiện tại:</span> <strong className="text-indigo-600 text-sm">{s.rainfallCurrent?.toFixed(1) ?? '0.0'}</strong></span>
                        <span><span className="text-slate-400">1h:</span> <strong>{s.rainfall1h?.toFixed(1) ?? '0.0'}</strong></span>
                        <span><span className="text-slate-400">24h:</span> <strong>{s.rainfall24h?.toFixed(1) ?? '0.0'}</strong></span>
                      </div>
                    </td>
                    <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${int.bg}`}>{int.label}</span></td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1" title="Pin"><Battery size={14} className={s.batteryLevel < 20 ? 'text-red-500' : 'text-emerald-500'} /> {s.batteryLevel ?? '-'}%</span>
                        <span className="flex items-center gap-1" title="Tín hiệu"><Signal size={14} className={s.signalStrength < 30 ? 'text-red-500' : 'text-emerald-500'} /> {s.signalStrength ?? '-'}%</span>
                      </div>
                    </td>
                    <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${stat.bg}`}>{stat.label}</span></td>
                    <td className="p-4 text-xs text-slate-500 whitespace-nowrap">{s.lastUpdated ? new Date(s.lastUpdated).toLocaleString('vi-VN') : 'Chưa có'}</td>
                    <td className="p-4">
                      <div className="flex gap-1.5 justify-end">
                        {!simRunning[s.id] ? (
                          <>
                            <button onClick={() => handleSimulate(s.id, 'STORM')} className="p-1.5 text-cyan-500 hover:bg-cyan-50 rounded-lg transition" title="Simulate Storm" data-test-id={`rainfall-btn-sim-storm-${s.id}`}><Play size={16} /></button>
                            <button onClick={() => handleSimulate(s.id, 'RANDOM')} className="p-1.5 text-indigo-400 hover:bg-indigo-50 rounded-lg transition" title="Simulate Random" data-test-id={`rainfall-btn-sim-random-${s.id}`}><Zap size={16} /></button>
                          </>
                        ) : (
                          <button onClick={() => handleStopSim(s.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition animate-pulse" title="Stop" data-test-id={`rainfall-btn-sim-stop-${s.id}`}><Square size={16} fill="currentColor" /></button>
                        )}
                        <button onClick={() => handleOpenModal(s)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Sửa" data-test-id={`rainfall-btn-edit-${s.id}`}><Edit size={16} /></button>
                        <button onClick={() => handleDelete(s.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition" title="Xóa" data-test-id={`rainfall-btn-delete-${s.id}`}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[3000] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" data-test-id="rainfall-modal">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">{formData.id ? 'Sửa trạm đo mưa' : 'Thêm trạm đo mưa'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600" data-test-id="rainfall-modal-btn-close"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4" data-test-id="form-rainfall">
              <div><label className="text-sm font-semibold text-slate-700">Tên trạm</label><input required className="w-full mt-1 p-3 border rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} data-test-id="form-rainfall-input-name" /></div>
              <div><label className="text-sm font-semibold text-slate-700">Địa chỉ</label><input className="w-full mt-1 p-3 border rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500" value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} data-test-id="form-rainfall-input-address" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-semibold text-slate-700">Vĩ độ</label><input type="number" step="any" required className="w-full mt-1 p-3 border rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500" value={formData.latitude} onChange={e => setFormData({ ...formData, latitude: e.target.value })} data-test-id="form-rainfall-input-lat" /></div>
                <div><label className="text-sm font-semibold text-slate-700">Kinh độ</label><input type="number" step="any" required className="w-full mt-1 p-3 border rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500" value={formData.longitude} onChange={e => setFormData({ ...formData, longitude: e.target.value })} data-test-id="form-rainfall-input-lng" /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs font-bold text-yellow-600">Cảnh báo (mm/h)</label><input type="number" step="any" required className="w-full mt-1 p-2.5 border border-yellow-200 bg-yellow-50 rounded-xl font-bold text-yellow-700 outline-none text-sm" value={formData.thresholdWarning} onChange={e => setFormData({ ...formData, thresholdWarning: e.target.value })} /></div>
                <div><label className="text-xs font-bold text-orange-600">Nguy hiểm</label><input type="number" step="any" required className="w-full mt-1 p-2.5 border border-orange-200 bg-orange-50 rounded-xl font-bold text-orange-700 outline-none text-sm" value={formData.thresholdDanger} onChange={e => setFormData({ ...formData, thresholdDanger: e.target.value })} /></div>
                <div><label className="text-xs font-bold text-red-600">Cực đoan</label><input type="number" step="any" required className="w-full mt-1 p-2.5 border border-red-200 bg-red-50 rounded-xl font-bold text-red-700 outline-none text-sm" value={formData.thresholdExtreme} onChange={e => setFormData({ ...formData, thresholdExtreme: e.target.value })} /></div>
              </div>
              <div className="pt-3 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold rounded-xl transition" data-test-id="form-rainfall-btn-cancel">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md shadow-indigo-500/20" data-test-id="form-rainfall-submit">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RainfallManagementPage;
