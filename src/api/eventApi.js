import { apiClient } from './authApi';

export const eventApi = {
  // --- Public Discovery & Details ---
  getCategories: async () => {
    const response = await apiClient.get('/events/categories');
    return response.data;
  },

  getEvents: async (params = {}) => {
    const response = await apiClient.get('/events', { params });
    return response.data;
  },

  getFeaturedEvents: async (limit = 6) => {
    const response = await apiClient.get('/events/featured', { params: { limit } });
    return response.data;
  },

  getEventBySlug: async (slug) => {
    const response = await apiClient.get(`/events/${slug}`);
    return response.data;
  },

  // --- Participation ("Raise Hand") & Interaction ---
  raiseHand: async (eventId, data) => {
    const response = await apiClient.post(`/events/${eventId}/raise-hand`, data);
    return response.data;
  },

  cancelParticipation: async (eventId) => {
    const response = await apiClient.post(`/events/${eventId}/cancel`);
    return response.data;
  },

  toggleFavorite: async (eventId) => {
    const response = await apiClient.post(`/events/${eventId}/favorite`);
    return response.data;
  },

  reportEvent: async (eventId, data) => {
    const response = await apiClient.post(`/events/${eventId}/report`, data);
    return response.data;
  },

  // --- Organizer Management ---
  getMyOrganizedEvents: async (params = {}) => {
    const response = await apiClient.get('/events/organizer/my-events', { params });
    return response.data;
  },

  createEvent: async (data) => {
    const response = await apiClient.post('/events/organizer/events', data);
    return response.data;
  },

  updateEvent: async (id, data) => {
    const response = await apiClient.put(`/events/organizer/events/${id}`, data);
    return response.data;
  },

  cancelEvent: async (id, data) => {
    const response = await apiClient.post(`/events/organizer/events/${id}/cancel`, data);
    return response.data;
  },

  uploadCoverImage: async (formData) => {
    const response = await apiClient.post('/events/organizer/upload-cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getEventParticipants: async (id, params = {}) => {
    const response = await apiClient.get(`/events/organizer/events/${id}/participants`, { params });
    return response.data;
  },

  moderateParticipant: async (id, participantId, data) => {
    const response = await apiClient.patch(`/events/organizer/events/${id}/participants/${participantId}`, data);
    return response.data;
  },

  checkInAttendance: async (id, data) => {
    const response = await apiClient.post(`/events/organizer/events/${id}/attendance`, data);
    return response.data;
  },

  getAnnouncements: async (id) => {
    const response = await apiClient.get(`/events/organizer/events/${id}/announcements`);
    return response.data;
  },

  createAnnouncement: async (id, data) => {
    const response = await apiClient.post(`/events/organizer/events/${id}/announcements`, data);
    return response.data;
  },

  // --- Meetups (Carpool / Group Travel) ---
  getEventMeetups: async (eventId) => {
    const response = await apiClient.get(`/events/${eventId}/meetups`);
    return response.data;
  },

  createMeetup: async (eventId, data) => {
    const response = await apiClient.post(`/events/${eventId}/meetups`, data);
    return response.data;
  },

  joinMeetup: async (eventId, meetupId, data) => {
    const response = await apiClient.post(`/events/${eventId}/meetups/${meetupId}/join`, data);
    return response.data;
  },

  leaveMeetup: async (eventId, meetupId) => {
    const response = await apiClient.post(`/events/${eventId}/meetups/${meetupId}/leave`);
    return response.data;
  },

  moderateMeetupMember: async (eventId, meetupId, memberId, data) => {
    const response = await apiClient.patch(`/events/${eventId}/meetups/${meetupId}/members/${memberId}`, data);
    return response.data;
  },

  // --- Admin Moderation & Management ---
  adminGetDashboardStats: async () => {
    const response = await apiClient.get('/admin/events/dashboard-stats');
    return response.data;
  },

  adminGetEvents: async (params = {}) => {
    const response = await apiClient.get('/admin/events', { params });
    return response.data;
  },

  adminUpdateEventStatus: async (id, data) => {
    const response = await apiClient.patch(`/admin/events/${id}/status`, data);
    return response.data;
  },

  adminToggleFeatured: async (id) => {
    const response = await apiClient.patch(`/admin/events/${id}/feature`);
    return response.data;
  },

  adminGetReports: async (params = {}) => {
    const response = await apiClient.get('/admin/events/reports', { params });
    return response.data;
  },

  adminResolveReport: async (id, data) => {
    const response = await apiClient.patch(`/admin/events/reports/${id}`, data);
    return response.data;
  },

  adminGetCategories: async () => {
    const response = await apiClient.get('/admin/events/categories');
    return response.data;
  },

  adminSaveCategory: async (data) => {
    const response = await apiClient.post('/admin/events/categories', data);
    return response.data;
  },

  adminUpdateCategory: async (id, data) => {
    const response = await apiClient.put(`/admin/events/categories/${id}`, data);
    return response.data;
  }
};
