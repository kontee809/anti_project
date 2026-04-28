import React from 'react';
import { Pencil, Trash2, ArrowUpDown } from 'lucide-react';

const getRoleColor = (role) => {
  switch(role) {
    case 'ADMIN': return 'ui-badge ui-badge-warning';
    case 'USER': return 'ui-badge ui-badge-neutral';
    default: return 'ui-badge ui-badge-neutral';
  }
};

const getStatusColor = (status) => {
  return status?.toUpperCase() === 'ACTIVE' ? 'ui-badge ui-badge-success' : 'ui-badge ui-badge-danger';
};

const UserTable = ({ users, onEdit, onDelete, onSort, currentUserEmail }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="ui-table" data-test-id="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th 
              className="cursor-pointer group"
              onClick={() => onSort('name')}
              data-test-id="user-table-header-name"
            >
              <div className="flex items-center gap-1">Họ và Tên <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" /></div>
            </th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th 
              className="cursor-pointer group"
              onClick={() => onSort('createdAt')}
              data-test-id="user-table-header-date"
            >
              <div className="flex items-center gap-1">Ngày tạo <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" /></div>
            </th>
            <th className="text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="group" data-test-id={`user-table-row-${user.id}`}>
              <td className="font-semibold">{user.id}</td>
              <td className="font-semibold text-slate-900">{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className={getRoleColor(user.role)}>
                  {user.role}
                </span>
              </td>
              <td>
                  <span className={`${getStatusColor(user.status)} inline-flex items-center gap-1.5 w-fit`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${user.status?.toUpperCase() === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  {user.status}
                </span>
              </td>
              <td>
                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </td>
              <td className="text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(user)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-[10px]"
                    title="Chỉnh sửa"
                    data-test-id={`user-table-button-edit-${user.id}`}
                  >
                    <Pencil size={16} />
                  </button>
                  {(() => {
                    const isSelf = user.email === currentUserEmail;
                    const isAnotherAdmin = user.role === 'ADMIN' && !isSelf;
                    const isDisabled = isSelf || isAnotherAdmin;
                    
                    let tooltip = "Xóa";
                    if (isSelf) tooltip = "Không thể xoá chính mình";
                    else if (isAnotherAdmin) tooltip = "Không thể xoá quản trị viên khác";
                    
                    return (
                      <button 
                        onClick={() => {
                          if(!isDisabled && window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.name}?`)) {
                            onDelete(user.id);
                          }
                        }}
                        disabled={isDisabled}
                        className={`p-2 rounded-[10px] ${isDisabled ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                        title={tooltip}
                        data-test-id={`user-table-button-delete-${user.id}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    );
                  })()}
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="7" className="p-12 text-center">
                <p className="text-lg font-semibold text-slate-700">Chưa có dữ liệu người dùng</p>
                <p className="text-sm text-slate-400 mt-1">Thử thay đổi từ khóa tìm kiếm hoặc thêm người dùng mới.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
