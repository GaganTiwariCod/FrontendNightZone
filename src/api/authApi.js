import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Passes HTTP-only refreshToken cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach bearer token from localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('shubhkaal_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/register') &&
      !originalRequest.url.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        if (data?.data?.accessToken) {
          localStorage.setItem('shubhkaal_access_token', data.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        localStorage.removeItem('shubhkaal_access_token');
        localStorage.removeItem('shubhkaal_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authApi = {
  // 1. Email & Password Login
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  // 2. Email & Password Registration
  register: async (name, email, password, phone = null, role = 'CUSTOMER') => {
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password,
      phone: phone || undefined,
      role: (role || 'CUSTOMER').toUpperCase(),
    });
    return response.data;
  },

  // 3. Google OAuth 2.0
  googleAuth: async (tokenData, role = 'CUSTOMER') => {
    const uppercaseRole = (role || 'CUSTOMER').toUpperCase();
    const payload = typeof tokenData === 'string' 
      ? { idToken: tokenData, role: uppercaseRole }
      : { ...tokenData, role: uppercaseRole };
    const response = await apiClient.post('/auth/google', payload);
    return response.data;
  },

  // 4. Send Email OTP
  sendEmailOtp: async (email, type = 'LOGIN') => {
    const response = await apiClient.post('/auth/send-email-otp', { email, type });
    return response.data;
  },

  // 5. Verify Email OTP & Login/Register
  verifyEmailOtp: async (email, otp, name = null, phone = null, role = 'CUSTOMER') => {
    const response = await apiClient.post('/auth/verify-email-otp', {
      email,
      otp,
      name: name || undefined,
      phone: phone || undefined,
      role: (role || 'CUSTOMER').toUpperCase(),
    });
    return response.data;
  },

  // 6. Get Logged In User Profile
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // 7. Logout
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};
