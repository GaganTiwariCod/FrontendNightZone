import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

export default function AuthScreen() {
  const { 
    loginWithPassword,
    registerWithPassword,
    sendEmailOtp,
    verifyEmailOtp,
    loginWithGoogle,
    loading,
    authDefaultTab, 
    authTargetService, 
    setAuthTargetService, 
    setCurrentScreen 
  } = useAuth();

  const [tab, setTab] = useState(authDefaultTab || 'login'); // 'login' | 'signup'
  const [loginMethod, setLoginMethod] = useState('pw'); // 'pw' | 'email-otp'
  const [signupMethod, setSignupMethod] = useState('pw'); // 'pw' | 'email-otp'
  
  // 1. Password Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // 2. Email OTP Login state
  const [loginOtpEmail, setLoginOtpEmail] = useState('');
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtpDigits, setLoginOtpDigits] = useState(['', '', '', '']);
  const loginOtpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [devLoginOtp, setDevLoginOtp] = useState(null);
  
  // 3. Signup with Email & Password state
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // 4. Signup with Email OTP state
  const [signupOtpName, setSignupOtpName] = useState('');
  const [signupOtpPhone, setSignupOtpPhone] = useState('');
  const [signupOtpEmail, setSignupOtpEmail] = useState('');
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [signupOtpDigits, setSignupOtpDigits] = useState(['', '', '', '']);
  const signupOtpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [devSignupOtp, setDevSignupOtp] = useState(null);

  // Timer states
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    setTab(authDefaultTab || 'login');
  }, [authDefaultTab]);

  useEffect(() => {
    let interval = null;
    if (timer > 0 && (loginOtpSent || signupOtpSent)) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, loginOtpSent, signupOtpSent]);

  const handleOtpChange = (index, value, isSignup = false) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 1);
    const targetDigits = isSignup ? [...signupOtpDigits] : [...loginOtpDigits];
    const setDigits = isSignup ? setSignupOtpDigits : setLoginOtpDigits;
    const refs = isSignup ? signupOtpRefs : loginOtpRefs;

    targetDigits[index] = cleanValue;
    setDigits(targetDigits);

    if (cleanValue && index < 3) {
      refs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e, isSignup = false) => {
    const targetDigits = isSignup ? signupOtpDigits : loginOtpDigits;
    const refs = isSignup ? signupOtpRefs : loginOtpRefs;

    if (e.key === 'Backspace' && !targetDigits[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  // Trigger Send Email OTP (Login)
  const handleSendLoginOtp = async (e) => {
    e?.preventDefault();
    if (!loginOtpEmail) return;
    const res = await sendEmailOtp(loginOtpEmail, 'LOGIN');
    if (res.success) {
      setLoginOtpSent(true);
      setTimer(30);
      setCanResend(false);
      if (res.devOtp) {
        setDevLoginOtp(res.devOtp);
      }
    }
  };

  // Trigger Send Email OTP (Signup)
  const handleSendSignupOtp = async (e) => {
    e?.preventDefault();
    if (!signupOtpEmail) return;
    const res = await sendEmailOtp(signupOtpEmail, 'SIGNUP');
    if (res.success) {
      setSignupOtpSent(true);
      setTimer(30);
      setCanResend(false);
      if (res.devOtp) {
        setDevSignupOtp(res.devOtp);
      }
    }
  };

  // Verify Login OTP
  const handleVerifyLoginOtp = async (e) => {
    e?.preventDefault();
    const otpCode = loginOtpDigits.join('');
    if (otpCode.length < 4) return;
    await verifyEmailOtp(loginOtpEmail, otpCode);
  };

  // Verify Signup OTP
  const handleVerifySignupOtp = async (e) => {
    e?.preventDefault();
    const otpCode = signupOtpDigits.join('');
    if (otpCode.length < 4) return;
    await verifyEmailOtp(signupOtpEmail, otpCode, signupOtpName, signupOtpPhone);
  };

  // Password Login Submit
  const handleLoginPasswordSubmit = async (e) => {
    e.preventDefault();
    await loginWithPassword(loginEmail, loginPassword);
  };

  // Email & Password Signup Submit
  const handleSignupPasswordSubmit = async (e) => {
    e.preventDefault();
    await registerWithPassword(signupName, signupEmail, signupPassword, signupPhone);
  };

  // Real Google Sign-in trigger
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await loginWithGoogle({
          accessToken: tokenResponse.access_token,
          idToken: tokenResponse.id_token,
          credential: tokenResponse.credential,
        });
      } catch (err) {
        console.error('Google Auth Processing Error:', err);
      }
    },
    onError: (error) => {
      console.warn('Google Login failed or cancelled:', error);
    }
  });

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-[#241631] text-[#2A2036]">
      {/* Background glow and subtle diya pattern */}
      <div className="absolute left-1/2 top-[8%] w-[640px] h-[640px] -translate-x-1/2 auth-glow pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-50 bg-diya-pattern" />

      {/* Top Bar: Return to Dashboard */}
      <div className="relative z-20 w-full max-w-[420px] mb-3 flex items-center justify-between">
        <button
          onClick={() => {
            setAuthTargetService(null);
            setCurrentScreen('dashboard');
          }}
          className="text-sm font-medium text-[#D6C6D4] hover:text-[#E8862B] flex items-center gap-1.5 transition-colors bg-transparent border-0 p-0 cursor-pointer"
        >
          <span>←</span>
          <span>Back to Community Hub</span>
        </button>

        {authTargetService && (
          <span className="text-xs bg-[#E8862B]/20 text-[#F3AC7A] border border-[#E8862B]/40 px-2.5 py-0.5 rounded-full font-medium">
            Access {authTargetService}
          </span>
        )}
      </div>

      {/* Service Access Prompt Alert */}
      {authTargetService && (
        <div className="relative z-20 w-full max-w-[420px] mb-3.5 bg-[#2D1C3C] border border-[#E8862B]/50 rounded-xl p-3 text-center shadow-lg animate-in fade-in">
          <p className="text-xs sm:text-sm text-[#F7EEDC] m-0">
            Sign in or create a free account to unlock <b className="text-[#E8862B]">{authTargetService}</b>
          </p>
        </div>
      )}

      {/* Auth Card */}
      <div className="relative z-20 w-full max-w-[420px] bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[22px] p-6 sm:p-7 shadow-2xl">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5 justify-center mb-5">
          <svg className="w-7.5 h-7.5" viewBox="0 0 40 40" aria-hidden="true">
            <path d="M20 5c2.6 4 4.3 6.6 4.3 9.2A4.3 4.3 0 0 1 20 18.5a4.3 4.3 0 0 1-4.3-4.3C15.7 11.6 17.4 9 20 5z" fill="#E8862B"/>
            <path d="M6 24h28c0 5.5-6.3 9.5-14 9.5S6 29.5 6 24z" fill="none" stroke="#C99A3F" strokeWidth="2.2"/>
            <path d="M3 24h34" stroke="#C99A3F" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
          <b className="font-['Tiro_Devanagari_Hindi',serif] text-[21px] font-normal text-[#241631]">Shubhkaal</b>
        </div>

        {/* Top Tabs */}
        <div className="flex bg-[#F0E5CF] rounded-full p-1 mb-5.5 shadow-inner">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 border-0 rounded-full py-2 text-[14.5px] font-semibold transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-[#FFFCF5] text-[#9E2B2B] shadow-sm'
                : 'bg-transparent text-[#8A7A64] hover:text-[#2A2036]'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setTab('signup')}
            className={`flex-1 border-0 rounded-full py-2 text-[14.5px] font-semibold transition-all cursor-pointer ${
              tab === 'signup'
                ? 'bg-[#FFFCF5] text-[#9E2B2B] shadow-sm'
                : 'bg-transparent text-[#8A7A64] hover:text-[#2A2036]'
            }`}
          >
            Create account
          </button>
        </div>

        {/* ===================== LOGIN VIEW ===================== */}
        {tab === 'login' && (
          <div>
            <h1 className="font-['Tiro_Devanagari_Hindi',serif] font-normal text-[25px] m-0 mb-1 text-center text-[#241631]">
              Welcome back
            </h1>
            <p className="m-0 mb-5 text-center text-[#6E6074] text-[14.5px]">
              Sign in to book, post or pick up where you left off.
            </p>

            {/* Google OAuth button */}
            <button
              type="button"
              onClick={() => triggerGoogleLogin()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-[#FBF7EE] disabled:opacity-60 border-[1.5px] border-[#E3D6BF] rounded-[10px] py-2.5 px-4 font-semibold text-[14.5px] text-[#2A2036] transition-colors shadow-xs cursor-pointer"
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4c-7.5 0-14 4.2-17.7 10.7z"/>
                <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 35.4 27 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.9 39.6 16.4 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.5l6.6 5.4C41.4 35.9 44 30.4 44 24c0-1.2-.1-2.4-.4-3.5z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-[#6E6074] text-[13px] my-4 before:flex-1 before:h-[1px] before:bg-[#E3D6BF] after:flex-1 after:h-[1px] after:bg-[#E3D6BF]">
              or sign in with
            </div>

            {/* Method switcher */}
            <div className="flex gap-1.5 bg-[#F0E5CF] rounded-full p-1 mb-4 shadow-inner">
              <button
                type="button"
                onClick={() => setLoginMethod('pw')}
                className={`flex-1 border-0 rounded-full py-1.5 text-[13.5px] font-semibold transition-all cursor-pointer ${
                  loginMethod === 'pw'
                    ? 'bg-[#FFFCF5] text-[#241631] shadow-xs'
                    : 'bg-transparent text-[#8A7A64]'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('email-otp')}
                className={`flex-1 border-0 rounded-full py-1.5 text-[13.5px] font-semibold transition-all cursor-pointer ${
                  loginMethod === 'email-otp'
                    ? 'bg-[#FFFCF5] text-[#241631] shadow-xs'
                    : 'bg-transparent text-[#8A7A64]'
                }`}
              >
                Email OTP
              </button>
            </div>

            {/* Pane 1: Password Login */}
            {loginMethod === 'pw' && (
              <form onSubmit={handleLoginPasswordSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[13.5px] font-semibold mb-1 text-[#4A3D52]">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-white border-[1.5px] border-[#E3D6BF] focus:border-[#E8862B] rounded-[10px] p-2.5 text-base text-[#2A2036] outline-none transition-colors"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <label className="text-[13.5px] font-semibold text-[#4A3D52]">Password</label>
                    <button
                      type="button"
                      onClick={() => alert('Please use the Email OTP tab to log in if you forgot your password.')}
                      className="text-[13px] font-semibold text-[#9E2B2B] hover:underline bg-transparent border-0 p-0 cursor-pointer"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-white border-[1.5px] border-[#E3D6BF] focus:border-[#E8862B] rounded-[10px] p-2.5 pr-10 text-base text-[#2A2036] outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6E6074] hover:text-[#2A2036] p-1.5 bg-transparent border-0 cursor-pointer"
                      aria-label="Toggle password"
                    >
                      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#E8862B] hover:bg-[#D8791F] disabled:opacity-60 text-[#2A1503] font-semibold text-[15.5px] py-3 px-4.5 rounded-[10px] transition-colors shadow-sm cursor-pointer mt-1"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
            )}

            {/* Pane 2: Email OTP Login */}
            {loginMethod === 'email-otp' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[13.5px] font-semibold mb-1 text-[#4A3D52]">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={loginOtpEmail}
                    onChange={(e) => setLoginOtpEmail(e.target.value)}
                    disabled={loginOtpSent}
                    className="w-full bg-white disabled:bg-[#F6EFE1] border-[1.5px] border-[#E3D6BF] focus:border-[#E8862B] rounded-[10px] p-2.5 text-base text-[#2A2036] outline-none transition-colors"
                  />
                </div>

                {!loginOtpSent ? (
                  <>
                    <p className="text-[13px] text-[#6E6074] m-0 mb-2">
                      We'll send a 4-digit verification code to <b className="text-[#2A2036] font-semibold">your inbox</b>.
                    </p>
                    <button
                      type="button"
                      onClick={handleSendLoginOtp}
                      disabled={loading || !loginOtpEmail}
                      className="w-full bg-[#E8862B] hover:bg-[#D8791F] disabled:opacity-60 text-[#2A1503] font-semibold text-[15.5px] py-3 px-4.5 rounded-[10px] transition-colors shadow-sm cursor-pointer"
                    >
                      {loading ? 'Sending code...' : 'Send Verification OTP'}
                    </button>
                  </>
                ) : (
                  <form onSubmit={handleVerifyLoginOtp} className="space-y-3 animate-in fade-in">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[13.5px] font-semibold text-[#4A3D52]">Enter 4-Digit Code</label>
                        <button
                          type="button"
                          onClick={() => setLoginOtpSent(false)}
                          className="text-xs text-[#9E2B2B] hover:underline bg-transparent border-0 p-0 cursor-pointer"
                        >
                          Change email
                        </button>
                      </div>
                      <div className="flex gap-2 mb-2">
                        {loginOtpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={loginOtpRefs[idx]}
                            type="text"
                            inputMode="numeric"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value, false)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e, false)}
                            className="w-full h-12 text-center text-xl font-['Tiro_Devanagari_Hindi',serif] font-bold border-[1.5px] border-[#E3D6BF] focus:border-[#E8862B] rounded-[10px] bg-white outline-none"
                          />
                        ))}
                      </div>

                      {devLoginOtp && (
                        <p className="text-xs text-[#4E6B4F] bg-[#EDF4ED] p-1.5 rounded-md border border-[#BFD4C0] m-0 mb-2">
                          Dev Code: <b>{devLoginOtp}</b> (simulated email delivery)
                        </p>
                      )}

                      <p className="text-[13px] text-[#6E6074] m-0 mb-2">
                        Didn't receive it?{' '}
                        {canResend ? (
                          <button
                            type="button"
                            onClick={handleSendLoginOtp}
                            className="text-[#9E2B2B] font-semibold hover:underline bg-transparent border-0 p-0 cursor-pointer"
                          >
                            Resend code now
                          </button>
                        ) : (
                          <b className="text-[#9E2B2B] font-semibold">Resend in 0:{timer < 10 ? `0${timer}` : timer}</b>
                        )}
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || loginOtpDigits.join('').length < 4}
                      className="w-full bg-[#E8862B] hover:bg-[#D8791F] disabled:opacity-60 text-[#2A1503] font-semibold text-[15.5px] py-3 px-4.5 rounded-[10px] transition-colors shadow-sm cursor-pointer"
                    >
                      {loading ? 'Verifying...' : 'Verify & Sign in'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 
            ========================================================================
            MOBILE OTP (COMMENTED OUT FOR FUTURE SMS GATEWAY INTEGRATION TO SAVE COSTS)
            ========================================================================
            <div className="field">
              <label for="li-phone2">Mobile number</label>
              <div className="phone">
                <span>+91</span>
                <input id="li-phone2" class="p-in" type="tel" inputmode="numeric" placeholder="98XXXXXXXX">
              </div>
            </div>
            ========================================================================
            */}

            <p className="text-center text-[#6E6074] text-[13.5px] mt-4">
              New to Shubhkaal?{' '}
              <button
                type="button"
                onClick={() => setTab('signup')}
                className="text-[#9E2B2B] font-semibold underline underline-offset-3 bg-transparent border-0 p-0 cursor-pointer"
              >
                Create an account
              </button>
            </p>
          </div>
        )}

        {/* ===================== SIGNUP VIEW ===================== */}
        {tab === 'signup' && (
          <div>
            <h1 className="font-['Tiro_Devanagari_Hindi',serif] font-normal text-[25px] m-0 mb-1 text-center text-[#241631]">
              Join the community
            </h1>
            <p className="m-0 mb-5 text-center text-[#6E6074] text-[14.5px]">
              Free to join — book, post and connect in minutes.
            </p>

            {/* Google OAuth button */}
            <button
              type="button"
              onClick={() => triggerGoogleLogin()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-[#FBF7EE] disabled:opacity-60 border-[1.5px] border-[#E3D6BF] rounded-[10px] py-2.5 px-4 font-semibold text-[14.5px] text-[#2A2036] transition-colors shadow-xs cursor-pointer"
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4c-7.5 0-14 4.2-17.7 10.7z"/>
                <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 35.4 27 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.9 39.6 16.4 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.5l6.6 5.4C41.4 35.9 44 30.4 44 24c0-1.2-.1-2.4-.4-3.5z"/>
              </svg>
              <span>Sign up with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-[#6E6074] text-[13px] my-4 before:flex-1 before:h-[1px] before:bg-[#E3D6BF] after:flex-1 after:h-[1px] after:bg-[#E3D6BF]">
              or create with
            </div>

            {/* Method switcher */}
            <div className="flex gap-1.5 bg-[#F0E5CF] rounded-full p-1 mb-4 shadow-inner">
              <button
                type="button"
                onClick={() => setSignupMethod('pw')}
                className={`flex-1 border-0 rounded-full py-1.5 text-[13.5px] font-semibold transition-all cursor-pointer ${
                  signupMethod === 'pw'
                    ? 'bg-[#FFFCF5] text-[#241631] shadow-xs'
                    : 'bg-transparent text-[#8A7A64]'
                }`}
              >
                Email &amp; Password
              </button>
              <button
                type="button"
                onClick={() => setSignupMethod('email-otp')}
                className={`flex-1 border-0 rounded-full py-1.5 text-[13.5px] font-semibold transition-all cursor-pointer ${
                  signupMethod === 'email-otp'
                    ? 'bg-[#FFFCF5] text-[#241631] shadow-xs'
                    : 'bg-transparent text-[#8A7A64]'
                }`}
              >
                Email OTP
              </button>
            </div>

            {/* Pane 1: Signup with Email & Password */}
            {signupMethod === 'pw' && (
              <form onSubmit={handleSignupPasswordSubmit} className="space-y-3">
                <div>
                  <label className="block text-[13.5px] font-semibold mb-1 text-[#4A3D52]">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full bg-white border-[1.5px] border-[#E3D6BF] focus:border-[#E8862B] rounded-[10px] p-2.5 text-base text-[#2A2036] outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[13.5px] font-semibold mb-1 text-[#4A3D52]">
                    Mobile number
                  </label>
                  <div className="flex items-stretch border-[1.5px] border-[#E3D6BF] focus-within:border-[#E8862B] rounded-[10px] bg-white overflow-hidden">
                    <span className="flex items-center px-3 bg-[#F6EFE1] border-r-[1.5px] border-[#E3D6BF] text-[15px] font-medium text-[#4A3D52]">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength="10"
                      placeholder="98XXXXXXXX"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="flex-1 border-0 p-2.5 text-base text-[#2A2036] outline-none min-w-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13.5px] font-semibold mb-1 text-[#4A3D52]">
                    Email address (for verification &amp; updates)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full bg-white border-[1.5px] border-[#E3D6BF] focus:border-[#E8862B] rounded-[10px] p-2.5 text-base text-[#2A2036] outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[13.5px] font-semibold mb-1 text-[#4A3D52]">
                    Create password
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      minLength="6"
                      placeholder="At least 6 characters"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full bg-white border-[1.5px] border-[#E3D6BF] focus:border-[#E8862B] rounded-[10px] p-2.5 pr-10 text-base text-[#2A2036] outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6E6074] hover:text-[#2A2036] p-1.5 bg-transparent border-0 cursor-pointer"
                      aria-label="Toggle password"
                    >
                      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <label className="flex items-start gap-2 text-[13px] text-[#6E6074] mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 accent-[#E8862B]"
                  />
                  <span>
                    I agree to the <span className="text-[#9E2B2B] font-semibold">terms</span> and <span className="text-[#9E2B2B] font-semibold">privacy policy</span>.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading || !agreeTerms}
                  className="w-full bg-[#E8862B] hover:bg-[#D8791F] disabled:opacity-50 text-[#2A1503] font-semibold text-[15.5px] py-3 px-4.5 rounded-[10px] transition-colors shadow-sm cursor-pointer"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>
            )}

            {/* Pane 2: Signup with Email OTP */}
            {signupMethod === 'email-otp' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[13.5px] font-semibold mb-1 text-[#4A3D52]">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={signupOtpName}
                    onChange={(e) => setSignupOtpName(e.target.value)}
                    disabled={signupOtpSent}
                    className="w-full bg-white disabled:bg-[#F6EFE1] border-[1.5px] border-[#E3D6BF] focus:border-[#E8862B] rounded-[10px] p-2.5 text-base text-[#2A2036] outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[13.5px] font-semibold mb-1 text-[#4A3D52]">
                    Mobile number
                  </label>
                  <div className="flex items-stretch border-[1.5px] border-[#E3D6BF] focus-within:border-[#E8862B] rounded-[10px] bg-white overflow-hidden">
                    <span className="flex items-center px-3 bg-[#F6EFE1] border-r-[1.5px] border-[#E3D6BF] text-[15px] font-medium text-[#4A3D52]">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength="10"
                      placeholder="98XXXXXXXX"
                      disabled={signupOtpSent}
                      value={signupOtpPhone}
                      onChange={(e) => setSignupOtpPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="flex-1 border-0 p-2.5 text-base text-[#2A2036] outline-none min-w-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13.5px] font-semibold mb-1 text-[#4A3D52]">
                    Email address (for OTP verification)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={signupOtpEmail}
                    onChange={(e) => setSignupOtpEmail(e.target.value)}
                    disabled={signupOtpSent}
                    className="w-full bg-white disabled:bg-[#F6EFE1] border-[1.5px] border-[#E3D6BF] focus:border-[#E8862B] rounded-[10px] p-2.5 text-base text-[#2A2036] outline-none transition-colors"
                  />
                </div>

                {!signupOtpSent ? (
                  <>
                    <p className="text-[13px] text-[#6E6074] m-0 mb-2">
                      We'll send a 4-digit code to <b className="text-[#2A2036] font-semibold">verify your email</b>.
                    </p>
                    <button
                      type="button"
                      onClick={handleSendSignupOtp}
                      disabled={loading || !signupOtpEmail}
                      className="w-full bg-[#E8862B] hover:bg-[#D8791F] disabled:opacity-60 text-[#2A1503] font-semibold text-[15.5px] py-3 px-4.5 rounded-[10px] transition-colors shadow-sm cursor-pointer"
                    >
                      {loading ? 'Sending code...' : 'Send Verification OTP'}
                    </button>
                  </>
                ) : (
                  <form onSubmit={handleVerifySignupOtp} className="space-y-3 animate-in fade-in">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[13.5px] font-semibold text-[#4A3D52]">Enter 4-Digit Code</label>
                        <button
                          type="button"
                          onClick={() => setSignupOtpSent(false)}
                          className="text-xs text-[#9E2B2B] hover:underline bg-transparent border-0 p-0 cursor-pointer"
                        >
                          Change info
                        </button>
                      </div>
                      <div className="flex gap-2 mb-2">
                        {signupOtpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={signupOtpRefs[idx]}
                            type="text"
                            inputMode="numeric"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value, true)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e, true)}
                            className="w-full h-12 text-center text-xl font-['Tiro_Devanagari_Hindi',serif] font-bold border-[1.5px] border-[#E3D6BF] focus:border-[#E8862B] rounded-[10px] bg-white outline-none"
                          />
                        ))}
                      </div>

                      {devSignupOtp && (
                        <p className="text-xs text-[#4E6B4F] bg-[#EDF4ED] p-1.5 rounded-md border border-[#BFD4C0] m-0 mb-2">
                          Dev Code: <b>{devSignupOtp}</b> (simulated email delivery)
                        </p>
                      )}

                      <p className="text-[13px] text-[#6E6074] m-0 mb-2">
                        Didn't receive it?{' '}
                        {canResend ? (
                          <button
                            type="button"
                            onClick={handleSendSignupOtp}
                            className="text-[#9E2B2B] font-semibold hover:underline bg-transparent border-0 p-0 cursor-pointer"
                          >
                            Resend code now
                          </button>
                        ) : (
                          <b className="text-[#9E2B2B] font-semibold">Resend in 0:{timer < 10 ? `0${timer}` : timer}</b>
                        )}
                      </p>
                    </div>

                    <label className="flex items-start gap-2 text-[13px] text-[#6E6074] mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 accent-[#E8862B]"
                      />
                      <span>
                        I agree to the <span className="text-[#9E2B2B] font-semibold">terms</span> and <span className="text-[#9E2B2B] font-semibold">privacy policy</span>.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={loading || !agreeTerms || signupOtpDigits.join('').length < 4}
                      className="w-full bg-[#E8862B] hover:bg-[#D8791F] disabled:opacity-60 text-[#2A1503] font-semibold text-[15.5px] py-3 px-4.5 rounded-[10px] transition-colors shadow-sm cursor-pointer"
                    >
                      {loading ? 'Creating account...' : 'Verify & Create Account'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 
            ========================================================================
            MOBILE OTP (COMMENTED OUT FOR FUTURE SMS GATEWAY INTEGRATION TO SAVE COSTS)
            ========================================================================
            <div className="field">
              <label for="su-phone">Mobile number</label>
              <div className="phone">
                <span>+91</span>
                <input id="su-phone" class="p-in" type="tel" inputmode="numeric" placeholder="98XXXXXXXX">
              </div>
            </div>
            ========================================================================
            */}

            <p className="text-center text-[#6E6074] text-[13.5px] mt-4">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setTab('login')}
                className="text-[#9E2B2B] font-semibold underline underline-offset-3 bg-transparent border-0 p-0 cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </div>
        )}

        {/* Trust Footnotes */}
        <div className="flex justify-center gap-4.5 mt-5 text-[#9C8AA0] pt-3.5 border-t border-[#E3D6BF]">
          <span className="flex items-center gap-1.5 text-xs text-[#827182]">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="4" y="10" width="16" height="10" rx="2"/>
              <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
            </svg>
            <span>Secure sign-in</span>
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[#827182]">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            <span>No spam, ever</span>
          </span>
        </div>

      </div>
    </div>
  );
}
