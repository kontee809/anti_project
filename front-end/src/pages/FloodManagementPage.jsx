import React, { useState, useEffect, useMemo } from 'react';
import { getAdminFloodReports, getFloodAnalytics, verifyFloodReport, rejectFloodReport, resolveFloodReport } from '../services/api';
import { Waves, AlertTriangle, ShieldCheck, CheckCircle, XCircle, Search, Filter, X, Clock, MapPin, Eye, TrendingUp, Users, Cpu, BarChart3 } from 'lucide-react';

const SEVERITY_CONFIG = {
  LOW: { label: 'Thấp', bg: 'badge-dark badge-dark-info', dot: 'bg-blue-500' },
  MEDIUM: { label: 'Trung bình', bg: 'badge-dark badge-dark-warning', dot: 'bg-yellow-500' },
  HIGH: { label: 'Cao', bg: 'badge-dark badge-dark-warning', dot: 'bg-orange-500' },
  CRITICAL: { label: 'Nghiêm trọng', bg: 'badge-dark badge-dark-danger', dot: 'bg-red-500' },
};

const STATUS_CONFIG = {
  PENDING: { label: 'Chờ duyệt', bg: 'badge-dark badge-dark-neutral' },
  VERIFIED: { label: 'Đã xác minh', bg: 'badge-dark badge-dark-success' },
  RESOLVED: { label: 'Đã xử lý', bg: 'badge-dark badge-dark-info' },
};

const SOURCE_CONFIG = {
  USER: { label: 'Người dùng', icon: <Users size={14} /> },
  SENSOR: { label: 'Cảm biến', icon: <Cpu size={14} /> },
  SYSTEM: { label: 'Hệ thống AI', icon: <BarChart3 size={14} /> },
};

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 mt-1.5">{value}</h3>
      </div>
      <div className={`p-2.5 rounded-xl text-white ${color}`}>{icon}</div>
    </div>
    {subtitle && <p className="text-xs font-medium text-slate-400 mt-3">{subtitle}</p>}
  </div>
);

