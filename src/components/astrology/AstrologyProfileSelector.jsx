import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { astrologyApi } from '../../api/astrologyApi';
import { 
  User, 
  Users, 
  Plus, 
  ChevronDown, 
  Check, 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles,
  Edit2
} from 'lucide-react';

export default function AstrologyProfileSelector({ onAddNewClick, onEditClick }) {
  const { 
    user, 
    astrologyProfiles, 
    setAstrologyProfiles,
    selectedAstrologyProfile, 
    switchAstrologyProfile,
    loadAstrologyProfiles,
    openAuth
  } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'SELF' | 'OTHER'
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user && astrologyProfiles.length === 0) {
      loadAstrologyProfiles();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm sm:text-base">Personalized Vedic Astrology</h4>
            <p className="text-xs text-amber-200/70">Sign in to save your birth details once and reuse them everywhere.</p>
          </div>
        </div>
        <button
          onClick={() => openAuth('Astrology', 'login')}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 whitespace-nowrap"
        >
          Sign In / Set Profile
        </button>
      </div>
    );
  }

  const filteredProfiles = astrologyProfiles.filter(p => {
    if (activeTab === 'SELF') return p.profile_type === 'SELF';
    if (activeTab === 'OTHER') return p.profile_type === 'OTHER';
    return true;
  }).filter(p => {
    if (!search.trim()) return true;
    return p.name.toLowerCase().includes(search.toLowerCase()) || 
           (p.relationship && p.relationship.toLowerCase().includes(search.toLowerCase()));
  });

  const selfProfile = astrologyProfiles.find(p => p.profile_type === 'SELF');

  return (
    <div className="relative">
      {/* Top Bar Banner */}
      <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-stone-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20 shrink-0">
            {selectedAstrologyProfile?.profile_type === 'SELF' ? (
              <User className="w-5 h-5" />
            ) : (
              <Users className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-amber-400/80 uppercase tracking-wider">
              Astrology Consultation & Kundli For:
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-white truncate">
                {selectedAstrologyProfile ? selectedAstrologyProfile.name : 'Loading Profile...'}
              </span>
              {selectedAstrologyProfile && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  {selectedAstrologyProfile.relationship || selectedAstrologyProfile.profile_type}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all"
          >
            <span>Change Person</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <button
            onClick={onAddNewClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 text-xs font-bold transition-all shadow-md shadow-orange-500/20"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Add Person</span>
          </button>
        </div>
      </div>

      {/* Profile Selector Dropdown / Modal */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-full max-w-md z-50 bg-stone-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-stone-800 bg-stone-950/80">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Who is this Astrology service for?
                </h3>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onAddNewClick();
                  }}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New
                </button>
              </div>

              {/* Tabs: ALL / SELF / OTHER */}
              <div className="flex rounded-xl bg-stone-800/80 p-1 border border-stone-700">
                <button
                  onClick={() => setActiveTab('ALL')}
                  className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'ALL'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md font-bold'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  All ({astrologyProfiles.length})
                </button>
                <button
                  onClick={() => setActiveTab('SELF')}
                  className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'SELF'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md font-bold'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Self
                </button>
                <button
                  onClick={() => setActiveTab('OTHER')}
                  className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'OTHER'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md font-bold'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Family & Friends
                </button>
              </div>

              {/* Search Box */}
              {astrologyProfiles.length > 3 && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    placeholder="Search saved profiles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-stone-800 border border-stone-700 text-white placeholder-stone-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}
            </div>

            {/* Profiles List */}
            <div className="max-h-72 overflow-y-auto divide-y divide-stone-800/60 p-2 space-y-1">
              {filteredProfiles.map((p) => {
                const isSelected = selectedAstrologyProfile?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      switchAstrologyProfile(p);
                      setIsOpen(false);
                    }}
                    className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border border-amber-500/40 text-white'
                        : 'hover:bg-stone-800/80 text-stone-200 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                          p.profile_type === 'SELF'
                            ? 'bg-amber-500 text-stone-950'
                            : 'bg-stone-800 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm truncate">{p.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-amber-400 border border-stone-700">
                            {p.relationship || p.profile_type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-stone-500" />
                            {p.date_of_birth}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 truncate max-w-[120px]">
                            <MapPin className="w-3 h-3 text-stone-500" />
                            {p.birth_city || p.birth_place}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpen(false);
                          if (onEditClick) onEditClick(p);
                        }}
                        className="p-1 rounded-md text-stone-400 hover:text-amber-400 hover:bg-stone-800 transition-colors"
                        title="Edit Birth Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-xs text-stone-500 group-hover:text-amber-400">Select</span>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredProfiles.length === 0 && (
                <div className="text-center py-6 text-xs text-stone-400">
                  No saved profiles match your filter.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs">
              <span className="text-stone-400">Birth details are securely reused.</span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onAddNewClick();
                }}
                className="font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Person
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
