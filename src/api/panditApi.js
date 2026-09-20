import { apiClient } from './authApi';

export const panditApi = {
  // Master Data (Services, Languages, Vedas, Titles)
  getMasterData: async () => {
    const response = await apiClient.get('/pandits/master-data');
    return response.data;
  },

  // Logged-in Pandit's Profile
  getMyProfile: async () => {
    const response = await apiClient.get('/pandits/me');
    return response.data;
  },

  // Save Step by Step
  saveBasicInfo: async (data) => {
    const response = await apiClient.post('/pandits/basic', data);
    return response.data;
  },

  saveReligiousDetails: async (data) => {
    const response = await apiClient.post('/pandits/religious', data);
    return response.data;
  },

  saveServices: async (data) => {
    const response = await apiClient.post('/pandits/services', data);
    return response.data;
  },

  saveLanguages: async (data) => {
    const response = await apiClient.post('/pandits/languages', data);
    return response.data;
  },

  saveEducation: async (data) => {
    const response = await apiClient.post('/pandits/education', data);
    return response.data;
  },

  saveExperience: async (data) => {
    const response = await apiClient.post('/pandits/experience', data);
    return response.data;
  },

  saveLocations: async (data) => {
    const response = await apiClient.post('/pandits/locations', data);
    return response.data;
  },

  saveAvailability: async (data) => {
    const response = await apiClient.post('/pandits/availability', data);
    return response.data;
  },

  // Uploads
  uploadProfilePhoto: async (formData) => {
    const response = await apiClient.post('/pandits/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  uploadDocument: async (formData) => {
    const response = await apiClient.post('/pandits/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteDocument: async (docId) => {
    const response = await apiClient.delete(`/pandits/documents/${docId}`);
    return response.data;
  },

  // Submit for Review
  submitForVerification: async () => {
    const response = await apiClient.post('/pandits/submit');
    return response.data;
  },

  // Public Directory & Profile
  getPublicDirectory: async (params = {}) => {
    const response = await apiClient.get('/pandits/public/directory', { params });
    return response.data;
  },

  getPublicProfileBySlug: async (slug) => {
    const response = await apiClient.get(`/pandits/public/${slug}`);
    return response.data;
  },

  // Admin Endpoints
  adminGetAllPandits: async (params = {}) => {
    const response = await apiClient.get('/pandits/admin/pandits', { params });
    return response.data;
  },

  adminGetPanditDetail: async (id) => {
    const response = await apiClient.get(`/pandits/admin/pandits/${id}`);
    return response.data;
  },

  adminModeratePandit: async (id, data) => {
    const response = await apiClient.patch(`/pandits/admin/pandits/${id}/status`, data);
    return response.data;
  },

  adminVerifyDocument: async (id, docId, data) => {
    const response = await apiClient.patch(`/pandits/admin/pandits/${id}/documents/${docId}/verify`, data);
    return response.data;
  }
};
