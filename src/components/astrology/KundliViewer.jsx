import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { astrologyApi } from '../../api/astrologyApi';
import AstrologyProfileSelector from './AstrologyProfileSelector';
import AstrologyProfileModal from './AstrologyProfileModal';
import { 
  Sparkles, 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  ShieldCheck, 
  ChevronLeft, 
  Download, 
  Share2, 
  PhoneCall, 
  Flame, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

export default function KundliViewer({ onBack, onConsultAstrologer, onBookRemedy }) {
  const { user, selectedAstrologyProfile, loadAstrologyProfiles } = useAuth();
  
  const [kundliData, setKundliData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('LAGNA'); // 'LAGNA' | 'PLANETS' | 'DOSHAS' | 'DASHA'
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  useEffect(() => {
    const fetchKundli = async () => {
      if (!selectedAstrologyProfile) return;
      setLoading(true);
      try {
        const res = await astrologyApi.generateKundli(selectedAstrologyProfile.id);
        if (res.success) {
          setKundliData(res.kundli);
        }
      } catch (err) {
        console.error('Error generating Kundli:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchKundli();
  }, [selectedAstrologyProfile]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation & Profile Selector */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold border border-stone-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Astrology</span>
          </button>
        </div>

        {/* Universal Profile Switcher */}
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

        {loading ? (
          <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-12 text-center space-y-4">
            <Sparkles className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-white">Calculating Vedic Chart & Planetary Alignments...</h3>
            <p className="text-xs text-stone-400">Computing Lagna, Navamsha, and 36 Guna coordinates for {selectedAstrologyProfile?.name}...</p>
          </div>
        ) : kundliData ? (
          <>
            {/* Header Card with Quick Attributes */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Vedic Janam Kundli
                    </span>
                    <span className="text-xs text-stone-400">
                      Born: {selectedAstrologyProfile.date_of_birth} at {selectedAstrologyProfile.time_of_birth}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {selectedAstrologyProfile.name}'s Birth Chart
                  </h1>
                  <p className="text-xs text-stone-300 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {selectedAstrologyProfile.birth_place}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onConsultAstrologer(selectedAstrologyProfile)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Consult Astrologer on this Chart
                  </button>
                </div>
              </div>

              {/* Quick Glance Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-stone-800">
                <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
                  <div className="text-[10px] text-amber-400/80 font-bold uppercase">Lagna (Ascendant)</div>
                  <div className="text-sm font-bold text-white mt-0.5">{kundliData.lagna}</div>
                </div>
                <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
                  <div className="text-[10px] text-amber-400/80 font-bold uppercase">Moon Sign (Rashi)</div>
                  <div className="text-sm font-bold text-white mt-0.5">{kundliData.moon_sign}</div>
                </div>
                <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
                  <div className="text-[10px] text-amber-400/80 font-bold uppercase">Sun Sign</div>
                  <div className="text-sm font-bold text-white mt-0.5">{kundliData.sun_sign}</div>
                </div>
                <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
                  <div className="text-[10px] text-amber-400/80 font-bold uppercase">Nakshatra</div>
                  <div className="text-sm font-bold text-white mt-0.5">{kundliData.nakshatra} (Ch. {kundliData.charan})</div>
                </div>
                <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
                  <div className="text-[10px] text-amber-400/80 font-bold uppercase">Gana / Nadi</div>
                  <div className="text-sm font-bold text-white mt-0.5">{kundliData.gana} / {kundliData.nadi}</div>
                </div>
                <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
                  <div className="text-[10px] text-amber-400/80 font-bold uppercase">Current Mahadasha</div>
                  <div className="text-sm font-bold text-amber-300 mt-0.5">{kundliData.mahadasha?.current_planet}</div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-stone-800 gap-4">
              {[
                { id: 'LAGNA', label: 'Vedic Kundli Chart' },
                { id: 'PLANETS', label: 'Planetary Placements' },
                { id: 'DOSHAS', label: 'Dosha & Remedies' },
                { id: 'DASHA', label: 'Vimshottari Dasha' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-stone-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Vedic Chart (North Indian Style) */}
            {activeTab === 'LAGNA' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-stone-900/80 border border-stone-800 rounded-3xl p-6 flex flex-col items-center justify-center">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4">
                    Lagna Chart (North Indian Kundli)
                  </h3>
                  
                  {/* SVG / Styled Diamond Chart */}
                  <div className="relative w-72 h-72 sm:w-80 sm:h-80 bg-stone-950 border-2 border-amber-500/60 rounded-xl overflow-hidden shadow-2xl p-2 flex items-center justify-center">
                    <svg viewBox="0 0 300 300" className="w-full h-full stroke-amber-500/60 fill-none stroke-[1.5]">
                      <line x1="0" y1="0" x2="300" y2="300" />
                      <line x1="0" y1="300" x2="300" y2="0" />
                      <polygon points="150,0 300,150 150,300 0,150" />
                    </svg>

                    {/* House Annotations */}
                    <div className="absolute top-8 text-center text-xs font-bold text-amber-400">
                      <div>H1 (Lagna)</div>
                      <div className="text-[10px] text-stone-300">{kundliData.lagna.split(' ')[0]}</div>
                    </div>
                    <div className="absolute top-16 left-12 text-center text-[10px] text-stone-300">H12</div>
                    <div className="absolute top-16 right-12 text-center text-[10px] text-stone-300">H2</div>
                    <div className="absolute left-8 text-center text-[10px] text-stone-300">H11</div>
                    <div className="absolute right-8 text-center text-[10px] text-stone-300">H3</div>
                    <div className="absolute center text-center text-[11px] font-bold text-amber-300">
                      {selectedAstrologyProfile.name}
                    </div>
                    <div className="absolute bottom-8 text-center text-xs font-bold text-amber-400">
                      <div>H7 (Marriage)</div>
                    </div>
                    <div className="absolute bottom-16 left-12 text-center text-[10px] text-stone-300">H6</div>
                    <div className="absolute bottom-16 right-12 text-center text-[10px] text-stone-300">H8</div>
                  </div>

                  <p className="text-[11px] text-stone-400 mt-4 text-center">
                    Chart configured to {selectedAstrologyProfile.birth_place} timezone ({selectedAstrologyProfile.timezone}).
                  </p>
                </div>

                {/* Right Panel: Core Panchang Details */}
                <div className="lg:col-span-5 bg-stone-900/80 border border-stone-800 rounded-3xl p-6 space-y-4">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Panchang & Planetary Strengths
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-2 border-b border-stone-800">
                      <span className="text-stone-400">Tithi:</span>
                      <span className="font-semibold text-white">{kundliData.tithi}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-stone-800">
                      <span className="text-stone-400">Yoga:</span>
                      <span className="font-semibold text-white">{kundliData.yoga}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-stone-800">
                      <span className="text-stone-400">Karana:</span>
                      <span className="font-semibold text-white">{kundliData.karana}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-stone-800">
                      <span className="text-stone-400">Yoni:</span>
                      <span className="font-semibold text-white">{kundliData.yoni}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-stone-800">
                      <span className="text-stone-400">Varna / Vashya:</span>
                      <span className="font-semibold text-white">{kundliData.varna} / {kundliData.vashya}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                        <Sparkles className="w-4 h-4" />
                        Astrological Summary
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        Lagna placed in {kundliData.lagna} with Moon in {kundliData.moon_sign}. Favorable periods indicated during {kundliData.mahadasha?.current_planet} Mahadasha.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Planetary Placements */}
            {activeTab === 'PLANETS' && (
              <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-950 text-stone-400 uppercase font-bold border-b border-stone-800">
                      <tr>
                        <th className="p-4">Planet (Graha)</th>
                        <th className="p-4">House (Bhava)</th>
                        <th className="p-4">Sign (Rashi)</th>
                        <th className="p-4">Degree</th>
                        <th className="p-4">Motion</th>
                        <th className="p-4">Strength</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {kundliData.planets?.map((p, idx) => (
                        <tr key={idx} className="hover:bg-stone-850/50">
                          <td className="p-4 font-bold text-white">{p.name}</td>
                          <td className="p-4 text-amber-400 font-semibold">House {p.house}</td>
                          <td className="p-4 text-stone-200">{p.rashi}</td>
                          <td className="p-4 text-stone-300">{p.degree}</td>
                          <td className="p-4">
                            {p.is_retrograde ? (
                              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold">
                                Retrograde (Vakri)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                Direct (Marga)
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Doshas & Remedies */}
            {activeTab === 'DOSHAS' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Manglik */}
                <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base">Manglik Dosha</h3>
                    {kundliData.doshas?.manglik?.present ? (
                      <span className="px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Present
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        No Dosha
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Status: <span className="font-bold text-white">{kundliData.doshas?.manglik?.severity}</span>
                  </p>
                  <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 text-xs text-amber-300/90">
                    <span className="font-bold">Recommended Remedy: </span>
                    {kundliData.doshas?.manglik?.remedy}
                  </div>
                  <button
                    onClick={onBookRemedy}
                    className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-amber-300 text-xs font-bold transition-all border border-amber-500/30"
                  >
                    Book Shanti Puja with Pandit
                  </button>
                </div>

                {/* Sade Sati */}
                <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base">Saturn Sade Sati</h3>
                    {kundliData.doshas?.sade_sati?.present ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Phase: <span className="font-bold text-white">{kundliData.doshas?.sade_sati?.phase}</span>
                  </p>
                  <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 text-xs text-amber-300/90">
                    <span className="font-bold">Recommended Remedy: </span>
                    {kundliData.doshas?.sade_sati?.remedy}
                  </div>
                  <button
                    onClick={onBookRemedy}
                    className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-amber-300 text-xs font-bold transition-all border border-amber-500/30"
                  >
                    Chant Shani Mantras
                  </button>
                </div>

                {/* Kaal Sarp */}
                <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base">Kaal Sarp Dosha</h3>
                    {kundliData.doshas?.kaal_sarp?.present ? (
                      <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Present
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        No Dosha
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Type: <span className="font-bold text-white">{kundliData.doshas?.kaal_sarp?.type}</span>
                  </p>
                  <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 text-xs text-amber-300/90">
                    <span className="font-bold">Recommended Remedy: </span>
                    {kundliData.doshas?.kaal_sarp?.remedy}
                  </div>
                  <button
                    onClick={onBookRemedy}
                    className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-amber-300 text-xs font-bold transition-all border border-amber-500/30"
                  >
                    Maha Mrityunjaya Puja
                  </button>
                </div>
              </div>
            )}

            {/* Tab 4: Vimshottari Mahadasha */}
            {activeTab === 'DASHA' && (
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white">Vimshottari Mahadasha Timeline</h3>
                  <p className="text-xs text-stone-400">120-year planetary cycle influencing major life events.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                    <div className="text-xs text-amber-400 font-bold uppercase">Current Active Dasha</div>
                    <div className="text-xl font-black text-white mt-1">{kundliData.mahadasha?.current_planet} Mahadasha</div>
                    <div className="text-xs text-stone-400 mt-1">Active until year {kundliData.mahadasha?.end_year}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                    <div className="text-xs text-stone-400 font-bold uppercase">Next Incoming Dasha</div>
                    <div className="text-xl font-black text-amber-300 mt-1">{kundliData.mahadasha?.next_planet} Mahadasha</div>
                    <div className="text-xs text-stone-400 mt-1">Commencing {kundliData.mahadasha?.end_year}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col justify-between">
                    <div className="text-xs text-stone-400 font-bold uppercase">Guidance</div>
                    <button
                      onClick={() => onConsultAstrologer(selectedAstrologyProfile)}
                      className="py-2 px-3 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <span>Analyze Dasha Effects</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : null}

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
