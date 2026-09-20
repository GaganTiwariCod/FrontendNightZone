import { apiClient } from './authApi';

export const spiritualApi = {
  // 1. Get Master Data
  getMasters: async () => {
    const response = await apiClient.get('/spiritual-content/masters');
    return response.data;
  },

  // 2. Get Public Content Directory (Search, Filters, Pagination)
  getDirectory: async (params = {}) => {
    const response = await apiClient.get('/spiritual-content', { params });
    return response.data;
  },

  // 3. Get Content Details by Slug
  getContentBySlug: async (slug, lang = 'hi') => {
    const response = await apiClient.get(`/spiritual-content/${slug}`, {
      params: { lang }
    });
    return response.data;
  },

  // 4. Submit Public Content Request
  submitRequest: async (data) => {
    const response = await apiClient.post('/spiritual-content/requests', data);
    return response.data;
  },

  // --- Admin CMS APIs ---

  // 5. Admin Dashboard Statistics
  adminGetDashboardStats: async () => {
    const response = await apiClient.get('/spiritual-content/admin/dashboard-stats');
    return response.data;
  },

  // 6. Admin Content List
  adminGetContents: async (params = {}) => {
    const response = await apiClient.get('/spiritual-content/admin/contents', { params });
    return response.data;
  },

  // 7. Admin Content Detail for Editing
  adminGetContentDetail: async (id) => {
    const response = await apiClient.get(`/spiritual-content/admin/contents/${id}`);
    return response.data;
  },

  // 8. Admin Create Content
  adminCreateContent: async (data) => {
    const response = await apiClient.post('/spiritual-content/admin/contents', data);
    return response.data;
  },

  // 9. Admin Update Content
  adminUpdateContent: async (id, data) => {
    const response = await apiClient.put(`/spiritual-content/admin/contents/${id}`, data);
    return response.data;
  },

  // 10. Admin Delete Content
  adminDeleteContent: async (id) => {
    const response = await apiClient.delete(`/spiritual-content/admin/contents/${id}`);
    return response.data;
  },

  // 11. Admin Quick Status Toggle
  adminUpdateStatus: async (id, status) => {
    const response = await apiClient.patch(`/spiritual-content/admin/contents/${id}/status`, { status });
    return response.data;
  },

  // 12. Admin Toggle Featured
  adminToggleFeatured: async (id) => {
    const response = await apiClient.patch(`/spiritual-content/admin/contents/${id}/feature`);
    return response.data;
  },

  // 13. Admin Cover Image Upload
  adminUploadCover: async (formData) => {
    const response = await apiClient.post('/spiritual-content/admin/upload-cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // 14. Admin Get Content Requests
  adminGetRequests: async (params = {}) => {
    const response = await apiClient.get('/spiritual-content/admin/requests', { params });
    return response.data;
  },

  // 15. Admin Update Request Status
  adminUpdateRequestStatus: async (id, data) => {
    const response = await apiClient.patch(`/spiritual-content/admin/requests/${id}/status`, data);
    return response.data;
  }
};
