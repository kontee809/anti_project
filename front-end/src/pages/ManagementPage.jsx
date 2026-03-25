import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Waves, MapPin, Users, PhoneCall, AlertCircle } from 'lucide-react';
import { getAdminRescueStats, getStationStats } from '../services/api';

const StatCard = ({ title, value, subtitle, icon, color, testId }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow" data-test-id={testId}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-4xl font-bold text-slate-800 mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl text-white ${color}`}>
        {icon}
      </div>
    </div>
    <p className="text-sm font-medium text-slate-400 mt-4">{subtitle}</p>
  </div>
);

const ManagementPage = () => {
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [rStats, sStats] = await Promise.all([
          getAdminRescueStats().catch(() => null),
          getStationStats().catch(() => null)
        ]);
        if (rStats) setRescueStats(rStats);
        if (sStats) setStationStats(sStats);
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full" data-test-id="management-dashboard">
      {stationStats.danger > 0 && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-600 p-4 rounded-r-xl flex items-start gap-4 shadow-sm animate-[pulse_2s_ease-in-out_infinite]">
            <AlertCircle className="text-red-600 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-red-800 text-lg uppercase tracking-wide">CẢNH BÁO KHẨN CẤP</h3>
              <p className="text-sm text-red-700 mt-1">Phát hiện <strong>{stationStats.danger}</strong> trạm đo mực nước đang ở mức NGUY HIỂM. Vui lòng kiểm tra bản đồ ngay!</p>
            </div>
        </div>
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Tổng quan quản lý</h1>
        <p className="text-slate-500 mt-2 font-medium">Bảng thông tin thống kê dữ liệu hệ thống ngập lụt</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Điểm ngập hiện tại" 
          value="45" 
          subtitle="Tăng 12 điểm so với hôm qua"
          icon={<Waves size={24} />}
          color="bg-blue-500"
          testId="management-card-floods"
        />
        <StatCard 
          title="Yêu cầu cứu trợ" 
          value={rescueStats.total} 
          subtitle={`${rescueStats.pending} chưa xử lý, ${rescueStats.inProgress} đang điều phối, ${rescueStats.completed} hoàn thành`}
          icon={<PhoneCall size={24} />}
          color="bg-red-500"
          testId="management-card-requests"
        />
        <StatCard 
          title="Trạm cảm biến" 
          value={stationStats.total} 
          subtitle={`${stationStats.normal} an toàn, ${stationStats.warning} báo động, ${stationStats.offline} mất kết nối`}
          icon={<Activity size={24} />}
          color="bg-emerald-500"
          testId="management-card-sensors"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6" data-test-id="management-activity-section">
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
