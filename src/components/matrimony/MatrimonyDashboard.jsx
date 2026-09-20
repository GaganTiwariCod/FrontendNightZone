import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { matrimonyApi } from '../../api/matrimonyApi';

export default function MatrimonyDashboard({ onStartWizard, onPreviewProfile, onBrowseMatches, onOpenAdmin }) {
  const { user, showToast } = useAuth();
  const [profile, setProfile] = useState(null);
  const [completion, setCompletion] = useState({ completionPercentage: 0, sections: {} });
  const [loading, setLoading] = useState(true);
  const [togglingPublish, setTogglingPublish] = useState(false);
  const API_BASE = 'http://localhost:5001';

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await matrimonyApi.getMyProfile();
      if (res?.data) {
        setProfile(res.data.profile);
        setCompletion(res.data.completion || { completionPercentage: 0, sections: {} });
      }
    } catch (err) {
      showToast('Could not load matrimonial profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleTogglePublish = async () => {
    setTogglingPublish(true);
    try {
      if (profile?.is_published) {
        const res = await matrimonyApi.unpublishProfile();
        if (res.success) {
          showToast('Profile unpublished.');
          loadProfile();
        }
      } else {
        const res = await matrimonyApi.publishProfile();
        if (res.success) {
          showToast('Profile published successfully!');
          loadProfile();
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not update profile publish status.', 'error');
    } finally {
      setTogglingPublish(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#E8862B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#6E6074]">Loading Matrimony Hub...</p>
        </div>
      </div>
    );
  }

  const primaryPhoto = profile?.photos?.find(p => p.is_profile_photo) || profile?.photos?.[0];
  const photoUrl = primaryPhoto?.file_url 
    ? (primaryPhoto.file_url.startsWith('http') ? primaryPhoto.file_url : `${API_BASE}${primaryPhoto.file_url}`)
    : (user?.avatar?.startsWith('http') ? user.avatar : null);

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 py-6 space-y-6 text-[#2A2036]">
      
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-[#241631] to-[#3B1F4F] text-[#F7EEDC] rounded-[24px] p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-diya-pattern opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4.5">
            {/* Avatar / Photo */}
            <div className="relative">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={profile?.first_name || user?.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#E8862B] shadow-md"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#E8862B] text-[#2A1503] font-bold text-2xl flex items-center justify-center border-2 border-[#C99A3F] shadow-md">
                  {(profile?.first_name || user?.name || 'M').substring(0, 2).toUpperCase()}
                </div>
              )}
              {profile?.is_verified && (
                <span className="absolute -bottom-1 -right-1 bg-[#4E6B4F] text-white text-[11px] font-bold px-2 py-0.5 rounded-full border border-white shadow-xs">
                  ✓ Verified
                </span>
              )}
            </div>

            {/* Profile Info */}
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-['Tiro_Devanagari_Hindi',serif] text-2xl sm:text-3xl font-normal text-white m-0">
                  {profile?.first_name} {profile?.last_name || user?.name}
                </h1>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                  profile?.is_published
                    ? 'bg-[#EDF4ED] text-[#4E6B4F] border border-[#BFD4C0]'
                    : 'bg-[#FFF8EC] text-[#8A5A12] border border-[#E8862B]/40'
                }`}>
                  {profile?.profile_status || 'Draft'}
                </span>
              </div>

              <p className="text-[#D6C6D4] text-sm m-0 mt-1">
                {profile?.careerProfile?.profession || 'Professional'} · {profile?.locationProfile?.current_city || 'City not set'}, {profile?.locationProfile?.current_state || ''}
              </p>

              <div className="flex items-center gap-3 text-xs text-[#C99A3F] mt-2 font-medium">
                <span>Created for: <b className="capitalize text-white">{profile?.profile_created_for || 'Myself'}</b></span>
                <span>·</span>
                <span>Visibility: <b className="capitalize text-white">{profile?.profile_visibility || 'Public'}</b></span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            <button
              type="button"
              onClick={() => onStartWizard && onStartWizard(2)}
              className="flex-1 md:flex-none bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold text-sm px-5 py-2.5 rounded-xl border-0 cursor-pointer shadow-sm transition-colors"
            >
              ✏️ Edit Profile
            </button>

            <button
              type="button"
              onClick={() => onPreviewProfile && onPreviewProfile(profile?.id)}
              className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-4 py-2.5 rounded-xl border border-white/20 cursor-pointer transition-colors"
            >
              👁️ Preview Profile
            </button>

            <button
              type="button"
              onClick={handleTogglePublish}
              disabled={togglingPublish}
              className={`flex-1 md:flex-none font-semibold text-sm px-4 py-2.5 rounded-xl border-0 cursor-pointer transition-colors ${
                profile?.is_published
                  ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                  : 'bg-[#4E6B4F] text-white hover:bg-[#3D553E]'
              }`}
            >
              {profile?.is_published ? 'Unpublish' : '🚀 Publish'}
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="flex-1 md:flex-none bg-[#9E2B2B] hover:bg-[#7A1E1E] text-white font-semibold text-sm px-4 py-2.5 rounded-xl border-0 cursor-pointer shadow-sm transition-colors"
              >
                ⚙️ Admin Panel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Completion Checklist & Progress */}
      <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[22px] p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div>
            <h2 className="text-base font-semibold text-[#241631] m-0">Profile Completion Checklist</h2>
            <p className="text-xs text-[#6E6074] m-0">
              Profiles above 80% with verified details receive priority matchmaking.
            </p>
          </div>
          <div className="font-bold text-lg text-[#9E2B2B]">{completion.completionPercentage}% Complete</div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-[#F0E5CF] rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-[#E8862B] to-[#9E2B2B] transition-all duration-300"
            style={{ width: `${completion.completionPercentage}%` }}
          />
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 text-xs">
          {[
            { key: 'basic', label: 'Basic Details', step: 2, icon: '📝' },
            { key: 'religion', label: 'Religion & Cultural', step: 3, icon: '🪔' },
            { key: 'location', label: 'Location', step: 4, icon: '📍' },
            { key: 'education', label: 'Education', step: 5, icon: '🎓' },
            { key: 'career', label: 'Career & Income', step: 6, icon: '💼' },
            { key: 'lifestyle', label: 'Lifestyle', step: 7, icon: '🌿' },
            { key: 'family', label: 'Family Members', step: 8, icon: '👨‍👩‍👦' },
            { key: 'about', label: 'About Me', step: 9, icon: '✍️' },
            { key: 'photos', label: 'Photos', step: 10, icon: '📷' },
            { key: 'partnerPreference', label: 'Partner Criteria', step: 12, icon: '❤️' }
          ].map((sec) => {
            const isDone = !!completion.sections?.[sec.key];
            return (
              <button
                key={sec.key}
                type="button"
                onClick={() => onStartWizard && onStartWizard(sec.step)}
                className={`p-3 rounded-xl border text-left flex items-start justify-between gap-1 transition-all cursor-pointer ${
                  isDone
                    ? 'bg-[#EDF4ED] border-[#BFD4C0] text-[#2E4A2F]'
                    : 'bg-[#FFF8EC] border-[#E8862B]/40 text-[#8A5A12] hover:border-[#E8862B]'
                }`}
              >
                <div>
                  <span className="text-base block mb-0.5">{sec.icon}</span>
                  <b className="text-[12px] block">{sec.label}</b>
                  <span className="text-[10px] font-medium">{isDone ? 'Completed ✓' : 'Incomplete +'}</span>
                </div>
                <span className="text-xs">{isDone ? '✅' : '⚠️'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Highlights & Match Discovery CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Card 1: Match Discovery */}
        <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[22px] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-2xl mb-2 block">💍</span>
            <h3 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-normal text-[#241631] m-0 mb-1">
              Browse Community Matches
            </h3>
            <p className="text-xs text-[#6E6074] leading-relaxed m-0 mb-4">
              Explore verified profiles from your community with shared cultural roots, education, and astrology compatibility.
            </p>
          </div>
          <button
            type="button"
            onClick={onBrowseMatches}
            className="w-full bg-[#9E2B2B] hover:bg-[#852222] text-white font-semibold text-sm py-2.5 rounded-xl border-0 cursor-pointer transition-colors shadow-xs"
          >
            Explore Profiles →
          </button>
        </div>

        {/* Card 2: Horoscope / Kundli Compatibility */}
        <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[22px] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-2xl mb-2 block">✨</span>
            <h3 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-normal text-[#241631] m-0 mb-1">
              Kundli &amp; Guna Milan
            </h3>
            <p className="text-xs text-[#6E6074] leading-relaxed m-0 mb-4">
              Add your birth date, time, and rashi to generate instant 36-guna horoscope matching with prospective brides and grooms.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onStartWizard && onStartWizard(11)}
            className="w-full bg-[#F0E5CF] hover:bg-[#E3D6BF] text-[#2A2036] font-semibold text-sm py-2.5 rounded-xl border-0 cursor-pointer transition-colors"
          >
            Manage Kundli Details
          </button>
        </div>

      </div>

    </div>
  );
}
