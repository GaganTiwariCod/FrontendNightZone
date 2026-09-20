import React, { useState, useEffect } from 'react';
import { matrimonyApi } from '../../api/matrimonyApi';
import { useAuth } from '../../context/AuthContext';

export default function MatrimonyProfilePreview({ profileId = null, onBack, onEdit }) {
  const { showToast } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const API_BASE = 'http://localhost:5001';

  useEffect(() => {
    const fetchPreview = async () => {
      setLoading(true);
      try {
        const res = await matrimonyApi.getProfilePreview(profileId);
        if (res?.data) {
          setProfile(res.data);
        }
      } catch (err) {
        showToast(err.response?.data?.message || 'Could not load profile preview.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchPreview();
  }, [profileId]);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#E8862B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#6E6074]">Generating Public Profile Preview...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-3">
        <p className="text-sm text-[#6E6074]">Profile not found or currently under review.</p>
        <button onClick={onBack} className="bg-[#E8862B] text-[#2A1503] font-semibold px-4 py-2 rounded-xl border-0">
          Back
        </button>
      </div>
    );
  }

  const photos = profile.photos || [];
  const activePhoto = photos[activePhotoIdx] || photos[0];
  const photoUrl = activePhoto?.file_url
    ? (activePhoto.file_url.startsWith('http') ? activePhoto.file_url : `${API_BASE}${activePhoto.file_url}`)
    : null;

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-6 space-y-6 text-[#2A2036]">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold text-[#6E6074] hover:text-[#241631] flex items-center gap-1.5 bg-[#F0E5CF] hover:bg-[#E3D6BF] px-3.5 py-1.5 rounded-full border-0 cursor-pointer transition-colors"
        >
          <span>←</span>
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {profile.isOwnProfile && (
            <button
              type="button"
              onClick={onEdit}
              className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold text-xs px-4 py-1.5 rounded-full border-0 cursor-pointer shadow-xs transition-colors"
            >
              ✏️ Edit Profile
            </button>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-[#F0E5CF] hover:bg-[#E3D6BF] text-[#2A2036] font-semibold text-xs px-3.5 py-1.5 rounded-full border-0 cursor-pointer transition-colors"
          >
            🖨️ Print / Save PDF
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[24px] overflow-hidden shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Photo Gallery Column (5 cols) */}
          <div className="md:col-span-5 bg-[#241631] p-5 flex flex-col justify-between">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#33204F] border border-[#4A3358] shadow-inner">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={profile.first_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white">
                  <span className="text-4xl mb-2">👤</span>
                  <span className="text-xs text-[#D6C6D4]">Photo on Request</span>
                </div>
              )}

              {profile.is_verified && (
                <span className="absolute top-3 left-3 bg-[#4E6B4F] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                  ✓ Verified Profile
                </span>
              )}
            </div>

            {/* Photo thumbnails */}
            {photos.length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                {photos.map((p, idx) => {
                  const thumb = p.file_url.startsWith('http') ? p.file_url : `${API_BASE}${p.file_url}`;
                  return (
                    <button
                      key={p.id || idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`w-12 h-12 rounded-lg overflow-hidden flex-none border-2 transition-all cursor-pointer p-0 ${
                        activePhotoIdx === idx ? 'border-[#E8862B] scale-105' : 'border-transparent opacity-60'
                      }`}
                    >
                      <img src={thumb} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Details Column (7 cols) */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h1 className="font-['Tiro_Devanagari_Hindi',serif] text-2xl sm:text-3xl font-normal text-[#241631] m-0">
                  {profile.first_name} {profile.last_name}
                </h1>
                <span className="text-xs font-semibold bg-[#EDF4ED] text-[#4E6B4F] px-2.5 py-0.5 rounded-full">
                  Profile for {profile.profile_created_for || 'Myself'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm text-[#9E2B2B] font-bold mt-1">
                <span>{profile.age} Yrs</span>
                <span>·</span>
                <span>{profile.height ? `${profile.height} cm` : 'Height not set'}</span>
                <span>·</span>
                <span className="capitalize">{profile.marital_status?.replace('_', ' ')}</span>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-4 text-xs">
                <div className="p-2.5 bg-[#FFF8EC] border border-[#E8862B]/30 rounded-xl">
                  <span className="text-[#8A5A12] font-semibold block mb-0.5">Religion / Community</span>
                  <b className="text-[#241631]">{profile.religiousProfile?.religion || 'Hindu'}, {profile.religiousProfile?.community || 'Brahmin'}</b>
                </div>

                <div className="p-2.5 bg-[#FFF8EC] border border-[#E8862B]/30 rounded-xl">
                  <span className="text-[#8A5A12] font-semibold block mb-0.5">Current Location</span>
                  <b className="text-[#241631]">{profile.locationProfile?.current_city || 'City'}, {profile.locationProfile?.current_state || 'India'}</b>
                </div>

                <div className="p-2.5 bg-[#FFF8EC] border border-[#E8862B]/30 rounded-xl">
                  <span className="text-[#8A5A12] font-semibold block mb-0.5">Education</span>
                  <b className="text-[#241631]">{profile.educationProfile?.highest_education || 'Graduate'}</b>
                </div>

                <div className="p-2.5 bg-[#FFF8EC] border border-[#E8862B]/30 rounded-xl">
                  <span className="text-[#8A5A12] font-semibold block mb-0.5">Profession &amp; Income</span>
                  <b className="text-[#241631]">
                    {profile.careerProfile?.profession || 'Working'}
                    {profile.careerProfile?.annual_income ? ` · ₹${(profile.careerProfile.annual_income / 100000).toFixed(1)}L/yr` : ''}
                  </b>
                </div>
              </div>
            </div>

            {/* Guarded Contact Info Notice */}
            <div className="bg-[#F0E5CF] border border-[#E3D6BF] rounded-xl p-3 text-xs flex items-center justify-between text-[#6E6074]">
              <span>🔒 Contact details are private and shared only upon mutual consent.</span>
              <span className="font-semibold text-[#9E2B2B]">Guarded</span>
            </div>
          </div>

        </div>
      </div>

      {/* Detailed Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Section 1: About Me */}
        <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[22px] p-6 shadow-sm md:col-span-2">
          <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-normal text-[#241631] m-0 mb-2">
            About Me
          </h2>
          <p className="text-sm text-[#4A3D52] leading-relaxed m-0 whitespace-pre-line">
            {profile.about_me || 'No self-introduction written yet.'}
          </p>
        </div>

        {/* Section 2: Education & Career */}
        <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[22px] p-6 shadow-sm space-y-3">
          <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-normal text-[#241631] m-0">
            🎓 Education &amp; Career
          </h2>
          
          <div className="space-y-2 text-xs text-[#4A3D52]">
            <div className="flex justify-between py-1 border-b border-[#F0E5CF]">
              <span className="text-[#6E6074]">Highest Qualification:</span>
              <b className="text-[#241631]">{profile.educationProfile?.highest_education || 'N/A'}</b>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0E5CF]">
              <span className="text-[#6E6074]">College / University:</span>
              <b className="text-[#241631]">{profile.educationProfile?.college_name || profile.educationProfile?.university_name || 'N/A'}</b>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0E5CF]">
              <span className="text-[#6E6074]">Profession:</span>
              <b className="text-[#241631]">{profile.careerProfile?.profession || 'N/A'}</b>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0E5CF]">
              <span className="text-[#6E6074]">Employment Sector:</span>
              <b className="text-[#241631] capitalize">{profile.careerProfile?.employment_status?.replace('_', ' ') || 'Employed'}</b>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#6E6074]">Annual Income:</span>
              <b className="text-[#241631]">
                {profile.careerProfile?.annual_income 
                  ? `₹${(profile.careerProfile.annual_income / 100000).toFixed(1)} Lakhs / year` 
                  : (profile.careerProfile?.income_hidden ? 'Hidden by user' : 'Not disclosed')}
              </b>
            </div>
          </div>
        </div>

        {/* Section 3: Family Details */}
        <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[22px] p-6 shadow-sm space-y-3">
          <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-normal text-[#241631] m-0">
            👨‍👩‍👦 Family Background
          </h2>
          
          <div className="space-y-2 text-xs text-[#4A3D52]">
            <div className="flex justify-between py-1 border-b border-[#F0E5CF]">
              <span className="text-[#6E6074]">Family Type:</span>
              <b className="text-[#241631] capitalize">{profile.familyProfile?.family_type || 'Nuclear'} Family</b>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0E5CF]">
              <span className="text-[#6E6074]">Family Values:</span>
              <b className="text-[#241631] capitalize">{profile.familyProfile?.family_values || 'Moderate'}</b>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0E5CF]">
              <span className="text-[#6E6074]">Father's Occupation:</span>
              <b className="text-[#241631]">{profile.familyProfile?.father_occupation || profile.familyProfile?.father_status || 'N/A'}</b>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0E5CF]">
              <span className="text-[#6E6074]">Mother's Occupation:</span>
              <b className="text-[#241631]">{profile.familyProfile?.mother_occupation || profile.familyProfile?.mother_status || 'Homemaker'}</b>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#6E6074]">Siblings / Members:</span>
              <b className="text-[#241631]">{profile.familyMembers?.length || 0} Listed</b>
            </div>
          </div>
        </div>

        {/* Section 4: Horoscope & Cultural */}
        <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[22px] p-6 shadow-sm space-y-3">
          <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-normal text-[#241631] m-0">
            🪔 Horoscope &amp; Cultural
          </h2>
          
          <div className="space-y-2 text-xs text-[#4A3D52]">
            <div className="flex justify-between py-1 border-b border-[#F0E5CF]">
              <span className="text-[#6E6074]">Gotra:</span>
              <b className="text-[#241631]">{profile.religiousProfile?.gotra || 'Not specified'}</b>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0E5CF]">
              <span className="text-[#6E6074]">Rashi / Moon Sign:</span>
              <b className="text-[#241631]">{profile.religiousProfile?.rashi || profile.horoscopeProfile?.rashi || 'Not specified'}</b>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0E5CF]">
              <span className="text-[#6E6074]">Nakshatra:</span>
              <b className="text-[#241631]">{profile.religiousProfile?.nakshatra || profile.horoscopeProfile?.nakshatra || 'Not specified'}</b>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#6E6074]">Manglik Status:</span>
              <b className="text-[#241631] capitalize">{profile.religiousProfile?.manglik_status || 'Don\'t Know'}</b>
            </div>
          </div>
        </div>

        {/* Section 5: Partner Preferences */}
        <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[22px] p-6 shadow-sm space-y-3">
          <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-normal text-[#241631] m-0">
            ❤️ Desired Partner Preferences
          </h2>
          
          <div className="space-y-2 text-xs text-[#4A3D52]">
            <div className="flex justify-between py-1 border-b border-[#F0E5CF]">
              <span className="text-[#6E6074]">Age Criteria:</span>
              <b className="text-[#241631]">{profile.partnerPreference?.min_age || 21} to {profile.partnerPreference?.max_age || 35} Yrs</b>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0E5CF]">
              <span className="text-[#6E6074]">Preferred Religion:</span>
              <b className="text-[#241631]">{(profile.partnerPreference?.religions || ['Hindu']).join(', ')}</b>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0E5CF]">
              <span className="text-[#6E6074]">Mother Tongue:</span>
              <b className="text-[#241631]">{(profile.partnerPreference?.mother_tongues || ['Hindi']).join(', ')}</b>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#6E6074]">Diet Preference:</span>
              <b className="text-[#241631] capitalize">{(profile.partnerPreference?.diet_preferences || ['Vegetarian']).join(', ')}</b>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
