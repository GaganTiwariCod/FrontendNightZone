import { apiClient } from './authApi';

const handleRequest = async (promise) => {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: error.message || 'An unexpected network error occurred.'
    };
  }
};

export const newsApi = {
  // ==========================================
  // PUBLIC ENDPOINTS
  // ==========================================
  getPublicNews: async (params = {}) => {
    return handleRequest(apiClient.get('/local-updates', { params }));
  },

  getNewsBySlug: async (slug) => {
    return handleRequest(apiClient.get(`/local-updates/${slug}`));
  },

  getCategories: async () => {
    return handleRequest(apiClient.get('/local-updates/categories'));
  },

  getFeaturedNews: async () => {
    return handleRequest(apiClient.get('/local-updates/featured'));
  },

  getLatestNews: async () => {
    return handleRequest(apiClient.get('/local-updates/latest'));
  },

  getRelatedNews: async (slug) => {
    return handleRequest(apiClient.get(`/local-updates/${slug}/related`));
  },

  // ==========================================
  // ADMIN ENDPOINTS
  // ==========================================
  getAdminOverview: async () => {
    return handleRequest(apiClient.get('/admin/local-updates/overview'));
  },

  getAdminNews: async (params = {}) => {
    return handleRequest(apiClient.get('/admin/local-updates/news', { params }));
  },

  updateNewsStatus: async (id, status) => {
    return handleRequest(apiClient.patch(`/admin/local-updates/news/${id}/status`, { status }));
  },

  updateNewsDetails: async (id, data) => {
    return handleRequest(apiClient.put(`/admin/local-updates/news/${id}`, data));
  },

  deleteNews: async (id) => {
    return handleRequest(apiClient.delete(`/admin/local-updates/news/${id}`));
  },

  // Sources
  getAdminSources: async () => {
    return handleRequest(apiClient.get('/admin/local-updates/sources'));
  },

  createSource: async (data) => {
    return handleRequest(apiClient.post('/admin/local-updates/sources', data));
  },

  updateSource: async (id, data) => {
    return handleRequest(apiClient.put(`/admin/local-updates/sources/${id}`, data));
  },

  triggerSourceFetch: async (id) => {
    return handleRequest(apiClient.post(`/admin/local-updates/sources/${id}/fetch`));
  },

  // Keywords
  getAdminKeywords: async (params = {}) => {
    return handleRequest(apiClient.get('/admin/local-updates/keywords', { params }));
  },

  createKeyword: async (data) => {
    return handleRequest(apiClient.post('/admin/local-updates/keywords', data));
  },

  updateKeyword: async (id, data) => {
    return handleRequest(apiClient.put(`/admin/local-updates/keywords/${id}`, data));
  },

  deleteKeyword: async (id) => {
    return handleRequest(apiClient.delete(`/admin/local-updates/keywords/${id}`));
  },

  // Categories
  getAdminCategories: async () => {
    return handleRequest(apiClient.get('/admin/local-updates/categories'));
  },

  createCategory: async (data) => {
    return handleRequest(apiClient.post('/admin/local-updates/categories', data));
  },

  updateCategory: async (id, data) => {
    return handleRequest(apiClient.put(`/admin/local-updates/categories/${id}`, data));
  },

  // Fetch Logs
  getFetchLogs: async (params = {}) => {
    return handleRequest(apiClient.get('/admin/local-updates/fetch-logs', { params }));
  }
};
