import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('shubhkaal_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('shubhkaal_access_token') || null;
  });

  const [loading, setLoading] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('dashboard'); // 'dashboard' | 'auth' | 'matrimony' | 'matrimony-wizard' | 'matrimony-preview' | 'matrimony-browse' | 'matrimony-admin' | 'pandit-directory' | 'pandit-profile' | 'pandit-wizard' | 'pandit-admin' | 'spiritual' | 'spiritual-detail' | 'spiritual-admin'
  const [matrimonyWizardStep, setMatrimonyWizardStep] = useState(2);
  const [previewProfileId, setPreviewProfileId] = useState(null);
  const [selectedPanditSlug, setSelectedPanditSlug] = useState(null);
  const [panditWizardStep, setPanditWizardStep] = useState(1);
  const [selectedSpiritualSlug, setSelectedSpiritualSlug] = useState(null);
  const [spiritualLang, setSpiritualLang] = useState('hi');
  const [authDefaultTab, setAuthDefaultTab] = useState('login'); // 'login' | 'signup'
  const [authTargetService, setAuthTargetService] = useState(null);
  const [activeServiceModal, setActiveServiceModal] = useState(null);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const persistSession = (userData, token) => {
    const isAvatarUrl = userData.avatar && (userData.avatar.startsWith('http') || userData.avatar.startsWith('/'));
    const initials = (userData.name || userData.email || 'SM')
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const formattedUser = {
      id: userData.id,
      name: userData.name || userData.email?.split('@')[0] || 'Shubhkaal Member',
      email: userData.email,
      phone: userData.phone || '',
      role: userData.role || 'customer',
      avatar: isAvatarUrl ? userData.avatar : null,
      initials: isAvatarUrl ? null : (userData.avatar || initials),
      auth_provider: userData.auth_provider || 'LOCAL',
      joinedAt: userData.created_at ? new Date(userData.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '2026',
    };

    setUser(formattedUser);
    localStorage.setItem('shubhkaal_user', JSON.stringify(formattedUser));

    if (token) {
      setAccessToken(token);
      localStorage.setItem('shubhkaal_access_token', token);
    }

    if (authTargetService === 'Marriage' || authTargetService === 'Matrimony') {
      setCurrentScreen('matrimony');
      setAuthTargetService(null);
    } else if (authTargetService === 'Register as Pandit' || authTargetService === 'Pandit Registration') {
      setCurrentScreen('pandit-wizard');
      setAuthTargetService(null);
    } else if (authTargetService === 'Find Pandit' || authTargetService === 'Pandit') {
      setCurrentScreen('pandit-directory');
      setAuthTargetService(null);
    } else if (authTargetService) {
      setCurrentScreen('dashboard');
      setActiveServiceModal(authTargetService);
      setAuthTargetService(null);
    } else {
      setCurrentScreen('dashboard');
    }
  };

  // Sync user profile on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('shubhkaal_access_token');
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res?.data) {
            persistSession(res.data, token);
          }
        } catch (err) {
          console.warn('Session verification failed:', err.response?.data?.message || err.message);
        }
      }
    };
    initAuth();
  }, []);

  // 1. Login with Email & Password
  const loginWithPassword = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      if (res.success && res.data) {
        persistSession(res.data.user, res.data.accessToken);
        showToast(`Welcome back, ${res.data.user.name || 'Member'}!`);
        return { success: true };
      }
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Invalid credentials.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // 2. Register with Name, Email & Password
  const registerWithPassword = async (name, email, password, phone = null) => {
    setLoading(true);
    try {
      const res = await authApi.register(name, email, password, phone);
      if (res.success && res.data) {
        persistSession(res.data.user, res.data.accessToken);
        showToast(`Registration successful! Welcome to Shubhkaal, ${res.data.user.name}`);
        return { success: true };
      }
      throw new Error(res.message || 'Registration failed');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // 3. Send Email OTP
  const sendEmailOtp = async (email, type = 'LOGIN') => {
    setLoading(true);
    try {
      const res = await authApi.sendEmailOtp(email, type);
      if (res.success) {
        showToast(res.message || `Verification code sent to ${email}`);
        return { 
          success: true, 
          devOtp: res.data?.devOtp || null 
        };
      }
      throw new Error(res.message || 'Failed to send OTP');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Could not send verification OTP.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // 4. Verify Email OTP
  const verifyEmailOtp = async (email, otp, name = null, phone = null) => {
    setLoading(true);
    try {
      const res = await authApi.verifyEmailOtp(email, otp, name, phone);
      if (res.success && res.data) {
        persistSession(res.data.user, res.data.accessToken);
        showToast(`Signed in successfully! Welcome, ${res.data.user.name}`);
        return { success: true };
      }
      throw new Error(res.message || 'Invalid OTP code');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Invalid or expired OTP.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // 5. Google OAuth 2.0
  const loginWithGoogle = async (idToken) => {
    setLoading(true);
    try {
      const res = await authApi.googleAuth(idToken);
      if (res.success && res.data) {
        persistSession(res.data.user, res.data.accessToken);
        showToast(`Signed in with Google! Welcome, ${res.data.user.name}`);
        return { success: true };
      }
      throw new Error(res.message || 'Google authentication failed');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Google authentication failed.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // 6. Logout
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // ignore network errors on logout
    }
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('shubhkaal_user');
    localStorage.removeItem('shubhkaal_access_token');
    showToast('Signed out successfully.', 'info');
  };

  // Service click interception
  const handleServiceClick = (serviceName, serviceData = null) => {
    if (serviceName === 'Marriage' || serviceName === 'Matrimony') {
      if (!user) {
        setAuthTargetService('Marriage');
        setAuthDefaultTab('login');
        setCurrentScreen('auth');
        showToast('Please sign in or create an account to access Matrimonial Profiles.', 'info');
      } else {
        setCurrentScreen('matrimony');
      }
      return;
    }

    if (serviceName === 'Find Pandit' || serviceName === 'Pandit') {
      setCurrentScreen('pandit-directory');
      return;
    }

    if (serviceName === 'Stories' || serviceName === 'Spiritual' || serviceName === 'Katha' || serviceName === 'Pooja' || serviceName === 'Mantra' || serviceName === 'Aarti') {
      setCurrentScreen('spiritual');
      return;
    }

    if (serviceName === 'Register as Pandit' || serviceName === 'Register as pandit' || serviceName === 'Pandit Registration') {
      if (!user) {
        setAuthTargetService('Register as Pandit');
        setAuthDefaultTab('login');
        setCurrentScreen('auth');
        showToast('Please sign in to register as an authenticated Pandit.', 'info');
      } else {
        setCurrentScreen('pandit-wizard');
      }
      return;
    }

    if (!user) {
      setAuthTargetService(serviceName);
      setAuthDefaultTab('login');
      setCurrentScreen('auth');
      showToast(`Please sign in or create an account to access ${serviceName}.`, 'info');
    } else {
      setActiveServiceModal({ name: serviceName, data: serviceData });
    }
  };

  const openAuth = (serviceName = null, defaultTab = 'login') => {
    setAuthTargetService(serviceName);
    setAuthDefaultTab(defaultTab);
    setCurrentScreen('auth');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        loading,
        loginWithPassword,
        registerWithPassword,
        sendEmailOtp,
        verifyEmailOtp,
        loginWithGoogle,
        logout,
        currentScreen,
        setCurrentScreen,
        matrimonyWizardStep,
        setMatrimonyWizardStep,
        previewProfileId,
        setPreviewProfileId,
        selectedPanditSlug,
        setSelectedPanditSlug,
        panditWizardStep,
        setPanditWizardStep,
        selectedSpiritualSlug,
        setSelectedSpiritualSlug,
        spiritualLang,
        setSpiritualLang,
        authDefaultTab,
        setAuthDefaultTab,
        authTargetService,
        setAuthTargetService,
        activeServiceModal,
        setActiveServiceModal,
        selectedCity,
        setSelectedCity,
        searchQuery,
        setSearchQuery,
        handleServiceClick,
        openAuth,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
