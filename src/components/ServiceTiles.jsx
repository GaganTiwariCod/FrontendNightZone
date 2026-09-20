import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { statsApi } from '../api/statsApi';

export default function ServiceTiles() {
  const { handleServiceClick } = useAuth();
  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      try {
        const res = await statsApi.getHomepageStats();
        if (isMounted && res && res.success && res.data) {
          setLiveStats(res.data);
        }
      } catch (err) {
        console.warn('Could not load live service tile stats:', err);
      }
    };
    loadStats();
    return () => { isMounted = false; };
  }, []);

  const services = [
    {
      id: 't1',
      name: 'Marriage',
      tagline: 'Matrimony profiles from within the community, with family details and kundli matching.',
      count: liveStats?.matrimony?.label || '1,240 profiles',
      live: false,
      bgColor: 'bg-[#F8E3E3]',
      iconColor: 'text-[#9E2B2B]',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
          <circle cx="9" cy="15" r="5"/>
          <circle cx="16" cy="15" r="5"/>
          <path d="M12 4l2 3h-4z" fill="currentColor" stroke="none"/>
        </svg>
      )
    },
    {
      id: 't2',
      name: 'Find Pandit',
      tagline: 'Book a verified pandit for any ceremony, in your language and your tradition.',
      count: liveStats?.pandits?.label || '420 pandits nearby',
      live: false,
      bgColor: 'bg-[#F6E7CE]',
      iconColor: 'text-[#8A5A12]',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
          <path d="M12 3l7 5v2H5V8z"/>
          <path d="M7 10v8M12 10v8M17 10v8M4 21h16"/>
        </svg>
      )
    },
    {
      id: 't3',
      name: 'Stories',
      tagline: 'Katha, vrat vidhi and festival stories to read aloud at home.',
      count: liveStats?.stories?.label || '6 new this week',
      live: false,
      bgColor: 'bg-[#EAE6F5]',
      iconColor: 'text-[#4B3E7A]',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22z"/>
          <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5a2.5 2.5 0 0 1 2.5 2z"/>
        </svg>
      )
    },
    {
      id: 't4',
      name: 'Astrology',
      tagline: 'Free kundli, guna matching and your daily rashi from real jyotishis.',
      count: liveStats?.astrology?.label || 'Daily rashi ready',
      live: false,
      bgColor: 'bg-[#E7EFF6]',
      iconColor: 'text-[#2F5A7A]',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
          <circle cx="12" cy="12" r="8"/>
          <path d="M12 4v16M4 12h16M6.5 6.5l11 11M17.5 6.5l-11 11"/>
        </svg>
      )
    },
    {
      id: 't5',
      name: 'Local Updates',
      tagline: "Notices, temple news and what's happening in your area today.",
      count: liveStats?.news?.label || '9 posted today',
      live: true,
      bgColor: 'bg-[#EDF1E8]',
      iconColor: 'text-[#4E6B4F]',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
          <rect x="3" y="5" width="18" height="14" rx="2"/>
          <path d="M7 9h7M7 12.5h7M7 16h4M17 9v7"/>
        </svg>
      )
    },
    {
      id: 't6',
      name: 'Events',
      tagline: 'Satsang, bhandara, garba and mandal programmes near you.',
      count: liveStats?.events?.label || '14 coming up',
      live: false,
      bgColor: 'bg-[#FBE8D7]',
      iconColor: 'text-[#B4571A]',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
          <rect x="3" y="5" width="18" height="16" rx="2"/>
          <path d="M8 3v4M16 3v4M3 10h18"/>
          <circle cx="12" cy="15" r="1.6" fill="currentColor" stroke="none"/>
        </svg>
      )
    },
    {
      id: 't7',
      name: 'Find People',
      tagline: 'Search the directory by surname, gotra, native place or city.',
      count: '🚀 Coming Soon',
      isComingSoon: true,
      live: false,
      bgColor: 'bg-[#F2E9F3]',
      iconColor: 'text-[#6B3B70]',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
          <circle cx="9" cy="9" r="3.4"/>
          <path d="M2.5 19c0-3.2 2.9-5.4 6.5-5.4s6.5 2.2 6.5 5.4"/>
          <path d="M16 6.2a3.4 3.4 0 0 1 0 6.6M18 19c0-2.4-1-4.2-2.6-5.3"/>
        </svg>
      )
    },
    {
      id: 't8',
      name: 'Services',
      tagline: 'Caterers, halls, decorators, band, photographers — rated by members.',
      count: '🚀 Coming Soon',
      isComingSoon: true,
      live: false,
      bgColor: 'bg-[#F0EBE3]',
      iconColor: 'text-[#6B5A3F]',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
          <path d="M4 9l1.4-4h13.2L20 9z"/>
          <path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9"/>
          <path d="M9.5 20v-6h5v6"/>
        </svg>
      )
    },
    {
      id: 't9',
      name: 'Community Help',
      tagline: 'Ask for help or offer it — medical, education, jobs, emergencies.',
      count: '🚀 Coming Soon',
      isComingSoon: true,
      live: false,
      bgColor: 'bg-[#F9E2DC]',
      iconColor: 'text-[#A33A1E]',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
          <path d="M12 20.5s-7.5-4.6-7.5-9.7A4.3 4.3 0 0 1 12 7.8a4.3 4.3 0 0 1 7.5 3c0 5.1-7.5 9.7-7.5 9.7z"/>
        </svg>
      )
    }
  ];

  return (
    <section className="max-w-[1080px] mx-auto px-4.5 -mt-6 relative z-20" aria-label="Services">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {services.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleServiceClick(item.name, item)}
            className="group text-left bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] hover:bg-[#FFF8EC] rounded-2xl p-4.5 flex flex-col gap-2.5 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <span className={`w-11.5 h-11.5 rounded-[13px] grid place-items-center flex-none ${item.bgColor} ${item.iconColor} transition-transform group-hover:scale-105`}>
                {item.icon}
              </span>
              <span className="text-xs text-[#AFA2B3] group-hover:text-[#E8862B] transition-colors flex items-center gap-1">
                <span>Explore</span>
                <span className="text-sm">→</span>
              </span>
            </div>

            <div>
              <h2 className="font-['Tiro_Devanagari_Hindi',serif] font-normal text-xl text-[#241631] group-hover:text-[#9E2B2B] leading-tight transition-colors">
                {item.name}
              </h2>
              <p className="text-[#6E6074] text-sm leading-snug mt-1.5 line-clamp-2">
                {item.tagline}
              </p>
            </div>

            <div className="mt-auto pt-2 text-[13px] font-semibold flex items-center justify-between">
              <span className={item.live ? 'text-[#9E2B2B] flex items-center gap-1.5' : 'text-[#4E6B4F]'}>
                {item.live && <span className="w-2 h-2 rounded-full bg-[#9E2B2B] animate-pulse inline-block" />}
                {item.count}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
