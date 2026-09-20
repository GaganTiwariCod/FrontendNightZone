import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { statsApi } from '../api/statsApi';

export default function CommunityBands() {
  const { handleServiceClick, setSelectedNewsSlug, setSelectedEventSlug, setSelectedSpiritualSlug, setCurrentScreen } = useAuth();
  const [feedData, setFeedData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadFeed = async () => {
      try {
        const res = await statsApi.getCommunityFeed();
        if (isMounted && res && res.success && res.data) {
          setFeedData(res.data);
        }
      } catch (err) {
        console.warn('Could not load dynamic community feed:', err);
      }
    };
    loadFeed();
    return () => { isMounted = false; };
  }, []);

  const newsList = feedData?.recentNews?.length > 0 ? feedData.recentNews : [
    { id: 'n1', title: 'Ganesh visarjan route changed at Chowpatty', source_name: 'Traffic police notice · Mumbai', timeAgo: '2h ago', slug: 'ganesh-visarjan-route' },
    { id: 'n2', title: 'Free health camp at Samaj Bhavan on Sunday', source_name: 'Dadar Mandal', timeAgo: '5h ago', slug: 'free-health-camp-dadar' },
    { id: 'n3', title: 'New annadan kitchen opens in Thane', source_name: 'Thane Seva Samiti', timeAgo: 'Yest.', slug: 'annadan-kitchen-thane' }
  ];

  const eventsList = feedData?.upcomingEvents?.length > 0 ? feedData.upcomingEvents : [
    { id: 'e1', title: 'Sundarkand paath & Hanuman Chalisa', start_date: '2026-09-22', start_time: '6:30 pm', location: { venue_name: 'Ram Mandir', city: 'Matunga' }, slug: 'sundarkand-paath-matunga' },
    { id: 'e2', title: 'Community bhandara & Mahaprasad', start_date: '2026-09-27', start_time: '12:00 pm', location: { venue_name: 'Samaj Bhavan', city: 'Dadar' }, slug: 'community-bhandara-dadar' },
    { id: 'e3', title: 'Youth meet & job mela', start_date: '2026-10-05', start_time: '10:00 am', location: { venue_name: 'Thane West Auditorium', city: 'Thane' }, slug: 'youth-meet-thane' }
  ];

  const storiesList = feedData?.featuredStories?.length > 0 ? feedData.featuredStories : [
    { id: 's1', title: 'Satyanarayan katha, all five adhyay', duration: '18 min', language: 'Marathi / Hindi', bg: 'bg-[#6B3B70]', slug: 'satyanarayan-katha-five-adhyay' },
    { id: 's2', title: 'How to do aarti at home, step by step', duration: '6 min', language: 'Beginners Guide', bg: 'bg-[#9E2B2B]', slug: 'how-to-do-aarti-step-by-step' },
    { id: 's3', title: 'Why we keep the Ekadashi vrat', duration: '9 min', language: 'Vrat Vidhi', bg: 'bg-[#4E6B4F]', slug: 'why-we-keep-ekadashi-vrat' },
    { id: 's4', title: 'Navratri: nine nights, nine forms', duration: '12 min', language: 'Festival Guide', bg: 'bg-[#8A5A12]', slug: 'navratri-nine-nights-nine-forms' }
  ];

  const getEventDateInfo = (dateStr) => {
    try {
      const d = new Date(dateStr);
      const day = d.getDate().toString().padStart(2, '0');
      const month = d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
      return { day, month };
    } catch {
      return { day: '22', month: 'SEP' };
    }
  };

  return (
    <div className="max-w-[1080px] mx-auto px-4.5 space-y-11 pt-11 pb-14">
      
      {/* 3-Column Band: Updates, Events, Help */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Local Updates */}
          <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between gap-3.5 mb-3">
                <h3 className="font-['Tiro_Devanagari_Hindi',serif] font-normal text-xl text-[#241631]">Local updates</h3>
                <button 
                  onClick={() => handleServiceClick('Local Updates')}
                  className="text-[14.5px] text-[#9E2B2B] hover:underline font-semibold bg-transparent border-0 p-0 cursor-pointer"
                >
                  See all
                </button>
              </div>

              <div className="space-y-0 divide-y divide-[#E3D6BF]">
                {newsList.map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    onClick={() => {
                      if (item.slug) {
                        setSelectedNewsSlug(item.slug);
                        setCurrentScreen('local-updates-detail');
                      } else {
                        handleServiceClick('Local Updates', { title: item.title });
                      }
                    }}
                    className="flex gap-3 py-3 cursor-pointer hover:bg-[#FFF8EC] rounded-lg px-1 transition-colors"
                  >
                    <span className="flex-none w-13 text-[12.5px] text-[#6E6074] pt-0.5">
                      {item.timeAgo || 'Recent'}
                    </span>
                    <div>
                      <h4 className="m-0 mb-1 text-[15.5px] font-semibold leading-snug text-[#2A2036] line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="m-0 text-[13.5px] text-[#6E6074] truncate">
                        {item.source_name || item.author || 'Local Sanatan Bulletin'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between gap-3.5 mb-3">
                <h3 className="font-['Tiro_Devanagari_Hindi',serif] font-normal text-xl text-[#241631]">Upcoming events</h3>
                <button 
                  onClick={() => handleServiceClick('Events')}
                  className="text-[14.5px] text-[#9E2B2B] hover:underline font-semibold bg-transparent border-0 p-0 cursor-pointer"
                >
                  See all
                </button>
              </div>

              <div className="space-y-0 divide-y divide-[#E3D6BF]">
                {eventsList.map((ev, idx) => {
                  const { day, month } = getEventDateInfo(ev.start_date);
                  return (
                    <div 
                      key={ev.id || idx}
                      onClick={() => {
                        if (ev.slug) {
                          setSelectedEventSlug(ev.slug);
                          setCurrentScreen('event-detail');
                        } else {
                          handleServiceClick('Events', { title: ev.title });
                        }
                      }}
                      className="flex gap-3.5 py-3 cursor-pointer hover:bg-[#FFF8EC] rounded-lg px-1 transition-colors"
                    >
                      <div className="flex-none w-14 text-center bg-[#F4E8D3] border border-[#E3D6BF] rounded-[9px] py-1.5 shadow-xs">
                        <b className="block font-['Tiro_Devanagari_Hindi',serif] text-xl leading-none text-[#9E2B2B]">{day}</b>
                        <span className="text-[11.5px] text-[#7A6B80] font-semibold uppercase">{month}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="m-0 mb-1 text-[15.5px] font-semibold leading-snug text-[#2A2036] line-clamp-1">
                          {ev.title}
                        </h4>
                        <p className="m-0 text-[13.5px] text-[#6E6074] truncate">
                          {ev.start_time ? `${ev.start_time} · ` : ''}{ev.location?.venue_name ? `${ev.location.venue_name}, ` : ''}{ev.location?.city || 'Maharashtra'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Community Help */}
          <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between gap-3.5 mb-3">
                <h3 className="font-['Tiro_Devanagari_Hindi',serif] font-normal text-xl text-[#241631]">Community help</h3>
                <button 
                  onClick={() => handleServiceClick('Community Help', { action: 'post' })}
                  className="text-[14.5px] text-[#9E2B2B] hover:underline font-semibold bg-transparent border-0 p-0 cursor-pointer"
                >
                  Post a request
                </button>
              </div>

              <div className="space-y-0 divide-y divide-[#E3D6BF]">
                <div className="py-2.5">
                  <h4 className="m-0 mb-1 text-[15.5px] font-semibold leading-snug text-[#2A2036]">Blood donors needed — B negative</h4>
                  <p className="m-0 mb-2 text-[13.5px] text-[#6E6074]">Hinduja Hospital, Mahim · needed by tomorrow</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[12.5px] border border-[#E7B4B4] bg-[#FBEBEB] text-[#9E2B2B] font-semibold rounded-full px-2.5 py-0.5">Urgent</span>
                    <span className="text-[12.5px] border border-[#E3D6BF] bg-white text-[#5A4C60] rounded-full px-2.5 py-0.5">Medical</span>
                    <button 
                      onClick={() => handleServiceClick('Community Help', { action: 'help_blood' })}
                      className="bg-white hover:bg-[#FDF6EB] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] text-[#2A2036] rounded-full px-3.5 py-1 text-[13.5px] font-semibold transition-colors cursor-pointer"
                    >
                      I can help
                    </button>
                  </div>
                </div>

                <div className="py-2.5">
                  <h4 className="m-0 mb-1 text-[15.5px] font-semibold leading-snug text-[#2A2036]">Fees support for two students</h4>
                  <p className="m-0 mb-2 text-[13.5px] text-[#6E6074]">Class 11 &amp; 12 · ₹38,000 raised of ₹60,000</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[12.5px] border border-[#BFD4C0] bg-[#EDF4ED] text-[#4E6B4F] rounded-full px-2.5 py-0.5">Open</span>
                    <span className="text-[12.5px] border border-[#E3D6BF] bg-white text-[#5A4C60] rounded-full px-2.5 py-0.5">Education</span>
                    <button 
                      onClick={() => handleServiceClick('Community Help', { action: 'contribute' })}
                      className="bg-white hover:bg-[#FDF6EB] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] text-[#2A2036] rounded-full px-3.5 py-1 text-[13.5px] font-semibold transition-colors cursor-pointer"
                    >
                      Contribute
                    </button>
                  </div>
                </div>

                <div className="py-2.5">
                  <h4 className="m-0 mb-1 text-[15.5px] font-semibold leading-snug text-[#2A2036]">Looking for a part-time accounts job</h4>
                  <p className="m-0 mb-2 text-[13.5px] text-[#6E6074]">Member from Nashik, 4 years experience</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[12.5px] border border-[#BFD4C0] bg-[#EDF4ED] text-[#4E6B4F] rounded-full px-2.5 py-0.5">Open</span>
                    <span className="text-[12.5px] border border-[#E3D6BF] bg-white text-[#5A4C60] rounded-full px-2.5 py-0.5">Jobs</span>
                    <button 
                      onClick={() => handleServiceClick('Community Help', { action: 'refer' })}
                      className="bg-white hover:bg-[#FDF6EB] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] text-[#2A2036] rounded-full px-3.5 py-1 text-[13.5px] font-semibold transition-colors cursor-pointer"
                    >
                      Refer someone
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Stories Section */}
      <section>
        <div className="flex items-baseline justify-between gap-3.5 mb-4">
          <h3 className="font-['Tiro_Devanagari_Hindi',serif] font-normal text-2xl text-[#241631]">Stories to read this week</h3>
          <button 
            onClick={() => handleServiceClick('Stories')}
            className="text-[14.5px] text-[#9E2B2B] hover:underline font-semibold bg-transparent border-0 p-0 cursor-pointer"
          >
            All stories
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {storiesList.map((story, idx) => (
            <div 
              key={story.id || idx}
              onClick={() => {
                if (story.slug) {
                  setSelectedSpiritualSlug(story.slug);
                  setCurrentScreen('spiritual-detail');
                } else {
                  handleServiceClick('Stories', { story: story.title });
                }
              }}
              className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 group"
            >
              <div className={`h-[86px] grid place-items-center ${story.bg || 'bg-[#6B3B70]'} text-white`}>
                <svg className="w-8.5 h-8.5 opacity-95 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22z"/>
                  <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5a2.5 2.5 0 0 1 2.5 2z"/>
                </svg>
              </div>
              <div className="p-3.5">
                <h4 className="m-0 mb-1 text-[15.5px] font-semibold leading-snug text-[#2A2036] group-hover:text-[#9E2B2B] transition-colors line-clamp-2">
                  {story.title}
                </h4>
                <p className="m-0 text-[13px] text-[#6E6074]">
                  {story.language || 'Read in Marathi or Hindi'} {story.duration ? `· ${story.duration}` : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Members Section */}
      <section>
        <div className="flex items-baseline justify-between gap-3.5 mb-4">
          <h3 className="font-['Tiro_Devanagari_Hindi',serif] font-normal text-2xl text-[#241631]">Community members</h3>
          <button 
            onClick={() => handleServiceClick('Find People')}
            className="text-[14.5px] text-[#9E2B2B] hover:underline font-semibold bg-transparent border-0 p-0 cursor-pointer"
          >
            Browse directory
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] rounded-2xl p-4 text-center transition-all hover:shadow-md group">
            <span className="w-13.5 h-13.5 rounded-full mx-auto mb-2.5 grid place-items-center text-white font-semibold text-[19px] bg-[#9E2B2B] shadow-sm">
              AK
            </span>
            <h4 className="m-0 mb-0.5 text-[15.5px] font-semibold text-[#2A2036]">Anjali Kulkarni</h4>
            <p className="m-0 mb-3 text-[13px] text-[#6E6074]">Pune · Teacher</p>
            <button 
              onClick={() => handleServiceClick('Find People', { name: 'Anjali Kulkarni' })}
              className="bg-white hover:bg-[#FDF6EB] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] text-[#2A2036] rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition-colors cursor-pointer"
            >
              View profile
            </button>
          </div>

          <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] rounded-2xl p-4 text-center transition-all hover:shadow-md group">
            <span className="w-13.5 h-13.5 rounded-full mx-auto mb-2.5 grid place-items-center text-white font-semibold text-[19px] bg-[#4B3E7A] shadow-sm">
              RS
            </span>
            <h4 className="m-0 mb-0.5 text-[15.5px] font-semibold text-[#2A2036]">Rohit Shastri</h4>
            <p className="m-0 mb-3 text-[13px] text-[#6E6074]">Mumbai · Pandit, 12 yrs</p>
            <button 
              onClick={() => handleServiceClick('Find Pandit', { name: 'Rohit Shastri' })}
              className="bg-white hover:bg-[#FDF6EB] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] text-[#2A2036] rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition-colors cursor-pointer"
            >
              View profile
            </button>
          </div>

          <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] rounded-2xl p-4 text-center transition-all hover:shadow-md group">
            <span className="w-13.5 h-13.5 rounded-full mx-auto mb-2.5 grid place-items-center text-white font-semibold text-[19px] bg-[#4E6B4F] shadow-sm">
              MP
            </span>
            <h4 className="m-0 mb-0.5 text-[15.5px] font-semibold text-[#2A2036]">Meera Patil</h4>
            <p className="m-0 mb-3 text-[13px] text-[#6E6074]">Nashik · CA</p>
            <button 
              onClick={() => handleServiceClick('Find People', { name: 'Meera Patil' })}
              className="bg-white hover:bg-[#FDF6EB] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] text-[#2A2036] rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition-colors cursor-pointer"
            >
              View profile
            </button>
          </div>

          <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] rounded-2xl p-4 text-center transition-all hover:shadow-md group">
            <span className="w-13.5 h-13.5 rounded-full mx-auto mb-2.5 grid place-items-center text-white font-semibold text-[19px] bg-[#8A5A12] shadow-sm">
              SD
            </span>
            <h4 className="m-0 mb-0.5 text-[15.5px] font-semibold text-[#2A2036]">Sameer Deshpande</h4>
            <p className="m-0 mb-3 text-[13px] text-[#6E6074]">Thane · Caterer</p>
            <button 
              onClick={() => handleServiceClick('Services', { name: 'Sameer Deshpande' })}
              className="bg-white hover:bg-[#FDF6EB] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] text-[#2A2036] rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition-colors cursor-pointer"
            >
              View profile
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
