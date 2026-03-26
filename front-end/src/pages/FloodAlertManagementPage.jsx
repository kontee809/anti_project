import React, { useState, useEffect, useMemo } from 'react';
import { getAdminFloodAlerts, getFloodAlertStats, acknowledgeFloodAlert, resolveFloodAlert, getSystemStatus } from '../services/api';
import { AlertTriangle, Bell, ShieldCheck, CheckCircle, XCircle, Search, Eye, X, Cpu, Droplets, CloudRain, Activity, Wifi, WifiOff } from 'lucide-react';

const RISK_CONFIG = {
  LOW: { label: 'Thấp', bg: 'bg-blue-100 text-blue-700' },
  MEDIUM: { label: 'Trung bình', bg: 'bg-yellow-100 text-yellow-700' },
  HIGH: { label: 'Cao', bg: 'bg-orange-100 text-orange-700' },
  CRITICAL: { label: 'Nghiêm trọng', bg: 'bg-red-100 text-red-700' },
};

const STATUS_CONFIG = {
  ACTIVE: { label: 'Đang hoạt động', bg: 'bg-red-100 text-red-700' },
  ACKNOWLEDGED: { label: 'Đã xác nhận', bg: 'bg-amber-100 text-amber-700' },
  RESOLVED: { label: 'Đã xử lý', bg: 'bg-emerald-100 text-emerald-700' },
};

const FloodAlertManagementPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({});
  const [sysStatus, setSysStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      const [a, s, sys] = await Promise.all([
        getAdminFloodAlerts(),
        getFloodAlertStats(),
        getSystemStatus(),
      ]);
      setAlerts(a);
      setStats(s);
      setSysStatus(sys);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
    const intv = setInterval(fetchData, 6000);
    return () => clearInterval(intv);
  }, []);

  const filtered = useMemo(() => {
    let result = [...alerts];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a => a.address?.toLowerCase().includes(q) || String(a.id).includes(q) || a.triggerReason?.toLowerCase().includes(q));
    }
    if (filterRisk) result = result.filter(a => a.riskLevel === filterRisk);
    if (filterStatus) result = result.filter(a => a.status === filterStatus);
    return result;
  }, [alerts, search, filterRisk, filterStatus]);

  const handleAction = async (id, action) => {
    try {
      if (action === 'acknowledge') await acknowledgeFloodAlert(id);
      else await resolveFloodAlert(id);
      showToast(`Cảnh báo #${id} đã ${action === 'acknowledge' ? 'xác nhận' : 'xử lý xong'}`);
      fetchData();
      setSelectedAlert(null);
    } catch (err) { showToast('Lỗi: ' + err.message); }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {toast && (
        <div className="fixed top-24 right-8 z-50 px-5 py-3 rounded-xl font-bold shadow-xl text-sm bg-emerald-500 text-white flex items-center gap-2">
          <CheckCircle size={18} />{toast}
        </div>
      )}

      {/* Critical alert banner */}
      {(stats.critical || 0) > 0 && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-xl flex items-start gap-4 shadow-sm animate-[pulse_2s_ease-in-out_infinite]">
          <AlertTriangle className="text-red-600 mt-0.5 shrink-0" size={22} />
          <div>
            <h3 className="font-bold text-red-800 uppercase tracking-wide">CẢNH BÁO AI — MỨC NGHIÊM TRỌNG</h3>
            <p className="text-sm text-red-700 mt-0.5">Hệ thống phát hiện <strong>{stats.critical}</strong> cảnh báo ngập nghiêm trọng dựa trên dữ liệu cảm biến!</p>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-slate-800">Hệ thống Cảnh báo Ngập thông minh</h1>
        <p className="text-slate-500 mt-1 font-medium">Dự đoán nguy cơ ngập dựa trên tương quan mực nước + lượng mưa (AI mô phỏng)</p>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Tổng cảnh báo</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.total || 0}</h3>
          <p className="text-xs text-slate-400 mt-1">{stats.active || 0} đang hoạt động</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Nghiêm trọng</p>
          <h3 className="text-2xl font-bold text-red-600 mt-1">{stats.critical || 0}</h3>
          <p className="text-xs text-slate-400 mt-1">{stats.high || 0} mức cao</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Trạm mực nước</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Droplets size={16} className="text-blue-500" />
            <span className="text-lg font-bold text-slate-800">{sysStatus.waterStationsOnline || 0}/{sysStatus.waterStationsTotal || 0}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">đang hoạt động</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Trạm đo mưa</p>
          <div className="flex items-center gap-1.5 mt-1">
            <CloudRain size={16} className="text-indigo-500" />
            <span className="text-lg font-bold text-slate-800">{sysStatus.rainfallStationsOnline || 0}/{sysStatus.rainfallStationsTotal || 0}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">đang hoạt động</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Hệ thống</p>
          <div className="flex items-center gap-1.5 mt-1">
            {sysStatus.systemHealthy ? <Wifi size={16} className="text-emerald-500" /> : <WifiOff size={16} className="text-red-500" />}
            <span className={`text-lg font-bold ${sysStatus.systemHealthy ? 'text-emerald-600' : 'text-red-600'}`}>{sysStatus.systemHealthy ? 'Bình thường' : 'Lỗi'}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Quét mỗi 8 giây</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo ID, địa chỉ, lý do..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium" />
        </div>
        <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)} className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-sm font-medium outline-none">
          <option value="">Tất cả mức độ</option>
          <option value="LOW">Thấp</option><option value="MEDIUM">Trung bình</option>
          <option value="HIGH">Cao</option><option value="CRITICAL">Nghiêm trọng</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-sm font-medium outline-none">
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang hoạt động</option><option value="ACKNOWLEDGED">Đã xác nhận</option><option value="RESOLVED">Đã xử lý</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">ID</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Vị trí</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Dự đoán</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Nguy cơ</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Tin cậy</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Dữ liệu gốc</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Trạng thái</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Thời gian</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="p-8 text-center text-slate-500">Đang tải...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="9" className="p-8 text-center text-slate-400">Chưa có cảnh báo nào.</td></tr>
              ) : filtered.map(a => {
                const risk = RISK_CONFIG[a.riskLevel] || RISK_CONFIG.LOW;
                const stat = STATUS_CONFIG[a.status] || STATUS_CONFIG.ACTIVE;
                return (
                  <tr key={a.id} className={`border-b border-slate-50 hover:bg-slate-50 transition ${a.riskLevel === 'CRITICAL' && a.status === 'ACTIVE' ? 'bg-red-50/40' : ''}`}>
                    <td className="p-4 font-bold text-slate-700 text-sm">#{a.id}</td>
                    <td className="p-4 max-w-[180px]">
                      <div className="text-sm font-medium text-slate-700 truncate">{a.address || 'N/A'}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{a.latitude?.toFixed(4)}, {a.longitude?.toFixed(4)}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-black text-lg text-blue-600">{a.predictedFloodLevelCm}</span>
                      <span className="text-xs text-slate-400 ml-0.5">cm</span>
                    </td>
                    <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${risk.bg}`}>{risk.label}</span></td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 bg-slate-200 rounded-full h-1.5">
                          <div className={`h-full rounded-full ${a.confidenceScore >= 70 ? 'bg-emerald-500' : a.confidenceScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${a.confidenceScore}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-600">{a.confidenceScore}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-500">
                      <div>💧 {a.inputWaterLevelM?.toFixed(2)}m</div>
                      <div>🌧️ {a.inputRainfallMm?.toFixed(1)}mm/h</div>
                    </td>
                    <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${stat.bg}`}>{stat.label}</span></td>
                    <td className="p-4 text-xs text-slate-500 whitespace-nowrap">{a.createdAt ? new Date(a.createdAt).toLocaleString('vi-VN') : 'N/A'}</td>
                    <td className="p-4">
                      <div className="flex gap-1.5 justify-end">
                        <button onClick={() => setSelectedAlert(a)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Eye size={16} /></button>
                        {a.status === 'ACTIVE' && (
                          <button onClick={() => handleAction(a.id, 'acknowledge')} className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition" title="Xác nhận"><Bell size={16} /></button>
                        )}
                        {(a.status === 'ACTIVE' || a.status === 'ACKNOWLEDGED') && (
                          <button onClick={() => handleAction(a.id, 'resolve')} className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition" title="Xử lý xong"><ShieldCheck size={16} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Cảnh báo #{selectedAlert.id}</h2>
              <button onClick={() => setSelectedAlert(null)} className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-full shadow-sm"><X size={18} /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase">Mức dự đoán</span>
                  <p className="font-black text-2xl text-blue-600 mt-0.5">{selectedAlert.predictedFloodLevelCm} cm</p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase">Nguy cơ</span>
                  <p className="mt-1"><span className={`px-3 py-1 rounded-full text-xs font-bold ${(RISK_CONFIG[selectedAlert.riskLevel] || RISK_CONFIG.LOW).bg}`}>{(RISK_CONFIG[selectedAlert.riskLevel] || RISK_CONFIG.LOW).label}</span></p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase">Độ tin cậy</span>
                  <p className="font-bold text-lg text-slate-800 mt-0.5">{selectedAlert.confidenceScore}%</p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase">Bán kính ảnh hưởng</span>
                  <p className="font-bold text-lg text-slate-800 mt-0.5">{selectedAlert.affectedRadiusKm} km</p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase">Mực nước đầu vào</span>
                  <p className="font-semibold text-slate-700 mt-0.5 flex items-center gap-1"><Droplets size={14} className="text-blue-500" /> {selectedAlert.inputWaterLevelM?.toFixed(2)}m</p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase">Lượng mưa đầu vào</span>
                  <p className="font-semibold text-slate-700 mt-0.5 flex items-center gap-1"><CloudRain size={14} className="text-indigo-500" /> {selectedAlert.inputRainfallMm?.toFixed(1)}mm/h</p>
                </div>
              </div>
              {selectedAlert.triggerReason && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <span className="text-amber-800 font-bold text-xs uppercase">Lý do kích hoạt</span>
                  <p className="text-amber-700 text-sm mt-1 font-medium">{selectedAlert.triggerReason}</p>
                </div>
              )}
              <div className="text-xs text-slate-500">
                <p>Trạm mực nước tham chiếu: <strong className="text-slate-700">{selectedAlert.waterLevelStationIds || 'N/A'}</strong></p>
                <p>Trạm mưa tham chiếu: <strong className="text-slate-700">{selectedAlert.rainfallStationIds || 'N/A'}</strong></p>
                <p className="mt-1">Dự kiến xảy ra: <strong className="text-slate-700">{selectedAlert.predictedTime ? new Date(selectedAlert.predictedTime).toLocaleString('vi-VN') : 'N/A'}</strong></p>
              </div>
              {selectedAlert.status === 'ACTIVE' && (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleAction(selectedAlert.id, 'acknowledge')}
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-1.5"><Bell size={16} /> Xác nhận</button>
                  <button onClick={() => handleAction(selectedAlert.id, 'resolve')}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-1.5"><ShieldCheck size={16} /> Xử lý xong</button>
                </div>
              )}
              {selectedAlert.status === 'ACKNOWLEDGED' && (
                <button onClick={() => handleAction(selectedAlert.id, 'resolve')}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-1.5"><ShieldCheck size={16} /> Đánh dấu Đã xử lý</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloodAlertManagementPage;
