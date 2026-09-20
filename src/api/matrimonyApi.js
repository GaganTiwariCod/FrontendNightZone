import { apiClient } from './authApi';

export const matrimonyApi = {
  // 1. Get logged in user's profile + completion stats
  getMyProfile: async () => {
    const response = await apiClient.get('/matrimony/me');
    return response.data;
  },

  // 2. Save individual step
  saveStep: async (stepName, data) => {
    const response = await apiClient.post(`/matrimony/step/${stepName}`, data);
    return response.data;
  },

  // 3. Upload photo
  uploadPhoto: async (formData) => {
    const response = await apiClient.post('/matrimony/photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // 4. Delete photo
  deletePhoto: async (photoId) => {
    const response = await apiClient.delete(`/matrimony/photos/${photoId}`);
    return response.data;
  },

  // 5. Set primary photo
  setPrimaryPhoto: async (photoId) => {
    const response = await apiClient.patch(`/matrimony/photos/${photoId}/primary`);
    return response.data;
  },

  // 6. Add Family Member
  addFamilyMember: async (data) => {
    const response = await apiClient.post('/matrimony/family-members', data);
    return response.data;
  },

  // 7. Delete Family Member
  deleteFamilyMember: async (id) => {
    const response = await apiClient.delete(`/matrimony/family-members/${id}`);
    return response.data;
  },

  // 8. Publish / Unpublish
  publishProfile: async () => {
    const response = await apiClient.post('/matrimony/publish');
    return response.data;
  },

  unpublishProfile: async () => {
    const response = await apiClient.post('/matrimony/unpublish');
    return response.data;
  },

  // 9. Profile Preview
  getProfilePreview: async (profileId = null) => {
    const url = profileId ? `/matrimony/preview/${profileId}` : '/matrimony/preview';
    const response = await apiClient.get(url);
    return response.data;
  },

  // 10. Browse & Search Profiles
  browseProfiles: async (params = {}) => {
    const response = await apiClient.get('/matrimony/browse', { params });
    return response.data;
  },

  // 11. Master Data
  getMasterData: async () => {
    const response = await apiClient.get('/matrimony/master-data');
    return response.data;
  },

  // 12. Admin Endpoints
  adminGetAllProfiles: async (params = {}) => {
    const response = await apiClient.get('/matrimony/admin/profiles', { params });
    return response.data;
  },

  adminGetProfileDetail: async (id) => {
    const response = await apiClient.get(`/matrimony/admin/profiles/${id}`);
    return response.data;
  },

  adminUpdateProfileStatus: async (id, data) => {
    const response = await apiClient.patch(`/matrimony/admin/profiles/${id}/status`, data);
    return response.data;
  },

  adminUpdatePhotoStatus: async (photoId, status) => {
    const response = await apiClient.patch(`/matrimony/admin/photos/${photoId}/status`, { status });
    return response.data;
  }
};
