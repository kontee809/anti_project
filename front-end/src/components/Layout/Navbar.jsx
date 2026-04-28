import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Map,
  LifeBuoy,
  ShieldAlert,
  LayoutDashboard,
  LogOut,
  Users,
  AlertTriangle,
  Activity,
  Waves,
  CloudRain,
  UserCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('email');
    navigate('/login');
  };

  const userEmail = localStorage.getItem('email') || 'user@local';
  const items = [
    { to: '/', icon: Map, label: 'Bản đồ' },
    { to: '/report', icon: ShieldAlert, label: 'Báo cáo ngập' },
    { to: '/support', icon: LifeBuoy, label: 'Yêu cầu hỗ trợ' },
  ];
  const adminItems = [
    { to: '/management', icon: LayoutDashboard, label: 'Tổng quan' },
    { to: '/management/rescue', icon: AlertTriangle, label: 'Cứu trợ' },
    { to: '/management/stations', icon: Activity, label: 'Trạm mực nước' },
    { to: '/management/rainfall', icon: CloudRain, label: 'Trạm đo mưa' },
    { to: '/management/floods', icon: Waves, label: 'Báo cáo ngập' },
    { to: '/management/alerts', icon: AlertTriangle, label: 'Cảnh báo AI' },
    { to: '/management/users', icon: Users, label: 'Người dùng' },
  ];

  return (
    <aside className="hidden lg:flex w-[240px] bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 flex-col h-screen border-r border-slate-700/60">
      <Link to="/" className="h-16 px-5 flex items-center gap-3 border-b border-slate-700/70" data-test-id="navbar-logo-home">
        <div className="w-10 h-10 rounded-[10px] bg-blue-500/20 text-blue-300 flex items-center justify-center">
          <Map size={20} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">AnTi Flood</p>
          <p className="text-xs text-slate-400">Monitoring Platform</p>
        </div>
      </Link>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-2.5 rounded-[10px] text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'text-slate-300 hover:text-white hover:bg-white/12 hover:pl-5'
                }`
              }
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
        {role === 'ADMIN' && (
          <div className="mt-6 pt-6 border-t border-slate-700/70 space-y-1">
            <p className="px-4 text-[11px] uppercase tracking-[0.12em] text-slate-400 mb-2">Quản trị</p>
            {adminItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-2.5 rounded-[10px] text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'text-slate-300 hover:text-white hover:bg-white/12 hover:pl-5'
                  }`
                }
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-slate-700/70">
        <div className="rounded-[14px] bg-white/10 border border-white/20 p-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center">
              <UserCircle2 size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white font-medium truncate">{userEmail}</p>
              <p className="text-xs text-slate-400">{role === 'ADMIN' ? 'Administrator' : 'User'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="ui-btn ui-btn-secondary ui-btn-sm w-full mt-3 bg-white/10 text-white border-white/25 hover:bg-white/20" data-test-id="navbar-dropdown-account-logout">
            <LogOut size={14} />
            Đăng xuất
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Navbar;
