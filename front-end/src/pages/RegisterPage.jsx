import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Map, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setError('');
    setIsLoading(true);

    const result = await register(name, email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 relative overflow-hidden" data-test-id="register-page">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.7),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(37,99,235,0.5),transparent_35%)]" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="w-full max-w-md ui-card p-8 relative z-10 fade-slide-in">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-[10px] flex items-center justify-center text-white mb-4 shadow-[var(--shadow-md)]">
            <Map size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Đăng ký tài khoản</h2>
          <p className="text-slate-500 text-sm mt-2">Dành cho cán bộ giám sát và hỗ trợ</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-[10px] flex items-center gap-2 text-red-600 font-medium text-sm">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleRegister} data-test-id="register-form">
          <div className="relative">
            <label className="ui-label">Họ và tên</label>
            <User className="absolute left-3 bottom-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Họ và tên" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="ui-input pl-10"
              data-test-id="register-input-name"
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <label className="ui-label">Email</label>
            <Mail className="absolute left-3 bottom-3 text-slate-400" size={18} />
            <input 
              type="email" 
              placeholder="Email công vụ" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ui-input pl-10"
              data-test-id="register-input-email"
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <label className="ui-label">Mật khẩu</label>
            <Lock className="absolute left-3 bottom-3 text-slate-400" size={18} />
            <input 
              type="password" 
              placeholder="Mật khẩu" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ui-input pl-10"
              data-test-id="register-input-password"
              disabled={isLoading}
            />
          </div>
          
          <div className="relative">
            <label className="ui-label">Xác nhận mật khẩu</label>
            <Lock className="absolute left-3 bottom-3 text-slate-400" size={18} />
            <input 
              type="password" 
              placeholder="Xác nhận mật khẩu" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="ui-input pl-10"
              data-test-id="register-input-confirm"
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`ui-btn ui-btn-primary ui-btn-lg w-full mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            data-test-id="register-button-submit"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline" data-test-id="register-link-login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
