import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { astrologyApi } from '../../api/astrologyApi';
import AstrologyProfileSelector from './AstrologyProfileSelector';
import AstrologyProfileModal from './AstrologyProfileModal';
import { 
  Search, 
  Filter, 
  Star, 
  ShieldCheck, 
  MessageSquare, 
  Phone, 
  Video, 
  FileText, 
  ChevronLeft, 
  Sparkles,
  MapPin,
  Languages
} from 'lucide-react';

const SPECIALIZATIONS = [
  'All',
  'Vedic Astrology',
  'Kundli',
  'Kundli Matching',
  'Career Astrology',
  'Marriage Astrology',
  'Business Astrology',
  'Vastu Shastra',
  'Numerology',
  'Muhurta',
  'Dosha Remedies'
];

const LANGUAGES = ['All', 'Hindi', 'English', 'Sanskrit', 'Marathi', 'Gujarati'];

export default function AstrologerDirectory({ onBack, onSelectAstrologer, onRegisterClick }) {
  const { user } = useAuth();

  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  const fetchAstrologers = async () => {
    setLoading(true);
    try {
      const params = {
        sort_by: sortBy
      };
      if (search.trim()) params.search = search.trim();
      if (selectedSpecialization !== 'All') params.specialization = selectedSpecialization;
      if (selectedLanguage !== 'All') params.language = selectedLanguage;

      const res = await astrologyApi.getAstrologers(params);
      if (res.success) {
        setAstrologers(res.astrologers || []);
      }
    } catch (err) {
      console.error('Error fetching astrologers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAstrologers();
  }, [selectedSpecialization, selectedLanguage, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAstrologers();
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold border border-stone-800 transition-colors w-fit"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Astrology</span>
          </button>

          <button
            onClick={onRegisterClick}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all w-fit"
          >
            ✦ Register as Astrologer
          </button>
        </div>

        {/* Profile Context Bar */}
        <AstrologyProfileSelector
          onAddNewClick={() => {
            setEditingProfile(null);
            setIsProfileModalOpen(true);
          }}
          onEditClick={(p) => {
            setEditingProfile(p);
            setIsProfileModalOpen(true);
          }}
        />

        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Verified Vedic Gurus & Astrologers
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Find & Consult Top Astrologers
          </h1>
          <p className="text-xs sm:text-sm text-stone-400">
            Select an astrologer for instant Chat, Audio Call, Video Consultation, or in-depth PDF Reports using your active birth profile.
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search astrologers by name, city, or specialty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Search
            </button>
          </form>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-stone-800/80 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-stone-400 font-bold">Specialization:</span>
              <div className="flex flex-wrap gap-1.5">
                {SPECIALIZATIONS.slice(0, 6).map((spec) => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialization(spec)}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      selectedSpecialization === spec
                        ? 'bg-amber-500 text-stone-950 font-bold shadow'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-750'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-stone-400 font-bold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs font-semibold focus:outline-none"
              >
                <option value="rating">Top Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="consultations">Most Consultations</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Astrologers Grid */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <p className="text-xs text-stone-400">Loading verified astrologers...</p>
          </div>
        ) : astrologers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {astrologers.map((astrologer) => (
              <div
                key={astrologer.id}
                className="bg-stone-900 border border-stone-800 hover:border-amber-500/50 rounded-3xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <img
                      src={astrologer.profile_photo || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
                      alt={astrologer.display_name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40 shadow-md shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-white text-base truncate">{astrologer.display_name}</h3>
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" title="Verified Astrologer" />
                      </div>
                      <div className="text-xs text-amber-400 font-semibold">{astrologer.years_of_experience}+ Years Experience</div>
                      <div className="flex items-center gap-1 text-xs text-amber-300 font-bold mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{astrologer.rating || 4.9}</span>
                        <span className="text-stone-400 font-normal">({astrologer.review_count || 120} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 mt-4 line-clamp-2 leading-relaxed">
                    {astrologer.bio}
                  </p>

                  {/* Languages & City */}
                  <div className="mt-3 flex items-center gap-3 text-[11px] text-stone-400">
                    <span className="flex items-center gap-1">
                      <Languages className="w-3.5 h-3.5 text-stone-500" />
                      {Array.isArray(astrologer.languages) ? astrologer.languages.join(', ') : 'Hindi, English'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-500" />
                      {astrologer.city || 'India'}
                    </span>
                  </div>

                  {/* Specializations */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {Array.isArray(astrologer.specializations) && astrologer.specializations.map((spec, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-stone-800 text-[10px] font-medium text-stone-300 border border-stone-700">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & Booking CTAs */}
                <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-[10px] text-stone-400">Chat / Call:</div>
                    <div className="text-sm font-black text-amber-400">₹{astrologer.chat_price || 20} <span className="text-[10px] font-normal text-stone-400">/min</span></div>
                  </div>

                  <button
                    onClick={() => onSelectAstrologer(astrologer.slug)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-orange-500/20"
                  >
                    Consult Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-12 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-stone-500 mx-auto" />
            <h3 className="font-bold text-white text-base">No Astrologers Found</h3>
            <p className="text-xs text-stone-400">Try adjusting your search criteria or filters.</p>
          </div>
        )}

        {/* Profile Modal */}
        <AstrologyProfileModal
          isOpen={isProfileModalOpen}
          editingProfile={editingProfile}
          onClose={() => {
            setIsProfileModalOpen(false);
            setEditingProfile(null);
          }}
        />
      </div>
    </div>
  );
}
