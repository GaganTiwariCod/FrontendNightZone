import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { handleServiceClick, setCurrentScreen } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <footer className="bg-[#241631] text-[#B8A6B8] py-8 border-t border-[#4A3358] text-sm">
        <div className="max-w-[1080px] mx-auto px-4.5 flex flex-wrap gap-4.5 justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-[#E8862B]">🪔</span>
            <span>Shubhkaal · a community platform for Maharashtra</span>
          </div>
          <nav className="flex flex-wrap gap-4 text-[#D6C6D4]">
            <button 
              onClick={() => handleServiceClick('About Shubhkaal')}
              className="hover:text-[#F7EEDC] bg-transparent border-0 p-0 text-sm transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => handleServiceClick('Services')}
              className="hover:text-[#F7EEDC] bg-transparent border-0 p-0 text-sm transition-colors"
            >
              List your service
            </button>
            <button 
              onClick={() => handleServiceClick('Astrology')}
              className="hover:text-[#F7EEDC] bg-transparent border-0 p-0 text-sm transition-colors text-[#E8862B]"
            >
              🔮 Astrology &amp; Kundli
            </button>
            <button 
              onClick={() => handleServiceClick('Register as Astrologer')}
              className="hover:text-[#F7EEDC] bg-transparent border-0 p-0 text-sm transition-colors"
            >
              Register as Astrologer
            </button>
            <button 
              onClick={() => handleServiceClick('Spiritual')}
              className="hover:text-[#F7EEDC] bg-transparent border-0 p-0 text-sm transition-colors text-[#E8862B]"
            >
              🕉️ Spiritual &amp; Katha
            </button>
            <button 
              onClick={() => handleServiceClick('Local Updates')}
              className="hover:text-[#F7EEDC] bg-transparent border-0 p-0 text-sm transition-colors text-[#E8862B]"
            >
              📰 Local Updates &amp; News
            </button>
            <button 
              onClick={() => handleServiceClick('Find Pandit')}
              className="hover:text-[#F7EEDC] bg-transparent border-0 p-0 text-sm transition-colors"
            >
              Register as pandit
            </button>
            <button 
              onClick={() => handleServiceClick('Contact Us')}
              className="hover:text-[#F7EEDC] bg-transparent border-0 p-0 text-sm transition-colors"
            >
              Contact
            </button>
          </nav>
        </div>
      </footer>

      {/* Mobile Tabbar */}
      <nav className="md:hidden fixed left-0 right-0 bottom-0 z-40 bg-[#241631] border-t border-[#4A3358] py-2 px-1 flex justify-around shadow-2xl" aria-label="Quick links">
        <button
          onClick={() => { setActiveTab('home'); setCurrentScreen('dashboard'); }}
          className={`flex-1 flex flex-col items-center gap-1 text-[11px] py-1 bg-transparent border-0 transition-colors ${
            activeTab === 'home' ? 'text-[#E8862B] font-semibold' : 'text-[#A895AC]'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>
          </svg>
          <span>Home</span>
        </button>

        <button
          onClick={() => { setActiveTab('pandit'); handleServiceClick('Find Pandit'); }}
          className={`flex-1 flex flex-col items-center gap-1 text-[11px] py-1 bg-transparent border-0 transition-colors ${
            activeTab === 'pandit' ? 'text-[#E8862B] font-semibold' : 'text-[#A895AC]'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3l7 5v2H5V8z"/>
            <path d="M7 10v8M12 10v8M17 10v8M4 21h16"/>
          </svg>
          <span>Pandit</span>
        </button>

        <button
          onClick={() => { setActiveTab('events'); handleServiceClick('Events'); }}
          className={`flex-1 flex flex-col items-center gap-1 text-[11px] py-1 bg-transparent border-0 transition-colors ${
            activeTab === 'events' ? 'text-[#E8862B] font-semibold' : 'text-[#A895AC]'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="5" width="18" height="16" rx="2"/>
            <path d="M8 3v4M16 3v4M3 10h18"/>
          </svg>
          <span>Events</span>
        </button>

        <button
          onClick={() => { setActiveTab('people'); handleServiceClick('Find People'); }}
          className={`flex-1 flex flex-col items-center gap-1 text-[11px] py-1 bg-transparent border-0 transition-colors ${
            activeTab === 'people' ? 'text-[#E8862B] font-semibold' : 'text-[#A895AC]'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="9" cy="9" r="3.4"/>
            <path d="M2.5 19c0-3.2 2.9-5.4 6.5-5.4s6.5 2.2 6.5 5.4"/>
          </svg>
          <span>People</span>
        </button>

        <button
          onClick={() => { setActiveTab('help'); handleServiceClick('Community Help'); }}
          className={`flex-1 flex flex-col items-center gap-1 text-[11px] py-1 bg-transparent border-0 transition-colors ${
            activeTab === 'help' ? 'text-[#E8862B] font-semibold' : 'text-[#A895AC]'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 20.5s-7.5-4.6-7.5-9.7A4.3 4.3 0 0 1 12 7.8a4.3 4.3 0 0 1 7.5 3c0 5.1-7.5 9.7-7.5 9.7z"/>
          </svg>
          <span>Help</span>
        </button>
      </nav>
    </>
  );
}
