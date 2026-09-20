import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { panditApi } from '../../api/panditApi';

export default function PanditProfileDetail({ slug, onBack }) {
  const { showToast } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services'); // 'services' | 'vedic' | 'education' | 'availability'

  // Booking Modal
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    service_name: '',
    date: '',
    location: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await panditApi.getPublicProfileBySlug(slug);
        if (res.success && res.data) {
          setProfile(res.data.profile);
          if (res.data.profile?.services?.length > 0) {
            setBookingFormData(prev => ({
              ...prev,
              service_name: res.data.profile.services[0].name || res.data.profile.services[0].custom_service_name,
              location: `${res.data.profile.city}, ${res.data.profile.state}`
            }));
          }
        } else {
          showToast('Pandit profile not found', 'error');
        }
      } catch (err) {
        console.error('Error fetching pandit profile:', err);
        showToast('Unable to load pandit profile', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchDetail();
  }, [slug]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setShowBookingModal(false);
      showToast(`Your ceremony request has been submitted to ${profile.title} ${profile.full_name}! They will contact you shortly.`, 'success');
    }, 1200);
  };

  if (loading) {
    return (
      <div className="max-w-[1080px] mx-auto px-4 py-24 text-center">
        <div className="inline-block w-10 h-10 border-4 border-[#E8862B] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#6E6074] text-sm">Loading authentic Vedic profile details...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-20 text-center">
        <span className="text-6xl mb-4 inline-block">🕉️</span>
        <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-2xl text-[#241631] mb-2">Pandit Profile Not Found</h2>
        <p className="text-[#6E6074] text-sm mb-6">This profile may be private, under verification, or the link may be outdated.</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-full bg-[#E8862B] text-[#2A1503] font-bold text-xs"
        >
          ← Back to Pandit Directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1080px] mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#8A5A12] hover:text-[#241631] transition-colors"
      >
        <span>← Back to Directory</span>
      </button>

      {/* Profile Header Hero */}
      <div className="bg-[#FFFCF5] border border-[#E3D6BF] rounded-3xl p-6 md:p-8 mb-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              {profile.profile_photo ? (
                <img
                  src={`http://localhost:5001${profile.profile_photo}`}
                  alt={profile.full_name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-[#E8862B]/50 shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80';
                  }}
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#E8862B] to-[#B4571A] text-white flex items-center justify-center text-3xl font-bold font-['Tiro_Devanagari_Hindi',serif] shadow-md">
                  {profile.title?.substring(0, 1) || 'पं'}
                </div>
              )}
              {profile.verification?.identity_verified && (
                <span className="absolute -bottom-1 -right-1 bg-[#2E5E35] text-white text-xs px-2 py-0.5 rounded-full font-bold border-2 border-white shadow-sm flex items-center gap-1">
                  <span>✓ Verified</span>
                </span>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-[#8A5A12] bg-[#F6E7CE] px-2.5 py-0.5 rounded-md">
                  {profile.title}
                </span>
                {profile.pandit_types?.map((t, idx) => (
                  <span key={idx} className="text-xs text-[#6E6074] bg-[#F0EBE1] px-2 py-0.5 rounded-md font-medium">
                    {t}
                  </span>
                ))}
              </div>

              <h1 className="font-['Tiro_Devanagari_Hindi',serif] text-2xl sm:text-3xl font-bold text-[#241631] mb-1">
                {profile.full_name}
              </h1>

              <p className="text-xs sm:text-sm text-[#6E6074] flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>📍 {profile.city}, {profile.state}</span>
                <span>•</span>
                <span className="text-[#2E5E35] font-semibold">{profile.years_of_experience} Years Vedic Practice</span>
                <span>•</span>
                <span className="text-[#E8862B] font-bold">★ {profile.rating ? parseFloat(profile.rating).toFixed(1) : '5.0'} ({profile.review_count || 12} reviews)</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto">
            <button
              onClick={() => setShowBookingModal(true)}
              className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold px-7 py-3 rounded-full text-sm shadow-md transition-all text-center flex items-center justify-center gap-2"
            >
              <span>🪔 Book Ceremony / Consult</span>
            </button>
            <div className="text-center text-xs text-[#8A5A12] bg-[#F6E7CE] py-1.5 px-3 rounded-xl font-medium">
              {profile.travel_available ? `🚗 Travel radius up to ${profile.max_travel_distance_km || 50} km` : '📍 Temple / Local ceremonies only'}
            </div>
          </div>
        </div>

        {/* Short Bio / About */}
        {profile.about && (
          <div className="mt-6 pt-5 border-t border-[#EFE5D2]">
            <h4 className="text-xs font-bold text-[#8A5A12] uppercase tracking-wider mb-1.5">About Pandit Ji</h4>
            <p className="text-xs sm:text-sm text-[#46394A] leading-relaxed whitespace-pre-line">
              {profile.about}
            </p>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E3D6BF] mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'services'
              ? 'border-[#E8862B] text-[#9E2B2B]'
              : 'border-transparent text-[#6E6074] hover:text-[#241631]'
          }`}
        >
          🪔 Puja Services &amp; Rituals ({profile.services?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('vedic')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'vedic'
              ? 'border-[#E8862B] text-[#9E2B2B]'
              : 'border-transparent text-[#6E6074] hover:text-[#241631]'
          }`}
        >
          🕉️ Vedic Lineage &amp; Shakha
        </button>

        <button
          onClick={() => setActiveTab('education')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'education'
              ? 'border-[#E8862B] text-[#9E2B2B]'
              : 'border-transparent text-[#6E6074] hover:text-[#241631]'
          }`}
        >
          📜 Gurukul, Education &amp; Experience
        </button>

        <button
          onClick={() => setActiveTab('availability')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'availability'
              ? 'border-[#E8862B] text-[#9E2B2B]'
              : 'border-transparent text-[#6E6074] hover:text-[#241631]'
          }`}
        >
          📅 Availability &amp; Travel
        </button>
      </div>

      {/* Tab 1: Services & Dakshina */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(profile.services || []).map((service, idx) => (
            <div
              key={idx}
              className="bg-[#FFFCF5] border border-[#E3D6BF] rounded-2xl p-5 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-['Tiro_Devanagari_Hindi',serif] text-base font-bold text-[#241631]">
                    {service.name || service.custom_service_name}
                  </h3>
                  {service.PanditService?.is_primary && (
                    <span className="text-[10px] font-bold text-[#8A5A12] bg-[#F6E7CE] px-2 py-0.5 rounded-full flex-none">
                      Speciality
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#6E6074] leading-relaxed mb-4">
                  {service.description || 'Authentic shastra vidhi and havan rituals performed as per traditional family customs.'}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs bg-[#F8F4EB] p-3 rounded-xl text-[#5A4833] mb-4">
                  <div>
                    <span className="text-[#8C7558] block text-[11px]">Duration:</span>
                    <span className="font-semibold text-[#241631]">{service.PanditService?.duration_minutes || 60} mins</span>
                  </div>
                  <div>
                    <span className="text-[#8C7558] block text-[11px]">Samagri:</span>
                    <span className="font-semibold text-[#241631]">
                      {service.PanditService?.includes_samagri ? '✓ Included by Pandit' : 'Client arranged / List provided'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EFE5D2] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#8C7558] block">Dakshina:</span>
                  <span className="text-sm font-bold text-[#2E5E35]">
                    {service.PanditService?.price_type === 'fixed' && service.PanditService?.fixed_price
                      ? `₹${service.PanditService.fixed_price}`
                      : service.PanditService?.price_type === 'range' && service.PanditService?.min_price
                      ? `₹${service.PanditService.min_price} - ₹${service.PanditService.max_price}`
                      : 'As per Shradha / Dakshina'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setBookingFormData(prev => ({
                      ...prev,
                      service_name: service.name || service.custom_service_name
                    }));
                    setShowBookingModal(true);
                  }}
                  className="px-4 py-1.5 rounded-full bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold text-xs transition-all shadow-xs"
                >
                  Book This Puja
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Vedic Lineage */}
      {activeTab === 'vedic' && (
        <div className="bg-[#FFFCF5] border border-[#E3D6BF] rounded-2xl p-6 shadow-xs">
          <h3 className="font-['Tiro_Devanagari_Hindi',serif] text-lg font-bold text-[#241631] mb-4 flex items-center gap-2">
            <span>🕉️</span>
            <span>Vedic Lineage &amp; Religious Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#F8F4EB] p-3.5 rounded-xl border border-[#EBE1D0]">
              <span className="text-xs text-[#8C7558] block font-medium">Veda Tradition:</span>
              <span className="text-sm font-bold text-[#241631]">{profile.religiousDetail?.veda || 'Not Specified'}</span>
            </div>

            <div className="bg-[#F8F4EB] p-3.5 rounded-xl border border-[#EBE1D0]">
              <span className="text-xs text-[#8C7558] block font-medium">Gotra:</span>
              <span className="text-sm font-bold text-[#241631]">{profile.religiousDetail?.gotra || 'Not Specified'}</span>
            </div>

            <div className="bg-[#F8F4EB] p-3.5 rounded-xl border border-[#EBE1D0]">
              <span className="text-xs text-[#8C7558] block font-medium">Pravara:</span>
              <span className="text-sm font-bold text-[#241631]">{profile.religiousDetail?.pravara || 'Traditional'}</span>
            </div>

            <div className="bg-[#F8F4EB] p-3.5 rounded-xl border border-[#EBE1D0]">
              <span className="text-xs text-[#8C7558] block font-medium">Shakha:</span>
              <span className="text-sm font-bold text-[#241631]">{profile.religiousDetail?.shakha || 'Not Specified'}</span>
            </div>

            <div className="bg-[#F8F4EB] p-3.5 rounded-xl border border-[#EBE1D0]">
              <span className="text-xs text-[#8C7558] block font-medium">Sutra:</span>
              <span className="text-sm font-bold text-[#241631]">{profile.religiousDetail?.sutra || 'Grihya Sutra'}</span>
            </div>

            <div className="bg-[#F8F4EB] p-3.5 rounded-xl border border-[#EBE1D0]">
              <span className="text-xs text-[#8C7558] block font-medium">Sampradaya:</span>
              <span className="text-sm font-bold text-[#241631]">{profile.religiousDetail?.sampradaya || 'Smartha / Vaishnava'}</span>
            </div>

            <div className="bg-[#F8F4EB] p-3.5 rounded-xl border border-[#EBE1D0]">
              <span className="text-xs text-[#8C7558] block font-medium">Kul Devta:</span>
              <span className="text-sm font-bold text-[#241631]">{profile.religiousDetail?.kul_devta || 'Not Specified'}</span>
            </div>

            <div className="bg-[#F8F4EB] p-3.5 rounded-xl border border-[#EBE1D0]">
              <span className="text-xs text-[#8C7558] block font-medium">Ishta Devta:</span>
              <span className="text-sm font-bold text-[#241631]">{profile.religiousDetail?.ishta_devta || 'Not Specified'}</span>
            </div>
          </div>

          {profile.religiousDetail?.guru_parampara && (
            <div className="bg-[#F8F4EB] p-4 rounded-xl border border-[#EBE1D0]">
              <span className="text-xs font-bold text-[#8A5A12] block mb-1">Guru Parampara &amp; Peeth Lineage:</span>
              <p className="text-xs sm:text-sm text-[#46394A] leading-relaxed">{profile.religiousDetail.guru_parampara}</p>
            </div>
          )}

          {/* Languages Spoken */}
          <div className="mt-6 pt-5 border-t border-[#EFE5D2]">
            <h4 className="text-xs font-bold text-[#8A5A12] uppercase tracking-wider mb-3">Languages &amp; Vedic Chanting</h4>
            <div className="flex flex-wrap gap-2">
              {(profile.languages || []).map((l, idx) => (
                <div key={idx} className="bg-white border border-[#D5C7B0] px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2">
                  <span className="font-semibold text-[#241631]">{l.name}</span>
                  <span className="text-[#8C7558]">({l.PanditLanguage?.fluency || 'fluent'})</span>
                  {l.PanditLanguage?.can_recite_mantras && (
                    <span className="text-[10px] text-[#2E5E35] bg-[#E8F3EA] px-1.5 py-0.5 rounded font-bold">Mantra Chanting</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Education & Experience */}
      {activeTab === 'education' && (
        <div className="space-y-6">
          {/* Gurukul & Vedic Degrees */}
          <div className="bg-[#FFFCF5] border border-[#E3D6BF] rounded-2xl p-6 shadow-xs">
            <h3 className="font-['Tiro_Devanagari_Hindi',serif] text-lg font-bold text-[#241631] mb-4 flex items-center gap-2">
              <span>📜</span>
              <span>Gurukul &amp; Vedic Education</span>
            </h3>

            {(!profile.education || profile.education.length === 0) ? (
              <p className="text-xs text-[#6E6074]">Traditional hereditary Vedic apprenticeship and family lineage learning.</p>
            ) : (
              <div className="space-y-3">
                {profile.education.map((edu, idx) => (
                  <div key={idx} className="bg-[#F8F4EB] p-4 rounded-xl border border-[#EBE1D0]">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-bold text-[#241631]">{edu.degree_or_title}</h4>
                      {edu.year_of_passing && (
                        <span className="text-xs text-[#8C7558] font-medium">{edu.year_of_passing}</span>
                      )}
                    </div>
                    <p className="text-xs text-[#8A5A12] font-semibold">{edu.institution_name} ({edu.institution_type})</p>
                    {edu.field_of_study && <p className="text-xs text-[#6E6074] mt-0.5">{edu.field_of_study}</p>}
                    {edu.honors && <p className="text-xs text-[#2E5E35] mt-1 font-medium">🏅 {edu.honors}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Temple & Sansthan Experience */}
          <div className="bg-[#FFFCF5] border border-[#E3D6BF] rounded-2xl p-6 shadow-xs">
            <h3 className="font-['Tiro_Devanagari_Hindi',serif] text-lg font-bold text-[#241631] mb-4 flex items-center gap-2">
              <span>🛕</span>
              <span>Temple &amp; Ashram Experience</span>
            </h3>

            {(!profile.experience || profile.experience.length === 0) ? (
              <p className="text-xs text-[#6E6074]">Independent Purohit with {profile.years_of_experience} years of service across residential and community mandals.</p>
            ) : (
              <div className="space-y-3">
                {profile.experience.map((exp, idx) => (
                  <div key={idx} className="bg-[#F8F4EB] p-4 rounded-xl border border-[#EBE1D0]">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-bold text-[#241631]">{exp.role_title}</h4>
                      <span className="text-xs text-[#8C7558] font-medium">
                        {exp.start_year} - {exp.is_current ? 'Present' : exp.end_year || 'Present'}
                      </span>
                    </div>
                    <p className="text-xs text-[#8A5A12] font-semibold">{exp.organization_or_temple_name} ({exp.temple_type})</p>
                    {exp.city && <p className="text-xs text-[#6E6074] mt-0.5">{exp.city}, {exp.state}</p>}
                    {exp.key_rituals_handled && <p className="text-xs text-[#46394A] mt-1.5">{exp.key_rituals_handled}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Availability & Travel */}
      {activeTab === 'availability' && (
        <div className="bg-[#FFFCF5] border border-[#E3D6BF] rounded-2xl p-6 shadow-xs">
          <h3 className="font-['Tiro_Devanagari_Hindi',serif] text-lg font-bold text-[#241631] mb-4 flex items-center gap-2">
            <span>📅</span>
            <span>Availability Schedule &amp; Travel Radius</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#F8F4EB] p-4 rounded-xl border border-[#EBE1D0]">
              <h4 className="text-xs font-bold text-[#8A5A12] uppercase tracking-wider mb-2">Service Modes Available</h4>
              <ul className="space-y-1.5 text-xs text-[#241631]">
                <li className="flex items-center gap-2">
                  <span className={profile.availability?.allows_home_visit ? 'text-[#2E5E35]' : 'text-gray-400'}>
                    {profile.availability?.allows_home_visit ? '✓' : '✕'}
                  </span>
                  <span>Home Visit Pujas (Yajman Residence)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={profile.availability?.allows_temple_service ? 'text-[#2E5E35]' : 'text-gray-400'}>
                    {profile.availability?.allows_temple_service ? '✓' : '✕'}
                  </span>
                  <span>Temple / Ashram / Community Hall Services</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={profile.availability?.allows_online_puja ? 'text-[#2E5E35]' : 'text-gray-400'}>
                    {profile.availability?.allows_online_puja ? '✓' : '✕'}
                  </span>
                  <span>Online Video E-Puja &amp; Sankalpa</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={profile.availability?.consultation_available ? 'text-[#2E5E35]' : 'text-gray-400'}>
                    {profile.availability?.consultation_available ? '✓' : '✕'}
                  </span>
                  <span>Pre-ceremony Muhurat &amp; Kundli Consultation</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#F8F4EB] p-4 rounded-xl border border-[#EBE1D0]">
              <h4 className="text-xs font-bold text-[#8A5A12] uppercase tracking-wider mb-2">Travel &amp; Coverage</h4>
              <ul className="space-y-1.5 text-xs text-[#241631]">
                <li><b>Primary Base:</b> {profile.city}, {profile.state}</li>
                <li><b>Max Travel Radius:</b> {profile.max_travel_distance_km || 50} km</li>
                <li><b>Outstation Travel:</b> {profile.outstation_available ? '✓ Yes (Travel expenses extra)' : 'Local only'}</li>
                <li><b>Advance Notice:</b> {profile.availability?.advance_booking_days || 2} days advance booking recommended</li>
              </ul>
            </div>
          </div>

          {/* Active Days */}
          <div>
            <h4 className="text-xs font-bold text-[#8A5A12] uppercase tracking-wider mb-2">Available Days</h4>
            <div className="flex flex-wrap gap-2">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                const isAvailable = (profile.availability?.available_days || []).includes(day);
                return (
                  <span
                    key={day}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${
                      isAvailable ? 'bg-[#2E5E35] text-white' : 'bg-[#EAE6DF] text-gray-400 line-through'
                    }`}
                  >
                    {day.substring(0, 3)}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFCF5] border border-[#E3D6BF] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute right-5 top-5 text-[#8C7558] hover:text-[#241631] text-xl font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">🪔</span>
              <div>
                <h3 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-bold text-[#241631]">
                  Book Ceremony / Consult
                </h3>
                <p className="text-xs text-[#6E6074]">
                  Send inquiry to {profile.title} {profile.full_name}
                </p>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">Select Puja / Ceremony</label>
                <select
                  required
                  value={bookingFormData.service_name}
                  onChange={(e) => setBookingFormData({ ...bookingFormData, service_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                >
                  {(profile.services || []).map((s, idx) => (
                    <option key={idx} value={s.name || s.custom_service_name}>{s.name || s.custom_service_name}</option>
                  ))}
                  <option value="Other Vedic Ritual">Other Vedic Ritual (Consult Pandit)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#6E6074] mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={bookingFormData.date}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, date: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6E6074] mb-1">City / Location</label>
                  <input
                    type="text"
                    required
                    value={bookingFormData.location}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, location: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">Special Requirements / Gotra / Notes</label>
                <textarea
                  rows="3"
                  value={bookingFormData.notes}
                  onChange={(e) => setBookingFormData({ ...bookingFormData, notes: e.target.value })}
                  placeholder="Mention your family gotra, preferred muhurat timing, or any specific requirements..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#6E6074] hover:bg-[#EFE5D2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold text-xs shadow-md flex items-center gap-2"
                >
                  {submitting ? 'Submitting...' : 'Confirm Request 🪔'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
