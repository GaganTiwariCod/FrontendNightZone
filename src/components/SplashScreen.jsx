import React, { useState, useEffect } from 'react';

export default function SplashScreen({ onComplete }) {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Check if splash screen was already shown in this browser session
    const hasSeenSplash = sessionStorage.getItem('shubhkaal_splash_shown');
    if (hasSeenSplash) {
      setVisible(false);
      onComplete?.();
      return;
    }

    // Auto fade-out after 1.8 seconds
    const timer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => {
        sessionStorage.setItem('shubhkaal_splash_shown', 'true');
        setVisible(false);
        onComplete?.();
      }, 500); // 500ms smooth fade transition
    }, 1800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setFadingOut(true);
    setTimeout(() => {
      sessionStorage.setItem('shubhkaal_splash_shown', 'true');
      setVisible(false);
      onComplete?.();
    }, 300);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#1C1027] via-[#241631] to-[#160B20] text-[#F7EEDC] p-6 transition-opacity duration-500 select-none ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top ambient space */}
      <div className="w-full flex justify-end">
        <button
          onClick={handleSkip}
          className="text-xs text-[#C99A3F]/80 hover:text-[#E8862B] bg-transparent border border-[#C99A3F]/30 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
        >
          Skip ↗
        </button>
      </div>

      {/* Center Sacred Emblem & Branding */}
      <div className="flex flex-col items-center text-center space-y-5 animate-in fade-in zoom-in duration-700">
        {/* Animated Sacred Diya / Emblem */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#E8862B]/30 to-[#9E2B2B]/20 border border-[#C99A3F]/50 flex items-center justify-center shadow-2xl shadow-amber-500/20">
            <svg className="w-14 h-14 sm:w-16 sm:h-16 animate-pulse" viewBox="0 0 40 40" fill="none">
              <path d="M20 5c2.6 4 4.3 6.6 4.3 9.2A4.3 4.3 0 0 1 20 18.5a4.3 4.3 0 0 1-4.3-4.3C15.7 11.6 17.4 9 20 5z" fill="#E8862B"/>
              <path d="M6 24h28c0 5.5-6.3 9.5-14 9.5S6 29.5 6 24z" fill="none" stroke="#C99A3F" strokeWidth="2.2"/>
              <path d="M3 24h34" stroke="#C99A3F" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </div>
          {/* Subtle Glow Ring */}
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-xl pointer-events-none -z-10" />
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-1.5">
          <h1 className="font-['Tiro_Devanagari_Hindi',serif] text-4xl sm:text-5xl font-normal text-white tracking-wide leading-none">
            Shubhkaal
          </h1>
          <p className="text-sm sm:text-base font-semibold text-[#C99A3F] tracking-wide">
            शुभकार्येषु सर्वदा · Pooja &amp; Aarti Seva
          </p>
        </div>

        <p className="text-xs text-[#A895AC] max-w-xs leading-relaxed">
          Maharashtra's trusted Sanatan community platform for verified Pandits, Kundli matching, and sacred Kathas.
        </p>

        {/* Loading Progress Pulse */}
        <div className="w-36 h-1 bg-[#33204F] rounded-full overflow-hidden mt-4">
          <div className="w-full h-full bg-gradient-to-r from-[#E8862B] to-[#C99A3F] animate-indeterminate rounded-full" />
        </div>
      </div>

      {/* Footer Sanskrit Blessing */}
      <div className="text-center text-[11px] text-[#8C7A90]">
        ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः
      </div>
    </div>
  );
}
