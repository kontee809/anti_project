import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Waves, MapPin, Users, PhoneCall, AlertCircle, ArrowRight } from 'lucide-react';
import { getAdminRescueStats, getStationStats, getFloodAnalytics } from '../services/api';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, subtitle, icon, color, testId }) => (
  <div className="ui-card p-6 fade-slide-in" data-test-id={testId}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-semibold text-slate-500">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
      </div>
      <div className={`w-11 h-11 rounded-full flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
    <p className="text-sm font-medium text-slate-400 mt-4">{subtitle}</p>
  </div>
);

const ManagementPage = () => {
  const navigate = useNavigate();
  const [rescueStats, setRescueStats] = useState({
    total: 0,
    pending: 0,
    received: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0
  });

  const [stationStats, setStationStats] = useState({
    total: 0,
    normal: 0,
    warning: 0,
    danger: 0,
    offline: 0
  });

  const [floodStats, setFloodStats] = useState({ total: 0, pending: 0, critical: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [rStats, sStats, fStats] = await Promise.all([
          getAdminRescueStats().catch(() => null),
          getStationStats().catch(() => null),
          getFloodAnalytics().catch(() => null)
        ]);
        if (rStats) setRescueStats(rStats);
        if (sStats) setStationStats(sStats);
        if (fStats) setFloodStats(fStats);
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 page-bg min-h-full" data-test-id="management-dashboard">
      {stationStats.danger > 0 && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-xl flex items-start gap-4 shadow-sm">
            <AlertCircle className="text-red-600 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-red-800 text-lg uppercase tracking-wide">CẢNH BÁO KHẨN CẤP</h3>
              <p className="text-sm text-red-700 mt-1">Phát hiện <strong>{stationStats.danger}</strong> trạm đo mực nước đang ở mức NGUY HIỂM. Vui lòng kiểm tra bản đồ ngay!</p>
            </div>
        </div>
      )}
      
      <div className="fade-slide-in" style={{ animationDelay: '60ms' }}>
        <h1 className="text-3xl font-bold text-slate-800">Tổng quan quản lý</h1>
        <p className="text-slate-500 mt-2 font-medium">Bảng thông tin thống kê dữ liệu hệ thống ngập lụt</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Báo cáo ngập" 
          value={floodStats.total || 0} 
          subtitle={`${floodStats.pending || 0} chờ duyệt, ${floodStats.critical || 0} nghiêm trọng`}
          icon={<Waves size={24} />}
          color="bg-blue-50 text-blue-600"
          testId="management-card-floods"
        />
        <StatCard 
          title="Yêu cầu cứu trợ" 
          value={rescueStats.total} 
          subtitle={`${rescueStats.pending} chưa xử lý, ${rescueStats.inProgress} đang điều phối, ${rescueStats.completed} hoàn thành`}
          icon={<PhoneCall size={24} />}
          color="bg-red-50 text-red-500"
          testId="management-card-requests"
        />
        <StatCard 
          title="Trạm cảm biến" 
          value={stationStats.total} 
          subtitle={`${stationStats.normal} an toàn, ${stationStats.warning} báo động, ${stationStats.offline} mất kết nối`}
          icon={<Activity size={24} />}
          color="bg-emerald-50 text-emerald-500"
          testId="management-card-sensors"
        />
        <StatCard
          title="Trạm nguy cơ"
          value={stationStats.warning + stationStats.danger}
          subtitle="Điểm cần theo dõi sát"
          icon={<AlertCircle size={20} />}
          color="bg-amber-50 text-amber-500"
          testId="management-card-risks"
        />
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <button onClick={() => navigate('/management/floods')} className="ui-card p-5 text-left group fade-slide-in" style={{ animationDelay: '120ms' }}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800">Quản lý Báo cáo Ngập</h3>
              <p className="text-sm text-slate-500 mt-1">Xác minh, phân tích và xử lý dữ liệu ngập</p>
            </div>
            <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </div>
        </button>
        <button onClick={() => navigate('/management/rescue')} className="ui-card p-5 text-left group fade-slide-in" style={{ animationDelay: '180ms' }}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800">Quản lý Yêu cầu Cứu trợ</h3>
              <p className="text-sm text-slate-500 mt-1">Tiếp nhận và điều phối cứu trợ khẩn cấp</p>
            </div>
            <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </div>
        </button>
        <div className="ui-card p-5 fade-slide-in" style={{ animationDelay: '220ms' }}>
          <h3 className="text-sm font-semibold text-slate-500 mb-3">Tình trạng hệ thống</h3>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-center justify-between"><span>API Backend</span><span className="ui-badge ui-badge-success">Ổn định</span></li>
            <li className="flex items-center justify-between"><span>Tốc độ cập nhật</span><span className="ui-badge ui-badge-neutral">10 giây/lần</span></li>
            <li className="flex items-center justify-between"><span>Yêu cầu tồn đọng</span><span className="ui-badge ui-badge-warning">{rescueStats.pending}</span></li>
          </ul>
        </div>
      </div>

      <div className="ui-card p-6 fade-slide-in" style={{ animationDelay: '260ms' }} data-test-id="management-activity-section">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Hoạt động gần đây</h2>
        <div className="space-y-4" data-test-id="management-activity-list">
          {[
            { a: 'Phát hiện điểm ngập sâu >50cm tại Hòa Vang', t: '10 phút trước', icon: <ShieldAlert size={16} className="text-orange-500" /> },
            { a: 'Tiếp nhận yêu cầu cứu trợ khẩn cấp số #420', t: '25 phút trước', icon: <PhoneCall size={16} className="text-red-500" /> },
            { a: 'Trạm cảm biến Liên Chiểu cập nhật Mức nước: An toàn', t: '1 giờ trước', icon: <MapPin size={16} className="text-blue-500" /> },
            { a: 'Báo cáo điểm ngã đổ cây mới ghi nhận', t: '2 giờ trước', icon: <Users size={16} className="text-slate-500" /> },
          ].map((item, id) => (
            <div key={id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors" data-test-id={`management-activity-item-${id}`}>
              <div className="p-2 bg-slate-100 rounded-lg">{item.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700">{item.a}</p>
                <p className="text-xs font-medium text-slate-400 mt-1">{item.t}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagementPage;
