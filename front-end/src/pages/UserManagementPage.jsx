import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTable from '../components/UserManagement/UserTable';
import UserModal from '../components/UserManagement/UserModal';
import Pagination from '../components/UserManagement/Pagination';
import SuccessDialog from '../components/SuccessDialog';
import { Search, Plus } from 'lucide-react';
import { getUsers, searchUsers, createUser, updateUser, deleteUser } from '../services/userService';
import toast from 'react-hot-toast';

const UserManagementPage = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const currentUserEmail = localStorage.getItem('email');

  useEffect(() => {
    if (role !== 'ADMIN') {
      navigate('/');
    }
  }, [role, navigate]);

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const fetchUsersData = async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      // Error is handled globally by userService handleApiError
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      fetchUsersData();
    }
  }, [searchTerm]);

  // Handle Search hitting Enter or debounced
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm) {
        setIsLoading(true);
        try {
          const data = await searchUsers(searchTerm);
          setUsers(data);
        } catch (error) {
          // Handled globally
        } finally {
          setIsLoading(false);
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const sortedUsers = useMemo(() => {
    let result = [...users];
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [users, sortConfig]);

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const paginatedUsers = sortedUsers.slice(
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

  const handleModalSubmit = async (data) => {
    const payload = {
      ...data,
      role: data.role.toUpperCase(),
      status: data.status.toUpperCase()
    };

    try {
      if (editingUser) {
        await updateUser(editingUser.id, payload);
        setDialogMessage("Sửa thành công");
      } else {
        await createUser(payload);
        setDialogMessage("Thêm thành công");
      }
      setShowDialog(true);
      setIsModalOpen(false);
      // Refresh list
      if (searchTerm) {
         const searched = await searchUsers(searchTerm);
         setUsers(searched);
      } else {
         fetchUsersData();
      }
    } catch (error) {
      // Handled globally
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      await deleteUser(id);
      setDialogMessage("Xoá thành công");
      setShowDialog(true);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      // Handled globally
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  if (role !== 'ADMIN') return null;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full pb-20" data-test-id="user-page">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800" data-test-id="user-header-title">Quản lý người dùng</h1>
          <p className="text-slate-500 mt-2 font-medium">Phân quyền, theo dõi và quản lý tài khoản nhân sự</p>
        </div>
        <button 
          onClick={openAddModal}
          disabled={isLoading}
          className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-blue-500/30 transition-all whitespace-nowrap ${isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
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
            Tổng cộng: {users.length} tài khoản
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <UserTable 
            users={paginatedUsers} 
            onEdit={openEditModal}
            onDelete={handleDelete}
            onSort={handleSort}
            sortConfig={sortConfig}
            currentUserEmail={currentUserEmail}
          />
        )}

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
        currentUserEmail={currentUserEmail}
      />

      <SuccessDialog 
        open={showDialog} 
        message={dialogMessage} 
        onClose={() => setShowDialog(false)} 
      />
    </div>
  );
};

export default UserManagementPage;
