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
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" data-test-id="user-modal-container">
      <div className="bg-white rounded-[14px] shadow-[var(--shadow-xl)] w-full max-w-md overflow-hidden fade-slide-in" data-test-id="user-modal">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-[10px]" data-test-id="user-modal-button-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" data-test-id="user-modal-form">
          <div>
            <label className="ui-label">Họ và Tên *</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="ui-input"
              data-test-id="user-modal-input-name"
            />
          </div>

          <div>
            <label className="ui-label">Email *</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="ui-input"
              data-test-id="user-modal-input-email"
            />
          </div>

          <div>
            <label className="ui-label">Mật khẩu {initialData ? '(Tùy chọn)' : '*'}</label>
            <input 
              required={!initialData}
              type="password" 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder={initialData ? "Để trống nếu không đổi mật khẩu" : ""}
              className="ui-input"
              data-test-id="user-modal-input-password"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="ui-label">Vai trò *</label>
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
                    className={`ui-select ${roleDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                    data-test-id="user-modal-select-role"
                  >
                    <option value="ADMIN" data-test-id="user-modal-option-admin">ADMIN</option>
                    <option value="USER" data-test-id="user-modal-option-user">USER</option>
                  </select>
                );
              })()}
            </div>
            <div>
              <label className="ui-label">Trạng thái *</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="ui-select"
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
              className="ui-btn ui-btn-secondary flex-1"
              data-test-id="user-modal-button-cancel"
            >
              Hủy bỏ
            </button>
            <button
              type="submit" 
              disabled={isSubmitting}
              className={`ui-btn ui-btn-primary flex-1 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
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
