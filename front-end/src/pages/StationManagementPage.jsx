import React, { useState, useEffect } from 'react';
import { getAdminStations, createAdminStation, updateAdminStation, deleteAdminStation } from '../services/api';
import { Plus, Edit, Trash2, X, Activity, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';
import IoTSimulatorPanel from '../components/IoTSimulatorPanel';

const StationManagementPage = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', latitude: '', longitude: '', location: '', thresholdWarning: '', thresholdDanger: '' });

  const fetchStations = async () => {
    try {
      const data = await getAdminStations();
      setStations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleOpenModal = (station = null) => {
    if (station) {
      setFormData(station);
    } else {
      setFormData({ id: null, name: '', latitude: '', longitude: '', location: '', thresholdWarning: '', thresholdDanger: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await updateAdminStation(formData.id, formData);
      } else {
        await createAdminStation(formData);
      }
      setShowModal(false);
      fetchStations();
    } catch (err) {
      alert('Có lỗi xảy ra: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Chắc chắn xóa trạm này?')) {
      try {
        await deleteAdminStation(id);
        fetchStations();
      } catch (err) {
        alert('Lỗi: ' + err.message);
      }
    }
  };

  const getStatusColor = (status) => {
    if (status === 'NORMAL') return 'bg-emerald-100 text-emerald-700';
    if (status === 'WARNING') return 'bg-orange-100 text-orange-700';
    if (status === 'DANGER') return 'bg-red-100 text-red-700';
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full" data-test-id="station-mgmt-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Quản lý Trạm Cảm biến</h1>
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition" data-test-id="station-btn-add">
          <Plus size={18} /> Thêm trạm mới
        </button>
      </div>
      
      {localStorage.getItem('role') === 'ADMIN' && (
        <IoTSimulatorPanel stations={stations} onUpdate={fetchStations} />
      )}
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left" data-test-id="station-table">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Mã trạm</th>
              <th className="p-4 font-semibold text-slate-600">Tên & Vị trí</th>
              <th className="p-4 font-semibold text-slate-600">Mức nước (m)</th>
              <th className="p-4 font-semibold text-slate-600">Ngưỡng (CB/NH)</th>
              <th className="p-4 font-semibold text-slate-600">Trạng thái</th>
              <th className="p-4 font-semibold text-slate-600">Cập nhật cuối</th>
              <th className="p-4 font-semibold text-slate-600 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="7" className="p-8 text-center text-slate-500">Đang tải...</td></tr> : stations.map(s => (
              <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50" data-test-id={`station-row-${s.id}`}>
                <td className="p-4 font-bold text-slate-700">ST-{s.id}</td>
                <td className="p-4">
                  <div className="font-bold text-slate-800">{s.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{s.location}</div>
                  <div className="text-[10px] text-slate-400">Tọa độ: {s.latitude}, {s.longitude}</div>
                </td>
                <td className="p-4 font-bold text-blue-600 text-lg">
                  {s.lastWaterLevel !== null ? s.lastWaterLevel.toFixed(2) : '-'}
                </td>
                <td className="p-4 text-sm font-medium text-slate-600">
                   <span className="text-orange-500">{s.thresholdWarning}m</span> / <span className="text-red-500">{s.thresholdDanger}m</span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(s.status)}`}>{s.status}</span>
                </td>
                <td className="p-4 text-xs font-medium text-slate-500">
                  {s.lastUpdated ? new Date(s.lastUpdated).toLocaleString('vi-VN') : 'Chưa có data'}
                </td>
                <td className="p-4 flex gap-2 justify-end">
                  <Link to={`/stations/${s.id}`} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition" title="Xem biểu đồ" data-test-id={`station-btn-chart-${s.id}`}><Activity size={18}/></Link>
                  <button onClick={() => handleOpenModal(s)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Sửa" data-test-id={`station-btn-edit-${s.id}`}><Edit size={18}/></button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Xóa" data-test-id={`station-btn-delete-${s.id}`}><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[3000] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{formData.id ? 'Sửa thông tin trạm' : 'Thêm trạm mới'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600" data-test-id="station-modal-btn-close"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4" data-test-id="form-station">
              <div><label className="text-sm font-semibold text-slate-700">Tên trạm</label><input required className="w-full mt-1 p-3 border rounded-xl font-medium" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} data-test-id="form-station-input-name" /></div>
              <div><label className="text-sm font-semibold text-slate-700">Địa chỉ</label><input required className="w-full mt-1 p-3 border rounded-xl font-medium" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} data-test-id="form-station-input-location" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-semibold text-slate-700">Vĩ độ (Lat)</label><input type="number" step="any" required className="w-full mt-1 p-3 border rounded-xl font-medium" value={formData.latitude} onChange={e=>setFormData({...formData, latitude: e.target.value})} data-test-id="form-station-input-lat" /></div>
                <div><label className="text-sm font-semibold text-slate-700">Kinh độ (Lng)</label><input type="number" step="any" required className="w-full mt-1 p-3 border rounded-xl font-medium" value={formData.longitude} onChange={e=>setFormData({...formData, longitude: e.target.value})} data-test-id="form-station-input-lng" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-semibold text-orange-600">Cảnh báo (m)</label><input type="number" step="any" required className="w-full mt-1 p-3 border border-orange-200 bg-orange-50 rounded-xl font-bold text-orange-700 outline-none focus:ring-2 focus:ring-orange-500" value={formData.thresholdWarning} onChange={e=>setFormData({...formData, thresholdWarning: e.target.value})} data-test-id="form-station-input-threshold-warning" /></div>
                <div><label className="text-sm font-semibold text-red-600">Nguy hiểm (m)</label><input type="number" step="any" required className="w-full mt-1 p-3 border border-red-200 bg-red-50 rounded-xl font-bold text-red-700 outline-none focus:ring-2 focus:ring-red-500" value={formData.thresholdDanger} onChange={e=>setFormData({...formData, thresholdDanger: e.target.value})} data-test-id="form-station-input-threshold-danger" /></div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={()=>setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold rounded-xl transition" data-test-id="form-station-btn-cancel">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md shadow-blue-500/20" data-test-id="form-station-submit">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default StationManagementPage;
