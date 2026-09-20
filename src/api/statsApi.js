import { apiClient } from './authApi';

export const statsApi = {
  // 1. Get Live Homepage Metric Counts
  getHomepageStats: async () => {
    try {
      const res = await apiClient.get('/stats/homepage');
      return res.data;
    } catch (err) {
      console.warn('Failed to fetch live homepage stats:', err);
      return { success: false };
    }
  },

  // 2. Get Live Community Feed (News, Events, Stories)
  getCommunityFeed: async () => {
    try {
      const res = await apiClient.get('/stats/community-feed');
      return res.data;
    } catch (err) {
      console.warn('Failed to fetch community feed:', err);
      return { success: false };
    }
  }
};
