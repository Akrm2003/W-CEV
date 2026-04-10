import { api } from './api';

export const componentService = {
  // AI Generation
  generateComponent: async (prompt) => {
    return api.post('/messages/create_component', { message: prompt });
  },

  // CRUD
  getComponents: async (search = '', sortBy = 'updated_at', order = 'desc') => {
    const params = new URLSearchParams({ search, sort_by: sortBy, order });
    return api.get(`/components?${params.toString()}`);
  },

  getComponent: async (id) => {
    return api.get(`/components/${id}`);
  },

  createComponent: async (data) => {
    return api.post('/components', data);
  },

  updateComponent: async (id, data) => {
    return api.put(`/components/${id}`, data);
  },

  deleteComponent: async (id) => {
    return api.delete(`/components/${id}`);
  }
};