const FloodManagementPage = () => {
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [sortBy, setSortBy] = useState('time');
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      const [reps, stats] = await Promise.all([
        getAdminFloodReports(),
        getFloodAnalytics(),
      ]);
      setReports(reps);
      setAnalytics(stats);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
    const intv = setInterval(fetchData, 10000);
    return () => clearInterval(intv);
  }, []);

  // Filtering + sorting
  const filteredReports = useMemo(() => {
    let result = [...reports];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r => 
        r.address?.toLowerCase().includes(q) || 
        String(r.id).includes(q) ||
        r.description?.toLowerCase().includes(q)
      );
    }
    if (filterSeverity) result = result.filter(r => r.severityLevel === filterSeverity);
    if (filterStatus) result = result.filter(r => r.status === filterStatus);
    if (filterSource) result = result.filter(r => r.reportedBy === filterSource);
    
    if (sortBy === 'level') result.sort((a, b) => b.floodLevelCm - a.floodLevelCm);
    else if (sortBy === 'reliability') result.sort((a, b) => b.reliabilityScore - a.reliabilityScore);
    // Default: time (already sorted by createdAt desc from backend)
    
    return result;
  }, [reports, search, filterSeverity, filterStatus, filterSource, sortBy]);

  const handleAction = async (id, action) => {
    try {
      if (action === 'verify') await verifyFloodReport(id);
      else if (action === 'reject') await rejectFloodReport(id);
      else if (action === 'resolve') await resolveFloodReport(id);
      showToast(`Báo cáo #${id} đã được ${action === 'verify' ? 'xác minh' : action === 'reject' ? 'từ chối' : 'xử lý xong'}`);
      fetchData();
      setSelectedReport(null);
    } catch (err) {
      showToast('Có lỗi xảy ra: ' + err.message, 'error');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.size === 0) return;
    const label = action === 'verify' ? 'xác minh' : action === 'reject' ? 'từ chối' : 'xử lý';
    if (!window.confirm(`${label} ${selectedIds.size} báo cáo đã chọn?`)) return;
    
    for (const id of selectedIds) {
      try {
        if (action === 'verify') await verifyFloodReport(id);
        else if (action === 'reject') await rejectFloodReport(id);
        else if (action === 'resolve') await resolveFloodReport(id);
      } catch (err) { console.error(err); }
    }
    setSelectedIds(new Set());
    showToast(`Đã ${label} ${selectedIds.size} báo cáo`);
    fetchData();
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredReports.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredReports.map(r => r.id)));
    }
  };

  const criticalCount = analytics.critical || 0;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 page-bg min-h-full" data-test-id="flood-mgmt-page">
      
      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-8 z-50 px-5 py-3 rounded-xl font-bold shadow-xl text-sm flex items-center gap-2 transition-all ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`} data-test-id="flood-mgmt-toast">
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Critical Alert Banner */}
      {criticalCount > 0 && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-xl flex items-start gap-4 shadow-sm animate-[pulse_2s_ease-in-out_infinite]">
          <AlertTriangle className="text-red-600 mt-0.5 shrink-0" size={22} />
          <div>
            <h3 className="font-bold text-red-800 text-base uppercase tracking-wide">CẢNH BÁO NGHIÊM TRỌNG</h3>
            <p className="text-sm text-red-700 mt-0.5">Phát hiện <strong>{criticalCount}</strong> báo cáo ngập mức NGHIÊM TRỌNG đang chờ xử lý!</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Quản lý Báo cáo Ngập</h1>
        <p className="text-slate-500 mt-1 font-medium">Giám sát, xác minh và phân tích dữ liệu ngập lụt thời gian thực</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng báo cáo" value={analytics.total || 0} icon={<Waves size={20} />} color="bg-blue-500" subtitle={`${analytics.pending || 0} chờ duyệt`} />
        <StatCard title="Nghiêm trọng" value={criticalCount} icon={<AlertTriangle size={20} />} color="bg-red-500" subtitle={`${analytics.high || 0} mức cao`} />
        <StatCard title="Đã xác minh" value={analytics.verified || 0} icon={<ShieldCheck size={20} />} color="bg-emerald-500" subtitle={`${analytics.resolved || 0} đã xử lý`} />
        <StatCard title="Từ cảm biến" value={analytics.fromSensor || 0} icon={<Cpu size={20} />} color="bg-indigo-500" subtitle={`${analytics.fromUser || 0} người dùng, ${analytics.fromSystem || 0} AI`} />
      </div>

      {/* Severity Breakdown Bar */}
      {analytics.total > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2"><TrendingUp size={16} /> Phân bổ mức độ</h3>
          <div className="flex rounded-full overflow-hidden h-4">
            {[
              { key: 'low', color: 'bg-blue-400', label: 'Thấp' },
              { key: 'medium', color: 'bg-yellow-400', label: 'TB' },
              { key: 'high', color: 'bg-orange-500', label: 'Cao' },
              { key: 'critical', color: 'bg-red-500', label: 'N.trọng' },
            ].map(s => {
              const val = analytics[s.key] || 0;
              const pct = ((val / analytics.total) * 100).toFixed(0);
              if (val === 0) return null;
              return (
                <div key={s.key} className={`${s.color} relative group`} style={{ width: `${pct}%` }} title={`${s.label}: ${val} (${pct}%)`}>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo ID, địa chỉ, mô tả..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              data-test-id="flood-mgmt-input-search"
            />
          </div>
          
          <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}
            className="py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
            data-test-id="flood-mgmt-select-severity"
          >
            <option value="">Tất cả mức độ</option>
            <option value="LOW">Thấp</option>
            <option value="MEDIUM">Trung bình</option>
            <option value="HIGH">Cao</option>
            <option value="CRITICAL">Nghiêm trọng</option>
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
            data-test-id="flood-mgmt-select-status"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="VERIFIED">Đã xác minh</option>
            <option value="RESOLVED">Đã xử lý</option>
          </select>

          <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)}
            className="py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
            data-test-id="flood-mgmt-select-source"
          >
            <option value="">Tất cả nguồn</option>
            <option value="USER">Người dùng</option>
            <option value="SENSOR">Cảm biến</option>
            <option value="SYSTEM">Hệ thống AI</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
            data-test-id="flood-mgmt-select-sort"
          >
            <option value="time">Mới nhất</option>
            <option value="level">Mức ngập cao nhất</option>
            <option value="reliability">Độ tin cậy</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-3">
            <span className="text-sm font-bold text-slate-600">{selectedIds.size} đã chọn</span>
            <button onClick={() => handleBulkAction('verify')} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition flex items-center gap-1" data-test-id="flood-mgmt-bulk-verify"><CheckCircle size={14} /> Xác minh</button>
            <button onClick={() => handleBulkAction('reject')} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition flex items-center gap-1" data-test-id="flood-mgmt-bulk-reject"><XCircle size={14} /> Từ chối</button>
            <button onClick={() => handleBulkAction('resolve')} className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition flex items-center gap-1" data-test-id="flood-mgmt-bulk-resolve"><ShieldCheck size={14} /> Xử lý xong</button>
            <button onClick={() => setSelectedIds(new Set())} className="text-xs text-slate-500 hover:text-slate-700 font-semibold ml-2" data-test-id="flood-mgmt-bulk-deselect">Bỏ chọn</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="ui-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="ui-table" data-test-id="flood-mgmt-table">
            <thead>
              <tr>
                <th className="p-4 w-10">
                  <input type="checkbox" checked={selectedIds.size === filteredReports.length && filteredReports.length > 0}
                    onChange={toggleSelectAll} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" data-test-id="flood-mgmt-checkbox-all" />
                </th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">ID</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Vị trí</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Mức ngập</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Mức độ</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Nguồn</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Tin cậy</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Trạng thái</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase">Thời gian</th>
                <th className="p-4 font-semibold text-slate-600 text-xs uppercase text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10" className="p-8 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
              ) : filteredReports.length === 0 ? (
                <tr><td colSpan="10" className="p-8 text-center text-slate-400">Không có báo cáo nào phù hợp.</td></tr>
              ) : filteredReports.map(r => {
                const sev = SEVERITY_CONFIG[r.severityLevel] || SEVERITY_CONFIG.LOW;
                const stat = STATUS_CONFIG[r.status] || STATUS_CONFIG.PENDING;
                const src = SOURCE_CONFIG[r.reportedBy] || SOURCE_CONFIG.USER;
                return (
                  <tr key={r.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${r.severityLevel === 'CRITICAL' ? 'bg-red-50/30' : ''}`} data-test-id={`flood-mgmt-row-${r.id}`}>
                    <td className="p-4">
                      <input type="checkbox" checked={selectedIds.has(r.id)} onChange={() => toggleSelect(r.id)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" data-test-id={`flood-mgmt-checkbox-${r.id}`} />
                    </td>
                    <td className="p-4 font-bold text-slate-700 text-sm">#{r.id}</td>
                    <td className="p-4 max-w-[200px]">
                      <div className="text-sm font-medium text-slate-700 truncate">{r.address || 'N/A'}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1"><MapPin size={10} /> {r.latitude?.toFixed(4)}, {r.longitude?.toFixed(4)}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-black text-lg text-blue-600">{r.floodLevelCm}</span>
                      <span className="text-xs text-slate-400 ml-0.5">cm</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${sev.bg}`}>{sev.label}</span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">{src.icon} {src.label}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full rounded-full ${r.reliabilityScore >= 70 ? 'bg-emerald-500' : r.reliabilityScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            style={{ width: `${r.reliabilityScore}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-600">{r.reliabilityScore}%</span>
                      </div>
                    </td>
                    <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${stat.bg}`}>{stat.label}</span></td>
                    <td className="p-4 text-xs text-slate-500 font-medium whitespace-nowrap">
                      {r.createdAt ? new Date(r.createdAt).toLocaleString('vi-VN') : 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1.5 justify-end">
                        <button onClick={() => setSelectedReport(r)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Chi tiết" data-test-id={`flood-mgmt-btn-view-${r.id}`}><Eye size={16} /></button>
                        {r.status === 'PENDING' && (
                          <>
                            <button onClick={() => handleAction(r.id, 'verify')} className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition" title="Xác minh" data-test-id={`flood-mgmt-btn-verify-${r.id}`}><CheckCircle size={16} /></button>
                            <button onClick={() => handleAction(r.id, 'reject')} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition" title="Từ chối" data-test-id={`flood-mgmt-btn-reject-${r.id}`}><XCircle size={16} /></button>
                          </>
                        )}
                        {r.status === 'VERIFIED' && (
                          <button onClick={() => handleAction(r.id, 'resolve')} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Xử lý xong" data-test-id={`flood-mgmt-btn-resolve-${r.id}`}><ShieldCheck size={16} /></button>
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
      {selectedReport && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4" data-test-id="flood-mgmt-detail-modal">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Chi tiết báo cáo #{selectedReport.id}</h2>
              <button onClick={() => setSelectedReport(null)} className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-full shadow-sm" data-test-id="flood-mgmt-modal-btn-close"><X size={18} /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400 block text-xs font-bold uppercase">Mức ngập</span>
                  <span className="font-black text-2xl text-blue-600">{selectedReport.floodLevelCm} cm</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-bold uppercase">Mức độ</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block mt-1 ${(SEVERITY_CONFIG[selectedReport.severityLevel] || SEVERITY_CONFIG.LOW).bg}`}>
                    {(SEVERITY_CONFIG[selectedReport.severityLevel] || SEVERITY_CONFIG.LOW).label}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-bold uppercase">Trạng thái</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block mt-1 ${(STATUS_CONFIG[selectedReport.status] || STATUS_CONFIG.PENDING).bg}`}>
                    {(STATUS_CONFIG[selectedReport.status] || STATUS_CONFIG.PENDING).label}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-bold uppercase">Độ tin cậy</span>
                  <span className="font-bold text-lg text-slate-800">{selectedReport.reliabilityScore}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-bold uppercase">Nguồn</span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mt-1">
                    {(SOURCE_CONFIG[selectedReport.reportedBy] || SOURCE_CONFIG.USER).icon}
                    {(SOURCE_CONFIG[selectedReport.reportedBy] || SOURCE_CONFIG.USER).label}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-bold uppercase">Loại ngập</span>
                  <span className="font-semibold text-slate-700 mt-1 block">{selectedReport.floodType}</span>
                </div>
              </div>
              
              <div>
                <span className="text-slate-400 block text-xs font-bold uppercase mb-1">Vị trí</span>
                <p className="text-sm font-medium text-slate-700 flex items-start gap-1.5"><MapPin size={14} className="text-blue-500 mt-0.5 shrink-0" /> {selectedReport.address || 'N/A'}</p>
              </div>

              {selectedReport.description && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <span className="text-blue-800 font-bold block text-xs uppercase mb-1">Mô tả</span>
                  <p className="text-blue-700 text-sm">{selectedReport.description}</p>
                </div>
              )}

              <div>
                <span className="text-slate-400 block text-xs font-bold uppercase mb-2">Tiến trình</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold"><Clock size={12} /> {selectedReport.createdAt ? new Date(selectedReport.createdAt).toLocaleString('vi-VN') : ''}</div>
                  <div className="flex-1 h-[2px] bg-slate-200" />
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${(STATUS_CONFIG[selectedReport.status] || STATUS_CONFIG.PENDING).bg}`}>
                    {(STATUS_CONFIG[selectedReport.status] || STATUS_CONFIG.PENDING).label}
                  </span>
                </div>
              </div>

              {selectedReport.status === 'PENDING' && (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleAction(selectedReport.id, 'verify')}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-1.5" data-test-id="flood-mgmt-modal-btn-verify"><CheckCircle size={16} /> Xác minh</button>
                  <button onClick={() => handleAction(selectedReport.id, 'reject')}
                    className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-1.5" data-test-id="flood-mgmt-modal-btn-reject"><XCircle size={16} /> Từ chối</button>
                </div>
              )}
              {selectedReport.status === 'VERIFIED' && (
                <button onClick={() => handleAction(selectedReport.id, 'resolve')}
                  className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-1.5" data-test-id="flood-mgmt-modal-btn-resolve"><ShieldCheck size={16} /> Đánh dấu Đã xử lý</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloodManagementPage;
