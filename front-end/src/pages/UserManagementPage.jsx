import React, { useState, useMemo } from 'react';
import { useUserStore } from '../store/useUserStore';
import UserTable from '../components/UserManagement/UserTable';
import UserModal from '../components/UserManagement/UserModal';
import Pagination from '../components/UserManagement/Pagination';
import { Search, Plus } from 'lucide-react';

const UserManagementPage = () => {
  const { users, addUser, updateUser, deleteUser } = useUserStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const filteredAndSortedUsers = useMemo(() => {
    let result = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [users, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / usersPerPage);
  const paginatedUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * usersPerPage, 
    currentPage * usersPerPage
  );

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const openAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data) => {
    if (editingUser) {
      updateUser(editingUser.id, data);
    } else {
      addUser(data);
    }
  };

  React.useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full pb-20" data-test-id="user-page">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800" data-test-id="user-header-title">Quản lý người dùng</h1>
          <p className="text-slate-500 mt-2 font-medium">Phân quyền, theo dõi và quản lý tài khoản nhân sự</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 whitespace-nowrap"
          data-test-id="user-button-add"
        >
          <Plus size={18} />
          <span>Thêm người dùng</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên hoặc email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 transition-all"
              data-test-id="user-input-search"
            />
          </div>
          <div className="text-sm font-semibold text-slate-500 ml-4 whitespace-nowrap" data-test-id="user-text-total">
            Tổng cộng: {filteredAndSortedUsers.length} tài khoản
          </div>
        </div>

        <UserTable 
          users={paginatedUsers} 
          onEdit={openEditModal}
          onDelete={deleteUser}
          onSort={handleSort}
          sortConfig={sortConfig}
        />

        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </div>

      <UserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingUser}
      />
    </div>
  );
};

export default UserManagementPage;
