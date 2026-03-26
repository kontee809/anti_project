import React, { useState, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Map, LifeBuoy, ShieldAlert, LayoutDashboard, UserCircle, ChevronDown, LogOut, Users, AlertTriangle, Activity, Waves, CloudRain } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const supportRef = useRef(null);
  const manageRef = useRef(null);
  const accountRef = useRef(null);

  useClickOutside(supportRef, () => {
    if (activeDropdown === 'support') setActiveDropdown(null);
  });
  useClickOutside(manageRef, () => {
    if (activeDropdown === 'manage') setActiveDropdown(null);
  });
  useClickOutside(accountRef, () => {
    if (activeDropdown === 'account') setActiveDropdown(null);
  });

  const handleDropdownClick = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const closeMenu = () => setActiveDropdown(null);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`;

  const buttonClass = (isOpen, isActiveRoute) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${isOpen || isActiveRoute ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-[2000] shadow-sm flex items-center justify-between px-6" data-test-id="navbar-container">
      <Link to="/" onClick={closeMenu} className="flex items-center gap-3 group" data-test-id="navbar-logo-home">
        <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md group-hover:bg-blue-700 transition-colors">
          <Map size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800 leading-tight">AnTi Flood</h1>
          <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Hệ thống giám sát</p>
        </div>
      </Link>

      <div className="flex items-center gap-2 relative">
        <NavLink to="/" onClick={closeMenu} className={navLinkClass} data-test-id="navbar-menu-map">
          <Map size={18} />
          <span>Bản đồ</span>
        </NavLink>

        <div className="relative" ref={supportRef}>
          <button
            onClick={() => handleDropdownClick('support')}
            className={buttonClass(activeDropdown === 'support', ['/report', '/support'].includes(location.pathname))}
            data-test-id="navbar-menu-support"
          >
            <LifeBuoy size={18} />
            <span>Trợ giúp</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'support' ? 'rotate-180' : ''}`} />
          </button>

          {activeDropdown === 'support' && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-2 animate-in fade-in zoom-in-95 origin-top-left" data-test-id="navbar-dropdown-support">
              <Link to="/report" onClick={closeMenu} className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm font-medium border-b border-slate-50 transition-colors ${location.pathname === '/report' ? 'text-blue-700 bg-blue-50/50' : 'text-slate-700'}`} data-test-id="navbar-dropdown-support-report">
                <ShieldAlert size={16} className={location.pathname === '/report' ? 'text-blue-600' : 'text-orange-500'} />
                Gửi thông tin ngập
              </Link>
              <Link to="/support" onClick={closeMenu} className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm font-medium transition-colors ${location.pathname === '/support' ? 'text-blue-700 bg-blue-50/50' : 'text-slate-700'}`} data-test-id="navbar-dropdown-support-request">
                <LifeBuoy size={16} className={location.pathname === '/support' ? 'text-blue-600' : 'text-blue-500'} />
                Yêu cầu trợ giúp
              </Link>
            </div>
          )}
        </div>

        {role === 'ADMIN' && (
          <div className="relative" ref={manageRef}>
            <button
              onClick={() => handleDropdownClick('manage')}
              className={buttonClass(activeDropdown === 'manage', location.pathname.startsWith('/management'))}
              data-test-id="navbar-menu-manage"
            >
              <LayoutDashboard size={18} />
              <span>Quản lý</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'manage' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'manage' && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-2 animate-in fade-in zoom-in-95 origin-top-left" data-test-id="navbar-dropdown-manage">
                <Link to="/management" onClick={closeMenu} className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm font-medium border-b border-slate-50 transition-colors ${location.pathname === '/management' ? 'text-blue-700 bg-blue-50/50' : 'text-slate-700'}`} data-test-id="navbar-dropdown-manage-dashboard">
                  <LayoutDashboard size={16} className={location.pathname === '/management' ? 'text-blue-600' : 'text-indigo-500'} />
                  Tổng quan
                </Link>
                <Link to="/management/rescue" onClick={closeMenu} className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm font-medium border-b border-slate-50 transition-colors group ${location.pathname === '/management/rescue' ? 'text-blue-700 bg-blue-50/50' : 'text-slate-700'}`} data-test-id="navbar-dropdown-manage-rescue">
                  <AlertTriangle size={16} className={location.pathname === '/management/rescue' ? 'text-blue-600' : 'text-red-500 group-hover:scale-110 transition-transform'} />
                  Quản lý yêu cầu cứu trợ
                </Link>
                <Link to="/management/stations" onClick={closeMenu} className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm font-medium border-b border-slate-50 transition-colors group ${location.pathname === '/management/stations' ? 'text-blue-700 bg-blue-50/50' : 'text-slate-700'}`} data-test-id="navbar-dropdown-manage-stations">
                  <Activity size={16} className={location.pathname === '/management/stations' ? 'text-blue-600' : 'text-orange-500 group-hover:scale-110 transition-transform'} />
                  Quản lý trạm mực nước
                </Link>
                <Link to="/management/rainfall" onClick={closeMenu} className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm font-medium border-b border-slate-50 transition-colors group ${location.pathname === '/management/rainfall' ? 'text-blue-700 bg-blue-50/50' : 'text-slate-700'}`} data-test-id="navbar-dropdown-manage-rainfall">
                  <CloudRain size={16} className={location.pathname === '/management/rainfall' ? 'text-blue-600' : 'text-cyan-500 group-hover:scale-110 transition-transform'} />
                  Quản lý trạm đo mưa
                </Link>
                <Link to="/management/floods" onClick={closeMenu} className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm font-medium border-b border-slate-50 transition-colors group ${location.pathname === '/management/floods' ? 'text-blue-700 bg-blue-50/50' : 'text-slate-700'}`} data-test-id="navbar-dropdown-manage-floods">
                  <Waves size={16} className={location.pathname === '/management/floods' ? 'text-blue-600' : 'text-blue-500 group-hover:scale-110 transition-transform'} />
                  Quản lý báo cáo ngập
                </Link>
                <Link to="/management/users" onClick={closeMenu} className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm font-medium transition-colors ${location.pathname === '/management/users' ? 'text-blue-700 bg-blue-50/50' : 'text-slate-700'}`} data-test-id="navbar-dropdown-manage-users">
                  <Users size={16} className={location.pathname === '/management/users' ? 'text-blue-600' : 'text-emerald-500'} />
                  Quản lý người dùng
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative" ref={accountRef}>
        <button
          onClick={() => handleDropdownClick('account')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all border shadow-sm ${activeDropdown === 'account' ? 'bg-slate-50 text-slate-800 border-slate-300' : 'text-slate-600 hover:bg-slate-50 border-slate-200'
            }`}
          data-test-id="navbar-menu-account"
        >
          <UserCircle size={20} className="text-blue-600" />
          <span>Tài khoản</span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${activeDropdown === 'account' ? 'rotate-180' : ''}`} />
        </button>

        {activeDropdown === 'account' && (
          <div className="absolute top-[calc(100%+8px)] right-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-2 animate-in fade-in zoom-in-95 origin-top-right" data-test-id="navbar-dropdown-account">
            <div className="px-4 py-2 border-b border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm text-red-600 font-medium transition-colors" data-test-id="navbar-dropdown-account-logout">
              <LogOut size={16} className="text-red-500" />
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
