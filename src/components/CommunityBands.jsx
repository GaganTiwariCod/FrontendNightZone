import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function CommunityBands() {
  const { handleServiceClick } = useAuth();

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
                  className="text-[14.5px] text-[#9E2B2B] hover:underline font-semibold bg-transparent border-0 p-0"
                >
                  See all
                </button>
              </div>

              <div className="space-y-0 divide-y divide-[#E3D6BF]">
                <div 
                  onClick={() => handleServiceClick('Local Updates', { title: 'Ganesh visarjan route changed at Chowpatty' })}
                  className="flex gap-3 py-3 cursor-pointer hover:bg-[#FFF8EC] rounded-lg px-1 transition-colors"
                >
                  <span className="flex-none w-13 text-[12.5px] text-[#6E6074] pt-0.5">2h ago</span>
                  <div>
                    <h4 className="m-0 mb-1 text-[15.5px] font-semibold leading-snug text-[#2A2036]">Ganesh visarjan route changed at Chowpatty</h4>
                    <p className="m-0 text-[13.5px] text-[#6E6074]">Traffic police notice · Mumbai</p>
                  </div>
                </div>

                <div 
                  onClick={() => handleServiceClick('Local Updates', { title: 'Free health camp at Samaj Bhavan on Sunday' })}
                  className="flex gap-3 py-3 cursor-pointer hover:bg-[#FFF8EC] rounded-lg px-1 transition-colors"
                >
                  <span className="flex-none w-13 text-[12.5px] text-[#6E6074] pt-0.5">5h ago</span>
                  <div>
                    <h4 className="m-0 mb-1 text-[15.5px] font-semibold leading-snug text-[#2A2036]">Free health camp at Samaj Bhavan on Sunday</h4>
                    <p className="m-0 text-[13.5px] text-[#6E6074]">Posted by Dadar Mandal</p>
                  </div>
                </div>

                <div 
                  onClick={() => handleServiceClick('Local Updates', { title: 'New annadan kitchen opens in Thane' })}
                  className="flex gap-3 py-3 cursor-pointer hover:bg-[#FFF8EC] rounded-lg px-1 transition-colors"
                >
                  <span className="flex-none w-13 text-[12.5px] text-[#6E6074] pt-0.5">Yest.</span>
                  <div>
                    <h4 className="m-0 mb-1 text-[15.5px] font-semibold leading-snug text-[#2A2036]">New annadan kitchen opens in Thane</h4>
                    <p className="m-0 text-[13.5px] text-[#6E6074]">Volunteers needed on weekends</p>
                  </div>
                </div>
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
                  className="text-[14.5px] text-[#9E2B2B] hover:underline font-semibold bg-transparent border-0 p-0"
                >
                  See all
                </button>
              </div>

              <div className="space-y-0 divide-y divide-[#E3D6BF]">
                <div 
                  onClick={() => handleServiceClick('Events', { title: 'Sundarkand paath' })}
                  className="flex gap-3.5 py-3 cursor-pointer hover:bg-[#FFF8EC] rounded-lg px-1 transition-colors"
                >
                  <div className="flex-none w-14 text-center bg-[#F4E8D3] border border-[#E3D6BF] rounded-[9px] py-1.5 shadow-xs">
                    <b className="block font-['Tiro_Devanagari_Hindi',serif] text-xl leading-none text-[#9E2B2B]">22</b>
                    <span className="text-[11.5px] text-[#7A6B80] font-semibold uppercase">SEP</span>
                  </div>
                  <div>
                    <h4 className="m-0 mb-1 text-[15.5px] font-semibold leading-snug text-[#2A2036]">Sundarkand paath</h4>
                    <p className="m-0 text-[13.5px] text-[#6E6074]">6:30 pm · Ram Mandir, Matunga</p>
                  </div>
                </div>

                <div 
                  onClick={() => handleServiceClick('Events', { title: 'Community bhandara' })}
                  className="flex gap-3.5 py-3 cursor-pointer hover:bg-[#FFF8EC] rounded-lg px-1 transition-colors"
                >
                  <div className="flex-none w-14 text-center bg-[#F4E8D3] border border-[#E3D6BF] rounded-[9px] py-1.5 shadow-xs">
                    <b className="block font-['Tiro_Devanagari_Hindi',serif] text-xl leading-none text-[#9E2B2B]">27</b>
                    <span className="text-[11.5px] text-[#7A6B80] font-semibold uppercase">SEP</span>
                  </div>
                  <div>
                    <h4 className="m-0 mb-1 text-[15.5px] font-semibold leading-snug text-[#2A2036]">Community bhandara</h4>
                    <p className="m-0 text-[13.5px] text-[#6E6074]">12:00 pm · Samaj Bhavan, Dadar</p>
                  </div>
                </div>

                <div 
                  onClick={() => handleServiceClick('Events', { title: 'Youth meet & job mela' })}
                  className="flex gap-3.5 py-3 cursor-pointer hover:bg-[#FFF8EC] rounded-lg px-1 transition-colors"
                >
                  <div className="flex-none w-14 text-center bg-[#F4E8D3] border border-[#E3D6BF] rounded-[9px] py-1.5 shadow-xs">
                    <b className="block font-['Tiro_Devanagari_Hindi',serif] text-xl leading-none text-[#9E2B2B]">05</b>
                    <span className="text-[11.5px] text-[#7A6B80] font-semibold uppercase">OCT</span>
                  </div>
                  <div>
                    <h4 className="m-0 mb-1 text-[15.5px] font-semibold leading-snug text-[#2A2036]">Youth meet &amp; job mela</h4>
                    <p className="m-0 text-[13.5px] text-[#6E6074]">10:00 am · Thane West</p>
                  </div>
                </div>
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
                  className="text-[14.5px] text-[#9E2B2B] hover:underline font-semibold bg-transparent border-0 p-0"
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
                      className="bg-white hover:bg-[#FDF6EB] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] text-[#2A2036] rounded-full px-3.5 py-1 text-[13.5px] font-semibold transition-colors"
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
                      className="bg-white hover:bg-[#FDF6EB] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] text-[#2A2036] rounded-full px-3.5 py-1 text-[13.5px] font-semibold transition-colors"
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
                      className="bg-white hover:bg-[#FDF6EB] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] text-[#2A2036] rounded-full px-3.5 py-1 text-[13.5px] font-semibold transition-colors"
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
            className="text-[14.5px] text-[#9E2B2B] hover:underline font-semibold bg-transparent border-0 p-0"
          >
            All stories
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div 
            onClick={() => handleServiceClick('Stories', { story: 'Satyanarayan katha' })}
            className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 group"
          >
            <div className="h-[86px] grid place-items-center bg-[#6B3B70] text-white">
              <svg className="w-8.5 h-8.5 opacity-95 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22z"/>
                <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5a2.5 2.5 0 0 1 2.5 2z"/>
              </svg>
            </div>
            <div className="p-3.5">
              <h4 className="m-0 mb-1 text-[15.5px] font-semibold leading-snug text-[#2A2036] group-hover:text-[#9E2B2B] transition-colors">Satyanarayan katha, all five adhyay</h4>
              <p className="m-0 text-[13px] text-[#6E6074]">Read in Marathi or Hindi · 18 min</p>
            </div>
          </div>

          <div 
            onClick={() => handleServiceClick('Stories', { story: 'How to do aarti at home' })}
            className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 group"
          >
            <div className="h-[86px] grid place-items-center bg-[#9E2B2B] text-white">
              <svg className="w-8.5 h-8.5 opacity-95 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3c2 3.2 3.2 5 3.2 6.8A3.2 3.2 0 0 1 12 13a3.2 3.2 0 0 1-3.2-3.2C8.8 8 10 6.2 12 3z"/>
                <path d="M4 18h16M6 18c0-3 2.7-5 6-5s6 2 6 5"/>
              </svg>
            </div>
            <div className="p-3.5">
              <h4 className="m-0 mb-1 text-[15.5px] font-semibold leading-snug text-[#2A2036] group-hover:text-[#9E2B2B] transition-colors">How to do aarti at home, step by step</h4>
              <p className="m-0 text-[13px] text-[#6E6074]">For beginners · 6 min</p>
            </div>
          </div>

          <div 
            onClick={() => handleServiceClick('Stories', { story: 'Why we keep the Ekadashi vrat' })}
            className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 group"
          >
            <div className="h-[86px] grid place-items-center bg-[#4E6B4F] text-white">
              <svg className="w-8.5 h-8.5 opacity-95 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="8"/>
                <path d="M12 7v5l3 2"/>
              </svg>
            </div>
            <div className="p-3.5">
              <h4 className="m-0 mb-1 text-[15.5px] font-semibold leading-snug text-[#2A2036] group-hover:text-[#9E2B2B] transition-colors">Why we keep the Ekadashi vrat</h4>
              <p className="m-0 text-[13px] text-[#6E6074]">Vrat vidhi and timings · 9 min</p>
            </div>
          </div>

          <div 
            onClick={() => handleServiceClick('Stories', { story: 'Navratri: nine nights, nine forms' })}
            className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 group"
          >
            <div className="h-[86px] grid place-items-center bg-[#8A5A12] text-white">
              <svg className="w-8.5 h-8.5 opacity-95 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.4l6-.8z"/>
              </svg>
            </div>
            <div className="p-3.5">
              <h4 className="m-0 mb-1 text-[15.5px] font-semibold leading-snug text-[#2A2036] group-hover:text-[#9E2B2B] transition-colors">Navratri: nine nights, nine forms</h4>
              <p className="m-0 text-[13px] text-[#6E6074]">Festival guide · 12 min</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Members Section */}
      <section>
        <div className="flex items-baseline justify-between gap-3.5 mb-4">
          <h3 className="font-['Tiro_Devanagari_Hindi',serif] font-normal text-2xl text-[#241631]">New members this week</h3>
          <button 
            onClick={() => handleServiceClick('Find People')}
            className="text-[14.5px] text-[#9E2B2B] hover:underline font-semibold bg-transparent border-0 p-0"
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
              className="bg-white hover:bg-[#FDF6EB] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] text-[#2A2036] rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition-colors"
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
              className="bg-white hover:bg-[#FDF6EB] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] text-[#2A2036] rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition-colors"
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
              className="bg-white hover:bg-[#FDF6EB] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] text-[#2A2036] rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition-colors"
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
              className="bg-white hover:bg-[#FDF6EB] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] text-[#2A2036] rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition-colors"
            >
              View profile
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
