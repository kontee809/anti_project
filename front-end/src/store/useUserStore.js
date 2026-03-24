import { create } from 'zustand';

// Generate Mock Users
const generateMockUsers = () => {
  const roles = ['Admin', 'Operator', 'User'];
  const baseNames = ['Nguyễn Văn', 'Trần Thị', 'Lê Hoàng', 'Phạm Minh', 'Hoàng', 'Vũ', 'Đặng', 'Bùi'];
  const lastNames = ['A', 'B', 'C', 'Anh', 'Minh', 'Hải', 'Linh', 'Lan', 'Long'];

  return Array.from({ length: 28 }).map((_, i) => {
    const name = `${baseNames[i % baseNames.length]} ${lastNames[i % lastNames.length]}`;
    return {
      id: `USR-${1000 + i}`,
      name,
      email: `user${i}@thuyphominh.vn`,
      role: i === 0 ? 'Admin' : roles[i % 3],
      status: i % 5 === 0 ? 'Inactive' : 'Active',
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    };
  });
};

export const useUserStore = create((set) => ({
  users: generateMockUsers(),
  
  addUser: (userData) => set((state) => ({
    users: [
      {
        ...userData,
        id: `USR-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString()
      },
      ...state.users
    ]
  })),

  updateUser: (id, updatedData) => set((state) => ({
    users: state.users.map(u => u.id === id ? { ...u, ...updatedData } : u)
  })),

  deleteUser: (id) => set((state) => ({
    users: state.users.filter(u => u.id !== id)
  }))
}));
