import api from './api';
import toast from 'react-hot-toast';

export const handleApiError = (error) => {
    const message = error.response?.data?.message || 'Có lỗi xảy ra';
    toast.error(message);
    throw error;
};

export const getUsers = async () => {
    try {
        const response = await api.get('/api/admin/users');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const searchUsers = async (keyword) => {
    try {
        const response = await api.get('/api/admin/users/search', { params: { keyword } });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const createUser = async (data) => {
    try {
        const response = await api.post('/api/admin/users', data);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const updateUser = async (id, data) => {
    try {
        const response = await api.put(`/api/admin/users/${id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/api/admin/users/${id}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};
