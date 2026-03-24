import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Map } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 p-6" data-test-id="login-page">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg">
            <Map size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Đăng nhập</h2>
          <p className="text-slate-500 text-sm mt-2">Truy cập hệ thống quản trị Thủy Phổ Minh</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()} data-test-id="login-form">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
            <input 
              type="email" 
              placeholder="Email của bạn" 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
              data-test-id="login-input-email"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
            <input 
              type="password" 
              placeholder="Mật khẩu" 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
              data-test-id="login-input-password"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer" data-test-id="login-label-remember">
              <input type="checkbox" className="w-4 h-4 rounded text-blue-600" data-test-id="login-checkbox-remember" />
              <span className="text-slate-600 font-medium">Ghi nhớ đăng nhập</span>
            </label>
            <a href="#" className="text-blue-600 font-semibold hover:underline" data-test-id="login-link-forgot">Quên mật khẩu?</a>
          </div>

          <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]" data-test-id="login-button-submit">
            Đăng nhập
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline" data-test-id="login-link-register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
