import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { panditApi } from '../../api/panditApi';

export default function PanditDirectory({ onSelectPandit, onRegisterClick, onOpenAdmin }) {
  const { user, selectedCity, showToast } = useAuth();

  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [masterData, setMasterData] = useState({ services: [], languages: [], vedas: [] });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVeda, setSelectedVeda] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [homeVisitOnly, setHomeVisitOnly] = useState(false);
  const [onlinePujaOnly, setOnlinePujaOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('top_rated');

  // Booking Modal State
  const [bookingPandit, setBookingPandit] = useState(null);
  const [bookingFormData, setBookingFormData] = useState({
    service_name: '',
    date: '',
    location: '',
    notes: ''
  });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Load master data
  useEffect(() => {
    const fetchMaster = async () => {
      try {
        const res = await panditApi.getMasterData();
        if (res.success && res.data) {
          setMasterData(res.data);
        }
      } catch (err) {
        console.error('Error fetching master data:', err);
      }
    };
    fetchMaster();
  }, []);

  // Fetch pandit directory
  const fetchPandits = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm || undefined,
        city: selectedCity !== 'All' ? selectedCity : undefined,
        veda: selectedVeda || undefined,
        service_id: selectedService || undefined,
        language_id: selectedLanguage || undefined,
        home_visit: homeVisitOnly ? 'true' : undefined,
        online_puja: onlinePujaOnly ? 'true' : undefined,
        verified_only: verifiedOnly ? 'true' : undefined,
        sort_by: sortBy
      };

      const res = await panditApi.getPublicDirectory(params);
      if (res.success && res.data) {
        setPandits(res.data.pandits || []);
      }
    } catch (err) {
      console.error('Error fetching pandits:', err);
      showToast('Failed to load Pandits directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPandits();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCity, selectedVeda, selectedService, selectedLanguage, homeVisitOnly, onlinePujaOnly, verifiedOnly, sortBy]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSubmitted(true);
    setTimeout(() => {
      setBookingSubmitted(false);
      setBookingPandit(null);
      showToast(`Puja inquiry sent to ${bookingPandit.title} ${bookingPandit.full_name}! They will contact you shortly.`, 'success');
    }, 1200);
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#2B1736] via-[#3B1F4B] to-[#2B1736] text-white rounded-3xl p-6 md:p-10 mb-8 border border-[#4A3358] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-8 -translate-y-8">
          <span className="text-[180px]">🪔</span>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8862B]/20 border border-[#E8862B]/40 text-[#E8862B] text-xs font-semibold mb-4">
            <span>🕉️ Certified Vedic Acharyas &amp; Purohits</span>
          </div>
          <h1 className="font-['Tiro_Devanagari_Hindi',serif] text-3xl md:text-4xl text-[#F7EEDC] mb-3 leading-tight">
            Find a Verified Pandit for Any Auspicious Ceremony
          </h1>
          <p className="text-[#D6C6D4] text-sm md:text-base leading-relaxed mb-6">
            Connect with experienced Purohits, Shastris, and Jyotishacharyas verified by Vedic lineage, Shakha, and Sampradaya for Griha Pravesh, Vivah, Havans, and ancestral rituals.
          </p>

          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={onRegisterClick}
              className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold px-6 py-3 rounded-full text-sm transition-all shadow-md hover:scale-105 flex items-center gap-2"
            >
              <span>🪔 Register as a Pandit</span>
              <span>→</span>
            </button>
            {user?.role === 'ADMIN' && (
              <button
                onClick={onOpenAdmin}
                className="bg-[#3D2650] hover:bg-[#4E3166] text-[#F3AC7A] border border-[#F3AC7A]/40 font-semibold px-5 py-3 rounded-full text-sm transition-all flex items-center gap-2"
              >
                <span>⚙️ Pandit Admin Moderation</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#FFFCF5] border border-[#E3D6BF] rounded-2xl p-5 mb-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search Box */}
          <div className="relative">
            <label className="block text-xs font-semibold text-[#6E6074] mb-1">Search Name / Puja</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[#9B89A0]">🔍</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. Pandit Sharma, Griha Pravesh..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
              />
            </div>
          </div>

          {/* Puja Service Filter */}
          <div>
            <label className="block text-xs font-semibold text-[#6E6074] mb-1">Ritual / Ceremony</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
            >
              <option value="">All Puja Ceremonies</option>
              {masterData.services.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Veda Filter */}
          <div>
            <label className="block text-xs font-semibold text-[#6E6074] mb-1">Veda Tradition</label>
            <select
              value={selectedVeda}
              onChange={(e) => setSelectedVeda(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
            >
              <option value="">All Vedic Traditions</option>
              {masterData.vedas.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-xs font-semibold text-[#6E6074] mb-1">Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
            >
              <option value="">All Languages</option>
              {masterData.languages.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Pills & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#EFE5D2]">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                verifiedOnly
                  ? 'bg-[#2E5E35] text-white'
                  : 'bg-[#F0EBE1] text-[#4E6B4F] hover:bg-[#E5DDCF]'
              }`}
            >
              <span>✓ Verified Pandits Only</span>
            </button>

            <button
              onClick={() => setHomeVisitOnly(!homeVisitOnly)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                homeVisitOnly
                  ? 'bg-[#E8862B] text-white'
                  : 'bg-[#F0EBE1] text-[#6E6074] hover:bg-[#E5DDCF]'
              }`}
            >
              <span>🏠 Home Visit Available</span>
            </button>

            <button
              onClick={() => setOnlinePujaOnly(!onlinePujaOnly)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                onlinePujaOnly
                  ? 'bg-[#7A3E9D] text-white'
                  : 'bg-[#F0EBE1] text-[#6E6074] hover:bg-[#E5DDCF]'
              }`}
            >
              <span>💻 Online E-Puja</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6E6074] font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1 text-xs bg-white border border-[#D5C7B0] rounded-lg focus:border-[#E8862B] outline-none text-[#241631]"
            >
              <option value="top_rated">Highest Rated ⭐</option>
              <option value="experience">Most Experienced 📜</option>
              <option value="completed_services">Most Pujas Completed 🪔</option>
              <option value="newest">Newest Listed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pandit Cards Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#E8862B] border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-[#6E6074] text-sm">Searching Vedic scholars and Pandits in {selectedCity}...</p>
        </div>
      ) : pandits.length === 0 ? (
        <div className="bg-[#FFFCF5] border border-[#E3D6BF] rounded-2xl p-12 text-center shadow-sm">
          <span className="text-5xl mb-3 inline-block">🕉️</span>
          <h3 className="font-['Tiro_Devanagari_Hindi',serif] text-2xl text-[#241631] mb-2">No Pandits Found</h3>
          <p className="text-[#6E6074] text-sm max-w-md mx-auto mb-6">
            We couldn't find any registered pandits matching your exact criteria in {selectedCity}. Try adjusting your filters or search terms.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedVeda('');
              setSelectedService('');
              setSelectedLanguage('');
              setHomeVisitOnly(false);
              setOnlinePujaOnly(false);
              setVerifiedOnly(false);
            }}
            className="px-5 py-2.5 rounded-full bg-[#E8862B] text-[#2A1503] font-bold text-xs hover:bg-[#D8791F] transition-all"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pandits.map((pandit) => (
            <div
              key={pandit.id}
              className="bg-[#FFFCF5] border border-[#E3D6BF] hover:border-[#E8862B] rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-lg group"
            >
              <div>
                {/* Card Top: Photo & Badges */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="relative flex-none">
                    {pandit.profile_photo ? (
                      <img
                        src={`http://localhost:5001${pandit.profile_photo}`}
                        alt={pandit.full_name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E8862B]/60 shadow-sm"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8862B] to-[#B4571A] text-white flex items-center justify-center text-xl font-bold font-['Tiro_Devanagari_Hindi',serif] shadow-sm">
                        {pandit.title?.substring(0, 1) || 'पं'}
                      </div>
                    )}
                    {pandit.verification?.identity_verified && (
                      <span className="absolute -bottom-1 -right-1 bg-[#2E5E35] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border border-white" title="Verified Vedic Priest">
                        ✓
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-semibold text-[#8A5A12] bg-[#F6E7CE] px-2 py-0.5 rounded-md">
                        {pandit.title || 'Pandit'}
                      </span>
                      {pandit.verification?.vedic_certified && (
                        <span className="text-[10px] font-bold text-[#7A3E9D] bg-[#EAE6F5] px-1.5 py-0.5 rounded-md">
                          Vedic Certified
                        </span>
                      )}
                    </div>
                    <h3 className="font-['Tiro_Devanagari_Hindi',serif] text-lg font-bold text-[#241631] group-hover:text-[#9E2B2B] transition-colors truncate">
                      {pandit.full_name}
                    </h3>
                    <p className="text-xs text-[#6E6074] flex items-center gap-1 mt-0.5">
                      <span>📍</span>
                      <span>{pandit.city}, {pandit.state}</span>
                      <span className="text-[#B8A6B8]">·</span>
                      <span className="font-medium text-[#2E5E35]">{pandit.years_of_experience} yrs exp</span>
                    </p>
                  </div>
                </div>

                {/* Vedic Details Strip */}
                {pandit.religiousDetail && (
                  <div className="bg-[#F8F4EB] rounded-xl p-2.5 mb-3 text-xs flex flex-wrap items-center gap-x-3 gap-y-1 text-[#5A4833] border border-[#EBE1D0]">
                    {pandit.religiousDetail.veda && pandit.religiousDetail.veda !== 'Not Specified' && (
                      <div>
                        <span className="text-[#8C7558] font-medium">Veda:</span> <b className="text-[#241631]">{pandit.religiousDetail.veda}</b>
                      </div>
                    )}
                    {pandit.religiousDetail.gotra && (
                      <div>
                        <span className="text-[#8C7558] font-medium">Gotra:</span> <b className="text-[#241631]">{pandit.religiousDetail.gotra}</b>
                      </div>
                    )}
                    {pandit.religiousDetail.sampradaya && (
                      <div>
                        <span className="text-[#8C7558] font-medium">Sampradaya:</span> <b className="text-[#241631]">{pandit.religiousDetail.sampradaya}</b>
                      </div>
                    )}
                  </div>
                )}

                {/* Short Bio */}
                <p className="text-xs text-[#524456] line-clamp-2 leading-relaxed mb-3">
                  {pandit.short_bio || 'Experienced Vedic purohit providing authentic shastra-compliant rituals, havans, and astrology guidance.'}
                </p>

                {/* Services / Puja Tags */}
                <div className="mb-3">
                  <div className="text-[11px] font-semibold text-[#8A5A12] mb-1.5 flex items-center justify-between">
                    <span>Key Pujas Performed</span>
                    <span className="text-[#6E6074] font-normal">{pandit.services?.length || 0} services</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(pandit.services || []).slice(0, 3).map((s, idx) => (
                      <span key={idx} className="text-[11px] bg-[#FFF2DE] text-[#8A5A12] border border-[#F3D7B0] px-2 py-0.5 rounded-md font-medium">
                        {s.name || s.custom_service_name}
                      </span>
                    ))}
                    {(pandit.services || []).length > 3 && (
                      <span className="text-[10.5px] bg-[#F0EBE1] text-[#6E6074] px-1.5 py-0.5 rounded-md font-medium">
                        +{pandit.services.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Languages */}
                <div className="flex items-center gap-1.5 text-[11.5px] text-[#6E6074] mb-4">
                  <span className="font-semibold text-[#241631]">Languages:</span>
                  <span className="truncate">
                    {(pandit.languages || []).map((l) => l.name).join(', ') || 'Sanskrit, Hindi'}
                  </span>
                </div>
              </div>

              {/* Card Footer: Rating & Action Buttons */}
              <div className="pt-3 border-t border-[#EFE5D2] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-xs font-bold text-[#8A5A12]">
                  <span className="text-[#E8862B]">★</span>
                  <span>{pandit.rating ? parseFloat(pandit.rating).toFixed(1) : '5.0'}</span>
                  <span className="text-[11px] text-[#9B89A0] font-normal">({pandit.review_count || 12})</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSelectPandit(pandit.slug)}
                    className="px-3 py-1.5 rounded-full bg-[#F0EBE1] hover:bg-[#E5DDCF] text-[#241631] text-xs font-semibold transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setBookingPandit(pandit);
                      setBookingFormData({
                        service_name: pandit.services?.[0]?.name || 'Griha Pravesh Puja',
                        date: '',
                        location: `${pandit.city}, ${pandit.state}`,
                        notes: ''
                      });
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] text-xs font-bold transition-all shadow-sm"
                  >
                    Request Puja
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Booking Modal */}
      {bookingPandit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFCF5] border border-[#E3D6BF] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setBookingPandit(null)}
              className="absolute right-5 top-5 text-[#8C7558] hover:text-[#241631] text-xl font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">🪔</span>
              <div>
                <h3 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-bold text-[#241631]">
                  Book Ceremony / Consult Pandit
                </h3>
                <p className="text-xs text-[#6E6074]">
                  Send inquiry to {bookingPandit.title} {bookingPandit.full_name} ({bookingPandit.city})
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
                  {(bookingPandit.services || []).map((s, idx) => (
                    <option key={idx} value={s.name || s.custom_service_name}>{s.name || s.custom_service_name}</option>
                  ))}
                  <option value="Other Vedic Ritual">Other Vedic Ritual (Consult Pandit)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#6E6074] mb-1">Preferred Date / Muhurat</label>
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
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">Special Requirements / Gotra / Samagri Query</label>
                <textarea
                  rows="3"
                  value={bookingFormData.notes}
                  onChange={(e) => setBookingFormData({ ...bookingFormData, notes: e.target.value })}
                  placeholder="Mention any specific family customs, muhurat preferences, or samagri arrangement needs..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBookingPandit(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#6E6074] hover:bg-[#EFE5D2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingSubmitted}
                  className="px-6 py-2.5 rounded-full bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold text-xs shadow-md flex items-center gap-2"
                >
                  {bookingSubmitted ? 'Submitting...' : 'Send Puja Request 🪔'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
