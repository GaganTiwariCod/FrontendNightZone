import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { astrologyApi } from '../../api/astrologyApi';
import AstrologyProfileSelector from './AstrologyProfileSelector';
import AstrologyProfileModal from './AstrologyProfileModal';
import { 
  Sparkles, 
  HeartHandshake, 
  UserCheck, 
  Briefcase, 
  Compass, 
  Hash, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Star, 
  MessageSquare, 
  Phone, 
  Video, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  Flame,
  Award,
  BookOpen
} from 'lucide-react';

export default function AstrologyLanding({ 
  onOpenKundli, 
  onOpenMatching, 
  onOpenDirectory, 
  onSelectAstrologer,
  onOpenDashboard,
  onOpenAdmin,
  onOpenPanditRemedy,
  onBack
}) {
  const { 
    user, 
    selectedAstrologyProfile, 
    loadAstrologyProfiles,
    openAuth 
  } = useAuth();

  const [categories, setCategories] = useState([]);
  const [featuredAstrologers, setFeaturedAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, astrologersRes] = await Promise.all([
          astrologyApi.getCategoriesAndServices(),
          astrologyApi.getAstrologers({ limit: 4, sort_by: 'rating' })
        ]);

        if (servicesRes.success) {
          setCategories(servicesRes.categories || []);
        }
        if (astrologersRes.success) {
          setFeaturedAstrologers(astrologersRes.astrologers || []);
        }
      } catch (err) {
        console.error('Error loading astrology landing data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    if (user) {
      loadAstrologyProfiles();
    }
  }, [user]);

  const faqs = [
    {
      q: 'How does the "Enter Once, Reuse Everywhere" profile system work?',
      a: 'Once you set up your birth details or add a family member, their astrological coordinates, Lagna, and chart details are securely stored. Whenever you generate a Kundli, match charts, or book consultations, you simply choose the person from your dropdown without re-entering birth time or place.'
    },
    {
      q: 'Are the Kundli charts generated based on authentic Vedic principles?',
      a: 'Yes! Our calculation engine uses precise astronomical coordinates to compute Lagna, planetary house placements, Nakshatra charan, Vimshottari Mahadasha, and Ashtakoot 36 Guna Milan according to Parashari and Jaimini Vedic systems.'
    },
    {
      q: 'Can I consult with an astrologer live via Chat, Call, or Video?',
      a: 'Absolutely. Verified astrologers offer live text consultation, high-clarity voice calls, and video sessions with collision-prevented calendar slots.'
    },
    {
      q: 'What if an astrologer recommends a specific spiritual remedy or Puja?',
      a: 'Our platform directly links astrologer remedy recommendations to our verified Pandit and Pooja directory so you can book authentic rituals without leaving the portal.'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-stone-950">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-6 pb-20 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-orange-500/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          {/* Back Navigation Bar */}
          {onBack && (
            <div className="mb-4">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-white bg-stone-900/80 border border-stone-700/60 px-3.5 py-1.5 rounded-full hover:border-amber-500/60 transition-all cursor-pointer shadow-xs"
              >
                <span>←</span>
                <span>Back to Home</span>
              </button>
            </div>
          )}

          {/* Active Profile Bar */}
          <div className="mb-8">
            <AstrologyProfileSelector
              onAddNewClick={() => {
                setEditingProfile(null);
                setIsProfileModalOpen(true);
              }}
              onEditClick={(profile) => {
                setEditingProfile(profile);
                setIsProfileModalOpen(true);
              }}
            />
          </div>

          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
              Authentic Vedic Astrology & Spiritual Guidance
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Unlock Your Cosmic Path With{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                Vedic Precision
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Generate detailed Janam Kundli, compute 36 Guna Milan for marriage, and consult top verified Astrologers for career, relationship, and spiritual remedies.
            </p>

            {/* Main Action CTAs */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onOpenKundli}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-orange-500/25 hover:scale-105"
              >
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                Get Your Kundli
              </button>

              <button
                onClick={onOpenMatching}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/40 font-bold text-sm uppercase tracking-wider transition-all shadow-lg hover:border-amber-400"
              >
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                Match Kundli (36 Gunas)
              </button>

              <button
                onClick={onOpenDirectory}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-bold text-sm transition-all"
              >
                <UserCheck className="w-4 h-4 text-orange-400" />
                Find Astrologer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Service Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              Dynamic Astrology Offerings
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Vedic Services & Planetary Guidance
            </h2>
          </div>
          {user && (
            <button
              onClick={onOpenDashboard}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
            >
              <span>Go to My Astrology Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Kundli */}
          <div 
            onClick={onOpenKundli}
            className="group relative bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold mb-5 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-stone-950 transition-all duration-300">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                Janam Kundli & Charts
              </h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Detailed Lagna chart, planetary degrees, Dasha timeline, and Dosha analysis for {selectedAstrologyProfile?.name || 'Self'}.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>View Birth Chart</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Kundli Matching */}
          <div 
            onClick={onOpenMatching}
            className="group relative bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center font-bold mb-5 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-stone-950 transition-all duration-300">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
                Kundli Matching (36 Gunas)
              </h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Ashtakoot Guna Milan compatibility score with Nadi and Manglik Dosha evaluation for marriage.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs font-bold text-orange-400">
              <span>Match 2 Profiles</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Career & Business */}
          <div 
            onClick={onOpenDirectory}
            className="group relative bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold mb-5 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-stone-950 transition-all duration-300">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                Career & Wealth Astrology
              </h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Strategic insights into job promotions, business ventures, financial stability, and favorable Dasha periods.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>Consult Specialists</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Vastu & Numerology */}
          <div 
            onClick={onOpenDirectory}
            className="group relative bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center font-bold mb-5 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-stone-950 transition-all duration-300">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
                Vastu & Numerology
              </h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Harmonize residential energies and discover lucky numbers, name corrections, and life path alignments.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs font-bold text-orange-400">
              <span>Explore Vastu</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Astrologers Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-stone-900/50 border-y border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
                Verified Gurus & Astrologers
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Consult With India's Leading Vedic Astrologers
              </h2>
            </div>
            <button
              onClick={onOpenDirectory}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-amber-300 border border-amber-500/30 text-xs font-bold"
            >
              <span>View All Astrologers</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredAstrologers.map((astrologer) => (
              <div
                key={astrologer.id}
                className="bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between"
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
                      <div className="text-xs text-amber-400 font-medium">{astrologer.years_of_experience}+ Years Exp</div>
                      <div className="flex items-center gap-1 text-xs text-amber-300 font-bold mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{astrologer.rating || 4.9}</span>
                        <span className="text-stone-400 font-normal">({astrologer.consultation_count || 120}+ consultations)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 mt-4 line-clamp-2 leading-relaxed">
                    {astrologer.bio}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {Array.isArray(astrologer.specializations) && astrologer.specializations.slice(0, 3).map((spec, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-stone-800 text-[10px] font-medium text-stone-300 border border-stone-700">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-stone-400">Starting from</div>
                    <div className="text-sm font-black text-amber-400">₹{astrologer.chat_price || 20}/min</div>
                  </div>
                  <button
                    onClick={() => {
                      if (onSelectAstrologer) onSelectAstrologer(astrologer.slug);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 text-xs font-bold transition-all shadow-md shadow-orange-500/20"
                  >
                    Consult Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Spiritual Remedy & Pandit Bridge */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-amber-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Connected Vedic Ecosystem
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              Dosha Remedies & Authentic Pandit Pujas
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              When your chart reveals Manglik Dosha, Saturn Sade Sati, or planetary imbalances, our certified Pandits perform customized Shanti Havans, Jaaps, and Vidhis.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={onOpenPanditRemedy}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20"
              >
                Find Pandit for Puja
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ Accordion */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-stone-800">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-stone-400 mt-1">Everything you need to know about our Astrology & Profile architecture.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-white hover:text-amber-400"
              >
                <span>{faq.q}</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${faqOpen === i ? 'rotate-90 text-amber-400' : 'text-stone-500'}`} />
              </button>
              {faqOpen === i && (
                <div className="px-4 pb-4 text-xs text-stone-300 leading-relaxed border-t border-stone-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Astrology Profile Modal */}
      <AstrologyProfileModal
        isOpen={isProfileModalOpen}
        editingProfile={editingProfile}
        onClose={() => {
          setIsProfileModalOpen(false);
          setEditingProfile(null);
        }}
      />
    </div>
  );
}
