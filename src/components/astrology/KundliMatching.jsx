import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { astrologyApi } from '../../api/astrologyApi';
import AstrologyProfileModal from './AstrologyProfileModal';
import { 
  HeartHandshake, 
  Sparkles, 
  ChevronLeft, 
  Users, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  PhoneCall, 
  Flame,
  ArrowRight
} from 'lucide-react';

export default function KundliMatching({ onBack, onConsultAstrologer, onBookRemedy }) {
  const { 
    user, 
    astrologyProfiles, 
    loadAstrologyProfiles,
    openAuth 
  } = useAuth();

  const [personAId, setPersonAId] = useState('');
  const [personBId, setPersonBId] = useState('');
  const [matchingResult, setMatchingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [targetPersonSlot, setTargetPersonSlot] = useState('B'); // 'A' or 'B'

  useEffect(() => {
    if (user && astrologyProfiles.length === 0) {
      loadAstrologyProfiles();
    }
  }, [user]);

  useEffect(() => {
    if (astrologyProfiles.length > 0) {
      const self = astrologyProfiles.find(p => p.profile_type === 'SELF') || astrologyProfiles[0];
      if (self && !personAId) {
        setPersonAId(self.id);
      }
      const other = astrologyProfiles.find(p => p.id !== self?.id);
      if (other && !personBId) {
        setPersonBId(other.id);
      }
    }
  }, [astrologyProfiles]);

  const handleCalculateMatch = async () => {
    if (!personAId || !personBId) {
      alert('Please select both Person A and Person B profiles.');
      return;
    }
    if (personAId === personBId) {
      alert('Please select two different profiles for Kundli matching.');
      return;
    }

    setLoading(true);
    try {
      const res = await astrologyApi.calculateKundliMatching(personAId, personBId);
      if (res.success) {
        setMatchingResult(res);
      } else {
        alert(res.message || 'Failed to calculate Kundli matching.');
      }
    } catch (err) {
      console.error('Error calculating matching:', err);
      alert('Network error during matching calculation.');
    } finally {
      setLoading(false);
    }
  };

  const personA = astrologyProfiles.find(p => p.id === personAId);
  const personB = astrologyProfiles.find(p => p.id === personBId);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold border border-stone-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Astrology</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            Ashtakoot 36 Guna Milan System
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Vedic Kundli Matching for Marriage
          </h1>
          <p className="text-xs sm:text-sm text-stone-400">
            Select two saved birth profiles to evaluate planetary harmony, Nadi dosha, and Ashtakoot compatibility score.
          </p>
        </div>

        {/* Dual Profile Selector Box */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            
            {/* Person A (e.g. Groom / Self) */}
            <div className="p-5 rounded-2xl bg-stone-950 border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Person A (Self / Boy)
                </span>
                <button
                  onClick={() => {
                    setTargetPersonSlot('A');
                    setIsProfileModalOpen(true);
                  }}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1.5">Select Profile</label>
                <select
                  value={personAId}
                  onChange={(e) => setPersonAId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-850 border border-stone-700 text-white text-sm font-semibold focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose Profile --</option>
                  {astrologyProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.relationship || p.profile_type}) - {p.birth_city || p.birth_place}
                    </option>
                  ))}
                </select>
              </div>

              {personA && (
                <div className="pt-3 border-t border-stone-800/80 text-xs text-stone-400 space-y-1">
                  <div><span className="text-stone-500">DOB:</span> <span className="text-stone-200">{personA.date_of_birth} at {personA.time_of_birth}</span></div>
                  <div><span className="text-stone-500">Place:</span> <span className="text-stone-200">{personA.birth_place}</span></div>
                </div>
              )}
            </div>

            {/* Person B (e.g. Bride / Partner) */}
            <div className="p-5 rounded-2xl bg-stone-950 border border-orange-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                  Person B (Partner / Girl)
                </span>
                <button
                  onClick={() => {
                    setTargetPersonSlot('B');
                    setIsProfileModalOpen(true);
                  }}
                  className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1.5">Select Profile</label>
                <select
                  value={personBId}
                  onChange={(e) => setPersonBId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-850 border border-stone-700 text-white text-sm font-semibold focus:outline-none focus:border-orange-500"
                >
                  <option value="">-- Choose Profile --</option>
                  {astrologyProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.relationship || p.profile_type}) - {p.birth_city || p.birth_place}
                    </option>
                  ))}
                </select>
              </div>

              {personB && (
                <div className="pt-3 border-t border-stone-800/80 text-xs text-stone-400 space-y-1">
                  <div><span className="text-stone-500">DOB:</span> <span className="text-stone-200">{personB.date_of_birth} at {personB.time_of_birth}</span></div>
                  <div><span className="text-stone-500">Place:</span> <span className="text-stone-200">{personB.birth_place}</span></div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={handleCalculateMatch}
              disabled={loading || !personAId || !personBId}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50"
            >
              {loading ? 'Calculating Ashtakoot Gunas...' : 'Match Kundlis (Calculate 36 Gunas)'}
            </button>
          </div>
        </div>

        {/* Matching Calculation Results */}
        {matchingResult && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Score Banner */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                <div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    Compatibility Verdict
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {matchingResult.matching?.verdict}
                  </h2>
                  <p className="text-xs text-stone-300 mt-2">
                    {matchingResult.person_a?.profile?.name} & {matchingResult.person_b?.profile?.name}
                  </p>
                </div>

                {/* Big Score Gauge */}
                <div className="w-32 h-32 rounded-3xl bg-stone-950 border-2 border-amber-500/50 flex flex-col items-center justify-center p-3 shadow-xl shrink-0">
                  <span className="text-3xl font-black text-amber-400">
                    {matchingResult.matching?.guna_total}
                  </span>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    Out of 36
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold mt-1">
                    {matchingResult.matching?.guna_total >= 18 ? 'Passed (≥ 18)' : 'Low Match'}
                  </span>
                </div>
              </div>

              {/* Manglik & Nadi Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-stone-800">
                <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                  <div className="text-xs">
                    <div className="text-stone-400 font-bold">Manglik Compatibility:</div>
                    <div className="text-white font-semibold">{matchingResult.matching?.manglik_compatibility}</div>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800 flex items-center gap-3">
                  {matchingResult.matching?.nadi_dosha ? (
                    <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  <div className="text-xs">
                    <div className="text-stone-400 font-bold">Nadi Dosha Status:</div>
                    <div className="text-white font-semibold">
                      {matchingResult.matching?.nadi_dosha ? 'Nadi Dosha Present (Remedies Advised)' : 'No Nadi Dosha (Auspicious)'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ashtakoot 8 Koot Breakdown Table */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-5 border-b border-stone-800 bg-stone-950">
                <h3 className="font-bold text-white text-base">Ashtakoot 36 Guna Detailed Breakdown</h3>
                <p className="text-xs text-stone-400 mt-0.5">8 distinct Vedic pillars evaluated from birth Nakshatras & Moon signs.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-950/70 text-stone-400 uppercase font-bold border-b border-stone-800">
                    <tr>
                      <th className="p-4">Koot (Pillar)</th>
                      <th className="p-4">Area of Life</th>
                      <th className="p-4">Obtained</th>
                      <th className="p-4">Max Points</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {matchingResult.matching?.breakdown?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-stone-850/50">
                        <td className="p-4 font-bold text-white">{item.koot}</td>
                        <td className="p-4 text-stone-300">{item.description}</td>
                        <td className="p-4 font-black text-amber-400">{item.obtained}</td>
                        <td className="p-4 text-stone-400">{item.max}</td>
                        <td className="p-4">
                          {item.obtained === item.max ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                              Full Match
                            </span>
                          ) : item.obtained > 0 ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                              Partial
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold">
                              Dosha
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Remedial & Consultation CTA */}
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Need Detailed Astrological Advice for Marriage?</h3>
                <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
                  Have our top verified Marriage Astrologers review subtle Navamsha placements, Vivah Muhurta, or perform Vivah Shanti Puja with a certified Pandit.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onConsultAstrologer(personA)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  Consult Marriage Astrologer
                </button>
                <button
                  onClick={onBookRemedy}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 font-bold text-xs transition-all"
                >
                  Book Vivah Shanti Puja
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Modal */}
        <AstrologyProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onSaved={(newProfile) => {
            if (targetPersonSlot === 'A') {
              setPersonAId(newProfile.id);
            } else {
              setPersonBId(newProfile.id);
            }
          }}
        />
      </div>
    </div>
  );
}
