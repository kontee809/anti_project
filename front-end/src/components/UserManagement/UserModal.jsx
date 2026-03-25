import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const UserModal = ({ isOpen, onClose, onSubmit, initialData, currentUserEmail }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
    status: 'ACTIVE'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        password: '',
        role: initialData.role ? initialData.role.toUpperCase() : 'USER',
        status: initialData.status ? initialData.status.toUpperCase() : 'ACTIVE'
      });
    } else {
      setFormData({ name: '', email: '', password: '', role: 'USER', status: 'ACTIVE' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" data-test-id="user-modal-container">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95" data-test-id="user-modal">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors" data-test-id="user-modal-button-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" data-test-id="user-modal-form">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">Họ và Tên *</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-slate-700"
              data-test-id="user-modal-input-name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">Email *</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-slate-700"
              data-test-id="user-modal-input-email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">Mật khẩu {initialData ? '(Tùy chọn)' : '*'}</label>
            <input 
              required={!initialData}
              type="password" 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder={initialData ? "Để trống nếu không đổi mật khẩu" : ""}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-slate-700 placeholder-slate-400"
              data-test-id="user-modal-input-password"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Vai trò *</label>
              {(() => {
                const isEditingCurrent = initialData && initialData.email === currentUserEmail;
                const isEditingAnotherAdmin = initialData && initialData.role === 'ADMIN' && !isEditingCurrent;
                const roleDisabled = isEditingCurrent || isEditingAnotherAdmin;
                let roleTooltip = "";
                if (isEditingCurrent) roleTooltip = "Không thể thay đổi vai trò của chính mình";
                else if (isEditingAnotherAdmin) roleTooltip = "Không thể thay đổi vai trò quản trị viên khác";

                return (
                  <select 
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    disabled={roleDisabled}
                    title={roleTooltip}
                    className={`w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 ${roleDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                    data-test-id="user-modal-select-role"
                  >
                    <option value="ADMIN" data-test-id="user-modal-option-admin">ADMIN</option>
                    <option value="USER" data-test-id="user-modal-option-user">USER</option>
                  </select>
                );
              })()}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Trạng thái *</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                data-test-id="user-modal-select-status"
              >
                <option value="ACTIVE" data-test-id="user-modal-option-active">Active</option>
                <option value="INACTIVE" data-test-id="user-modal-option-inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              data-test-id="user-modal-button-cancel"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
              data-test-id="user-modal-button-submit"
            >
              {isSubmitting ? 'Đang xử lý...' : (initialData ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
