import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Toast() {
  const { toastMessage } = useAuth();

  if (!toastMessage) return null;

  const isInfo = toastMessage.type === 'info';
  const isError = toastMessage.type === 'error';

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
      <div className={`px-4 py-2.5 rounded-full shadow-lg text-sm font-medium flex items-center gap-2.5 border ${
        isInfo 
          ? 'bg-[#2D1C3C] text-[#F7EEDC] border-[#4A3358]' 
          : isError 
            ? 'bg-[#9E2B2B] text-white border-red-800' 
            : 'bg-[#241631] text-[#E8862B] border-[#C99A3F]'
      }`}>
        <span className="text-base">🪔</span>
        <span>{toastMessage.msg}</span>
      </div>
    </div>
  );
}
