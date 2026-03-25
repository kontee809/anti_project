import React from 'react';
import { Pencil, Trash2, ArrowUpDown } from 'lucide-react';

const getRoleColor = (role) => {
  switch(role) {
    case 'Admin': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Operator': return 'bg-blue-100 text-blue-700 border-blue-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

const getStatusColor = (status) => {
  return status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200';
};

const UserTable = ({ users, onEdit, onDelete, onSort, currentUserEmail }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse" data-test-id="user-table">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
            <th 
              className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group"
              onClick={() => onSort('name')}
              data-test-id="user-table-header-name"
            >
              <div className="flex items-center gap-1">Họ và Tên <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" /></div>
            </th>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vai trò</th>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
            <th 
              className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group"
              onClick={() => onSort('createdAt')}
              data-test-id="user-table-header-date"
            >
              <div className="flex items-center gap-1">Ngày tạo <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" /></div>
            </th>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group" data-test-id={`user-table-row-${user.id}`}>
              <td className="p-4 text-sm font-semibold text-slate-600">{user.id}</td>
              <td className="p-4 text-sm font-bold text-slate-800">{user.name}</td>
              <td className="p-4 text-sm font-medium text-slate-500">{user.email}</td>
              <td className="p-4">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </td>
              <td className="p-4">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${getStatusColor(user.status)} flex items-center gap-1.5 w-fit`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  {user.status}
                </span>
              </td>
              <td className="p-4 text-sm font-medium text-slate-500">
                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(user)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                        className={`p-2 rounded-lg transition-colors ${isDisabled ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
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
              <td colSpan="7" className="p-8 text-center text-slate-500 font-medium">
                Không tìm thấy người dùng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
