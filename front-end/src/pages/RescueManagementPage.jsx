import React, { useState, useEffect } from 'react';
import { getAdminRescueRequests, updateRescueStatus } from '../services/api';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { LifeBuoy, X, Check, ArrowRight, XCircle } from 'lucide-react';

const createStatusBadge = (status) => {
  switch (status) {
    case 'PENDING': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">Mới gửi</span>;
    case 'RECEIVED': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600">Đã tiếp nhận</span>;
    case 'IN_PROGRESS': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-600">Đang xử lý</span>;
    case 'COMPLETED': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">Đã xong</span>;
    case 'CANCELLED': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">Đã hủy</span>;
    default: return null;
  }
};

const RescueManagementPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [assignTeamName, setAssignTeamName] = useState('');
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  const fetchRequests = async () => {
    try {
      const data = await getAdminRescueRequests();
      setRequests(data.sort((a,b) => b.id - a.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const intv = setInterval(fetchRequests, 10000);
    return () => clearInterval(intv);
  }, []);

  const handleAction = async (id, action, payload = {}) => {
    if (action === 'cancel' && !window.confirm('Bạn có chắc chắn muốn huỷ yêu cầu này?')) return;
    if (action === 'complete' && !window.confirm('Xác nhận hoàn thành cứu trợ?')) return;
    
    try {
      await updateRescueStatus(id, action, payload);
      fetchRequests();
      setShowAssignDialog(false);
      setAssignTeamName('');
    } catch (err) {
      alert('Có lỗi xảy ra: ' + err.message);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Quản lý Yêu cầu Cứu trợ</h1>
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-600">ID</th>
                <th className="p-4 font-semibold text-slate-600">Người yêu cầu</th>
                <th className="p-4 font-semibold text-slate-600">SĐT</th>
                <th className="p-4 font-semibold text-slate-600">Trạng thái</th>
                <th className="p-4 font-semibold text-slate-600">Đội cứu hộ</th>
                <th className="p-4 font-semibold text-slate-600">Thời gian</th>
                <th className="p-4 font-semibold text-slate-600 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-500">Đang tải...</td></tr>
              ) : requests.map(req => (
                <tr key={req.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-700">#{req.id}</td>
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{req.name}</p>
                    {req.isForSomeoneElse && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Đặt hộ</span>}
                  </td>
                  <td className="p-4 font-medium text-slate-600">{req.phone}</td>
                  <td className="p-4">{createStatusBadge(req.status)}</td>
                  <td className="p-4 font-medium text-slate-500">{req.assignedTo || '-'}</td>
                  <td className="p-4 text-sm text-slate-500">{new Date(req.createdAt).toLocaleString('vi-VN')}</td>
                  <td className="p-4 flex gap-2 justify-end">
                    <button onClick={() => setSelectedReq(req)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors">Chi tiết</button>
                    {req.status === 'PENDING' && (
                      <button onClick={() => handleAction(req.id, 'receive')} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"><Check size={14}/> Tiếp nhận</button>
                    )}
                    {req.status === 'RECEIVED' && (
                      <button onClick={() => { setSelectedReq(req); setShowAssignDialog(true); }} className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"><ArrowRight size={14}/> Phân công</button>
                    )}
                    {req.status === 'IN_PROGRESS' && (
                      <button onClick={() => handleAction(req.id, 'complete')} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"><Check size={14}/> Hoàn thành</button>
                    )}
                    {(req.status === 'PENDING' || req.status === 'RECEIVED') && (
                      <button onClick={() => handleAction(req.id, 'cancel')} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hủy"><XCircle size={18}/></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReq && !showAssignDialog && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Chi tiết cứu trợ #{selectedReq.id}</h2>
              <button onClick={() => setSelectedReq(null)} className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-full shadow-sm"><X size={20}/></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500 block">Người yêu cầu:</span><strong className="text-slate-800 text-base">{selectedReq.name}</strong></div>
                <div><span className="text-slate-500 block">Số điện thoại:</span><strong className="text-slate-800 text-base">{selectedReq.phone}</strong></div>
                <div className="col-span-2"><span className="text-slate-500 block mt-2">Trạng thái:</span><div className="mt-1">{createStatusBadge(selectedReq.status)}</div></div>
                <div className="col-span-2 bg-red-50 p-4 rounded-xl border border-red-100 mt-2">
                  <span className="text-red-800 font-bold block mb-1">Nội dung yêu cầu:</span>
                  <p className="text-red-700">{selectedReq.description}</p>
                </div>
                {selectedReq.assignedTo && <div className="col-span-2"><span className="text-slate-500 block mt-2">Đội xử lý:</span><strong className="text-slate-800 bg-orange-100 text-orange-800 px-3 py-1 rounded-lg inline-block mt-1">{selectedReq.assignedTo}</strong></div>}
                <div className="col-span-2 mt-4">
                  <span className="text-slate-500 block mb-2 font-semibold">Vị trí: {selectedReq.address}</span>
                  <div className="h-64 rounded-xl overflow-hidden border-2 border-slate-200">
                    <MapContainer center={[selectedReq.latitude, selectedReq.longitude]} zoom={15} style={{width:'100%', height:'100%'}}>
                      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                      <Marker position={[selectedReq.latitude, selectedReq.longitude]} />
                    </MapContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignDialog && selectedReq && (
        <div className="fixed inset-0 z-[3000] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Phân công đội cứu hộ</h3>
            <p className="text-sm text-slate-500 mb-4">Nhập tên đội hoặc cá nhân phụ trách xử lý yêu cầu #{selectedReq.id}.</p>
            <input type="text" value={assignTeamName} onChange={(e) => setAssignTeamName(e.target.value)} placeholder="Tên đội / Đơn vị..." className="w-full p-3 rounded-xl border border-slate-200 mb-6 font-medium outline-none focus:ring-2 focus:ring-orange-500" autoFocus />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowAssignDialog(false)} className="px-4 py-2 text-slate-500 font-semibold hover:bg-slate-100 rounded-xl transition-colors">Hủy</button>
              <button onClick={() => handleAction(selectedReq.id, 'assign', { assignedTo: assignTeamName })} disabled={!assignTeamName.trim()} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50">Xác nhận</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RescueManagementPage;
