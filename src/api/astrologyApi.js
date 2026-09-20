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

export const astrologyApi = {
  // ==========================================
  // 1. PROFILES (SELF & OTHER)
  // ==========================================
  getMyProfiles: async () => {
    return handleRequest(apiClient.get('/astrology/profiles'));
  },

  createProfile: async (profileData) => {
    return handleRequest(apiClient.post('/astrology/profiles', profileData));
  },

  getProfileById: async (id) => {
    return handleRequest(apiClient.get(`/astrology/profiles/${id}`));
  },

  updateProfile: async (id, profileData) => {
    return handleRequest(apiClient.put(`/astrology/profiles/${id}`, profileData));
  },

  deleteProfile: async (id) => {
    return handleRequest(apiClient.delete(`/astrology/profiles/${id}`));
  },

  // ==========================================
  // 2. DYNAMIC SERVICES & CATEGORIES
  // ==========================================
  getCategoriesAndServices: async () => {
    return handleRequest(apiClient.get('/astrology/services'));
  },

  getServiceBySlug: async (slug) => {
    return handleRequest(apiClient.get(`/astrology/services/${slug}`));
  },

  // ==========================================
  // 3. ASTROLOGERS DIRECTORY & ONBOARDING
  // ==========================================
  getAstrologers: async (params = {}) => {
    return handleRequest(apiClient.get('/astrology/astrologers', { params }));
  },

  getAstrologerBySlug: async (slug) => {
    return handleRequest(apiClient.get(`/astrology/astrologers/${slug}`));
  },

  registerAstrologer: async (astrologerData) => {
    return handleRequest(apiClient.post('/astrology/astrologers/register', astrologerData));
  },

  getMyAstrologerProfile: async () => {
    return handleRequest(apiClient.get('/astrology/astrologers/me/profile'));
  },

  // ==========================================
  // 4. KUNDLI & KUNDLI MATCHING
  // ==========================================
  generateKundli: async (astrology_profile_id) => {
    return handleRequest(apiClient.post('/astrology/kundli/generate', { astrology_profile_id }));
  },

  calculateKundliMatching: async (person_a_profile_id, person_b_profile_id) => {
    return handleRequest(apiClient.post('/astrology/kundli/match', { person_a_profile_id, person_b_profile_id }));
  },

  // ==========================================
  // 5. BOOKINGS, CONSULTATIONS & REPORTS
  // ==========================================
  createBooking: async (bookingData) => {
    return handleRequest(apiClient.post('/astrology/bookings', bookingData));
  },

  getMyBookings: async () => {
    return handleRequest(apiClient.get('/astrology/bookings'));
  },

  getMyReports: async () => {
    return handleRequest(apiClient.get('/astrology/reports'));
  },

  getConsultationDetails: async (id) => {
    return handleRequest(apiClient.get(`/astrology/consultations/${id}`));
  },

  sendConsultationMessage: async (id, messageData) => {
    return handleRequest(apiClient.post(`/astrology/consultations/${id}/messages`, messageData));
  },

  completeConsultation: async (id, completionData) => {
    return handleRequest(apiClient.post(`/astrology/consultations/${id}/complete`, completionData));
  },

  submitReview: async (reviewData) => {
    return handleRequest(apiClient.post('/astrology/consultations/review', reviewData));
  },

  // ==========================================
  // 6. ADMIN MODERATION & ANALYTICS
  // ==========================================
  getAdminAstrologers: async (params = {}) => {
    return handleRequest(apiClient.get('/admin/astrology/astrologers', { params }));
  },

  verifyAstrologer: async (id, verificationData) => {
    return handleRequest(apiClient.put(`/admin/astrology/astrologers/${id}/verify`, verificationData));
  },

  getAdminAnalytics: async () => {
    return handleRequest(apiClient.get('/admin/astrology/analytics'));
  }
};
