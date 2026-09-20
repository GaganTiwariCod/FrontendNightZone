import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout, openAuth, selectedCity, setSelectedCity, searchQuery, setSearchQuery, setCurrentScreen } = useAuth();
  const [showCityMenu, setShowCityMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const cities = ['Mumbai', 'Pune', 'Thane', 'Nashik', 'Nagpur', 'Aurangabad', 'Kolhapur'];

  return (
    <header className="bg-[#241631] text-[#F7EEDC] py-3.5 border-b border-[#4A3358] sticky top-0 z-40">
      <div className="max-w-[1080px] mx-auto px-4.5 flex items-center gap-3.5 flex-wrap md:flex-nowrap">
        
        {/* Brand */}
        <button 
          onClick={() => setCurrentScreen('dashboard')}
          className="flex items-center gap-2.5 flex-none text-left group bg-transparent border-0 p-0"
        >
          <svg className="w-8 h-8 transition-transform group-hover:scale-105" viewBox="0 0 40 40" aria-hidden="true">
            <path d="M20 5c2.6 4 4.3 6.6 4.3 9.2A4.3 4.3 0 0 1 20 18.5a4.3 4.3 0 0 1-4.3-4.3C15.7 11.6 17.4 9 20 5z" fill="#E8862B"/>
            <path d="M6 24h28c0 5.5-6.3 9.5-14 9.5S6 29.5 6 24z" fill="none" stroke="#C99A3F" strokeWidth="2.2"/>
            <path d="M3 24h34" stroke="#C99A3F" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
          <span className="flex flex-col">
            <b className="font-['Tiro_Devanagari_Hindi',serif] text-[22px] font-normal leading-none text-white">Shubhkaal</b>
            <span className="text-[11.5px] text-[#C99A3F] mt-0.5">Pooja &amp; aarti seva</span>
          </span>
        </button>

        {/* Search */}
        <div className="order-3 md:order-2 flex-1 w-full md:w-auto flex items-center gap-2.5 bg-[#33204F] border border-[#4A3358] rounded-full px-4 py-2 text-[#B8A6B8] focus-within:border-[#E8862B] transition-colors">
          <svg className="w-4 h-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/>
            <path d="M20 20l-3.6-3.6"/>
          </svg>
          <input 
            type="search" 
            placeholder="Search pandits, events, people, services"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-0 text-[#F7EEDC] placeholder-[#9B89A0] text-[15px] flex-1 outline-none min-w-0"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#B8A6B8] hover:text-white px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* City Selector */}
        <div className="order-2 md:order-3 relative flex-none">
          <button 
            onClick={() => setShowCityMenu(!showCityMenu)}
            className="flex items-center gap-1.5 text-[14.5px] text-[#D6C6D4] hover:text-white bg-transparent border-0 p-1 rounded-md transition-colors"
          >
            <svg className="w-4 h-4 text-[#C99A3F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/>
              <circle cx="12" cy="10" r="2.6"/>
            </svg>
            <span>{selectedCity}</span>
            <span className="text-xs text-[#9B89A0] hidden sm:inline">· change</span>
          </button>

          {showCityMenu && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-[#2D1C3C] border border-[#4A3358] rounded-xl shadow-2xl py-1.5 z-50 text-sm">
              <div className="px-3 py-1 text-xs text-[#9B89A0] font-semibold uppercase tracking-wider">Select Location</div>
              {cities.map(c => (
                <button
                  key={c}
                  onClick={() => { setSelectedCity(c); setShowCityMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-[#3D2650] flex items-center justify-between ${
                    selectedCity === c ? 'text-[#E8862B] font-semibold' : 'text-[#D6C6D4]'
                  }`}
                >
                  <span>{c}</span>
                  {selectedCity === c && <span>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User / Join Button */}
        <div className="order-2 md:order-4 relative flex-none">
          {!user ? (
            <button 
              type="button" 
              onClick={() => openAuth(null, 'login')}
              className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold text-[14.5px] px-4.5 py-2 rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Join free</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-[#2D1C3C] hover:bg-[#3D2650] border border-[#4A3358] rounded-full py-1 pl-1.5 pr-3 text-[#F7EEDC] transition-colors"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    className="w-7 h-7 rounded-full object-cover border border-[#E8862B]/50 flex-none"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#E8862B] text-[#2A1503] font-bold text-xs flex items-center justify-center flex-none">
                    {user.initials || (user.name || 'SM').substring(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium hidden sm:inline max-w-[110px] truncate">{user.name}</span>
                <svg className="w-3.5 h-3.5 text-[#A28FA6]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-[#2D1C3C] border border-[#4A3358] rounded-xl shadow-2xl py-2 z-50 text-sm">
                  <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#4A3358]">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || 'User'}
                        className="w-10 h-10 rounded-full object-cover border border-[#E8862B]/60 flex-none"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#E8862B] text-[#2A1503] font-bold text-sm flex items-center justify-center flex-none">
                        {user.initials || (user.name || 'SM').substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white truncate text-[14px] leading-tight m-0">{user.name}</p>
                      <p className="text-xs text-[#A28FA6] truncate m-0 mt-0.5">{user.email || user.phone}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#4E6B4F]/30 text-[#A4D6A6] text-[10.5px] font-semibold rounded-full">
                        Verified Member
                      </span>
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setCurrentScreen('matrimony');
                      }}
                      className="w-full text-left px-4 py-2 text-[#E8862B] hover:bg-[#3D2650] flex items-center gap-2 font-medium"
                    >
                      <span>💍</span>
                      <span>My Matrimonial Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setCurrentScreen('matrimony-browse');
                      }}
                      className="w-full text-left px-4 py-2 text-[#D6C6D4] hover:bg-[#3D2650] hover:text-white flex items-center gap-2"
                    >
                      <span>🔍</span>
                      <span>Browse Matches</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setCurrentScreen('pandit-directory');
                      }}
                      className="w-full text-left px-4 py-2 text-[#E8862B] hover:bg-[#3D2650] flex items-center gap-2 font-medium"
                    >
                      <span>🪔</span>
                      <span>Find a Pandit</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setCurrentScreen('pandit-wizard');
                      }}
                      className="w-full text-left px-4 py-2 text-[#D6C6D4] hover:bg-[#3D2650] hover:text-white flex items-center gap-2"
                    >
                      <span>📜</span>
                      <span>Register as Pandit</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setCurrentScreen('spiritual');
                      }}
                      className="w-full text-left px-4 py-2 text-[#E8862B] hover:bg-[#3D2650] flex items-center gap-2 font-medium"
                    >
                      <span>🕉️</span>
                      <span>Dharmik &amp; Spiritual Wisdom</span>
                    </button>
                    {user?.role?.toUpperCase() === 'ADMIN' && (
                      <>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            setCurrentScreen('spiritual-admin');
                          }}
                          className="w-full text-left px-4 py-2 text-[#F3AC7A] hover:bg-[#3D2650] flex items-center gap-2 font-medium"
                        >
                          <span>🪔</span>
                          <span>Spiritual CMS Admin</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            setCurrentScreen('pandit-admin');
                          }}
                          className="w-full text-left px-4 py-2 text-[#F3AC7A] hover:bg-[#3D2650] flex items-center gap-2 font-medium"
                        >
                          <span>⚖️</span>
                          <span>Pandit Moderation</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            setCurrentScreen('matrimony-admin');
                          }}
                          className="w-full text-left px-4 py-2 text-[#F3AC7A] hover:bg-[#3D2650] flex items-center gap-2 font-medium"
                        >
                          <span>⚙️</span>
                          <span>Matrimony Admin</span>
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[#D6C6D4] hover:bg-[#3D2650] hover:text-white"
                    >
                      My Bookings &amp; Posts
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-[#E78A8A] hover:bg-[#3D2650] hover:text-red-300 font-medium"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
