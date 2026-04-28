import React from 'react';
import { Bell, Search, UserCircle2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ROUTE_TITLES = {
  '/': 'Bản đồ giám sát',
  '/report': 'Báo cáo ngập',
  '/support': 'Yêu cầu hỗ trợ',
  '/management': 'Tổng quan quản trị',
  '/management/rescue': 'Quản lý cứu trợ',
  '/management/stations': 'Quản lý trạm mực nước',
  '/management/rainfall': 'Quản lý trạm đo mưa',
  '/management/floods': 'Quản lý báo cáo ngập',
  '/management/alerts': 'Cảnh báo ngập AI',
  '/management/users': 'Quản lý người dùng',
};

const TopBar = () => {
  const { pathname } = useLocation();
  const title = ROUTE_TITLES[pathname] || 'AnTi Flood';
  const email = localStorage.getItem('email') || 'user@local';

  return (
    <header className="h-16 bg-white border-b border-slate-100 shadow-[var(--shadow-xs)] px-4 md:px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="ui-input pl-9 w-44 focus:w-64"
            placeholder="Tìm kiếm..."
            aria-label="Search"
          />
        </div>
        <button className="h-11 w-11 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-center">
          <Bell size={18} />
        </button>
        <div className="hidden sm:flex items-center gap-2 pl-1">
          <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
            <UserCircle2 size={20} />
          </div>
          <span className="text-sm text-slate-600 font-medium max-w-36 truncate">{email}</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
