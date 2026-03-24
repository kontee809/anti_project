import React from 'react';
import { Activity, ShieldAlert, Waves, MapPin, Users, PhoneCall } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
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
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
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
        />
        <StatCard 
          title="Yêu cầu cứu trợ" 
          value="18" 
          subtitle="7 chưa xử lý, 11 đang điều phối"
          icon={<PhoneCall size={24} />}
          color="bg-red-500"
        />
        <StatCard 
          title="Trạm cảm biến" 
          value="120" 
          subtitle="118 trạm hoạt động bình thường"
          icon={<Activity size={24} />}
          color="bg-emerald-500"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Hoạt động gần đây</h2>
        <div className="space-y-4">
          {[
            { a: 'Phát hiện điểm ngập sâu >50cm tại Hòa Vang', t: '10 phút trước', icon: <ShieldAlert size={16} className="text-orange-500" /> },
            { a: 'Tiếp nhận yêu cầu cứu trợ khẩn cấp số #420', t: '25 phút trước', icon: <PhoneCall size={16} className="text-red-500" /> },
            { a: 'Trạm cảm biến Liên Chiểu cập nhật Mức nước: An toàn', t: '1 giờ trước', icon: <MapPin size={16} className="text-blue-500" /> },
            { a: 'Báo cáo điểm ngã đổ cây mới ghi nhận', t: '2 giờ trước', icon: <Users size={16} className="text-slate-500" /> },
          ].map((item, id) => (
            <div key={id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
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
