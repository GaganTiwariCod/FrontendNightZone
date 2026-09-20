import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { astrologyApi } from '../../api/astrologyApi';
import AstrologyProfileSelector from './AstrologyProfileSelector';
import AstrologyProfileModal from './AstrologyProfileModal';
import { 
  Sparkles, 
  BookOpen, 
  HeartHandshake, 
  PhoneCall, 
  FileText, 
  Calendar, 
  Users, 
  Plus, 
  Trash2, 
  Edit2, 
  ArrowRight,
  ShieldCheck,
  Flame,
  Clock,
  ChevronLeft
} from 'lucide-react';

export default function AstrologyDashboard({ 
  onBack, 
  onOpenKundli, 
  onOpenMatching, 
  onOpenDirectory, 
  onJoinConsultation,
  onOpenPanditRemedy
}) {
  const { 
    user, 
    astrologyProfiles, 
    selectedAstrologyProfile, 
    switchAstrologyProfile, 
    loadAstrologyProfiles,
    showToast 
  } = useAuth();

  const [activeTab, setActiveTab] = useState('OVERVIEW'); // 'OVERVIEW' | 'BOOKINGS' | 'REPORTS' | 'PROFILES'
  const [bookings, setBookings] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, reportsRes] = await Promise.all([
        astrologyApi.getMyBookings(),
        astrologyApi.getMyReports()
      ]);
      if (bookingsRes.success) setBookings(bookingsRes.bookings || []);
      if (reportsRes.success) setReports(reportsRes.reports || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAstrologyProfiles();
      fetchUserData();
    }
  }, [user]);

  const handleDeleteProfile = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}'s birth profile?`)) return;
    try {
      const res = await astrologyApi.deleteProfile(id);
      if (res.success) {
        showToast('Profile deleted.', 'info');
        loadAstrologyProfiles();
      } else {
        showToast(res.message || 'Cannot delete profile.', 'error');
      }
    } catch (err) {
      showToast('Error deleting profile.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold border border-stone-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Astrology Portal</span>
          </button>
        </div>

        {/* Universal Profile Selector */}
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

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">My Astrology Hub</h1>
            <p className="text-xs text-stone-400 mt-1">Manage saved family birth charts, consultations, and Vedic reports.</p>
          </div>
          
          {/* Tabs */}
          <div className="flex rounded-2xl bg-stone-900 p-1 border border-stone-800 self-start sm:self-auto text-xs font-bold">
            {[
              { id: 'OVERVIEW', label: 'Overview' },
              { id: 'BOOKINGS', label: `Consultations (${bookings.length})` },
              { id: 'REPORTS', label: `Reports (${reports.length})` },
              { id: 'PROFILES', label: `Family Profiles (${astrologyProfiles.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            
            {/* Quick Action Service Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div 
                onClick={onOpenKundli}
                className="bg-stone-900 border border-stone-800 hover:border-amber-500/50 rounded-3xl p-6 cursor-pointer transition-all shadow-xl hover:scale-[1.02] space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Janam Kundli</h3>
                  <p className="text-xs text-stone-400 mt-1">View Lagna chart, planetary positions & doshas for {selectedAstrologyProfile?.name || 'Self'}.</p>
                </div>
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <span>Open Kundli</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div 
                onClick={onOpenMatching}
                className="bg-stone-900 border border-stone-800 hover:border-orange-500/50 rounded-3xl p-6 cursor-pointer transition-all shadow-xl hover:scale-[1.02] space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">36 Guna Kundli Matching</h3>
                  <p className="text-xs text-stone-400 mt-1">Check marital compatibility and Ashtakoot scores with saved profiles.</p>
                </div>
                <div className="text-xs font-bold text-orange-400 flex items-center gap-1">
                  <span>Match Profiles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div 
                onClick={onOpenDirectory}
                className="bg-stone-900 border border-stone-800 hover:border-amber-500/50 rounded-3xl p-6 cursor-pointer transition-all shadow-xl hover:scale-[1.02] space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Consult Astrologers</h3>
                  <p className="text-xs text-stone-400 mt-1">Instant chat, call, or video consultation with top verified Gurus.</p>
                </div>
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <span>Find Astrologer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Upcoming Consultations Preview */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Recent & Upcoming Consultations
                </h3>
                <button
                  onClick={() => setActiveTab('BOOKINGS')}
                  className="text-xs font-bold text-amber-400 hover:underline"
                >
                  View All ({bookings.length})
                </button>
              </div>

              {bookings.length > 0 ? (
                <div className="divide-y divide-stone-800/60">
                  {bookings.slice(0, 3).map((b) => (
                    <div key={b.id} className="py-3 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.astrologer?.profile_photo || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                          alt={b.astrologer?.display_name}
                          className="w-10 h-10 rounded-xl object-cover border border-amber-500/40 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-sm text-white">{b.astrologer?.display_name}</div>
                          <div className="text-xs text-stone-400">
                            For: <span className="text-amber-300 font-semibold">{b.profile?.name}</span> • {b.booking_date} at {b.start_time} ({b.consultation_type})
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onJoinConsultation(b.consultation?.id || b.id)}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs shadow"
                      >
                        Enter Room
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400 py-4 text-center">No upcoming consultations booked yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: All Consultations */}
        {activeTab === 'BOOKINGS' && (
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-base">Your Consultation Sessions</h3>
            {bookings.length > 0 ? (
              <div className="divide-y divide-stone-800/60">
                {bookings.map((b) => (
                  <div key={b.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={b.astrologer?.profile_photo || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                        alt={b.astrologer?.display_name}
                        className="w-12 h-12 rounded-2xl object-cover border border-amber-500/40"
                      />
                      <div>
                        <div className="font-bold text-sm text-white">{b.astrologer?.display_name}</div>
                        <div className="text-xs text-stone-400">
                          Birth Profile: <span className="text-amber-300 font-bold">{b.profile?.name}</span> ({b.profile?.relationship || 'Self'})
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5">
                          Date: {b.booking_date} • {b.start_time} • {b.consultation_type} • Status: <span className="text-amber-400 font-semibold">{b.booking_status}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onJoinConsultation(b.consultation?.id || b.id)}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs uppercase shadow"
                    >
                      Consultation Room
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 py-8 text-center">No consultation bookings found.</p>
            )}
          </div>
        )}

        {/* Tab 3: Reports */}
        {activeTab === 'REPORTS' && (
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-base">Astrological Reports & Kundlis</h3>
            {reports.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reports.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                        {r.report_type}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white">{r.title}</h4>
                    <p className="text-xs text-stone-400 line-clamp-2">{r.description}</p>
                    <div className="pt-2 flex justify-between items-center text-xs">
                      <span className="text-amber-400 font-semibold">Profile: {r.profile?.name}</span>
                      {r.report_type === 'KUNDLI_REPORT' ? (
                        <button
                          onClick={onOpenKundli}
                          className="font-bold text-amber-400 hover:underline"
                        >
                          View Kundli
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 py-8 text-center">No reports generated yet.</p>
            )}
          </div>
        )}

        {/* Tab 4: Manage Profiles */}
        {activeTab === 'PROFILES' && (
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Saved Astrology Profiles</h3>
                <p className="text-xs text-stone-400 mt-0.5">Birth details are entered once and automatically reused.</p>
              </div>
              <button
                onClick={() => {
                  setEditingProfile(null);
                  setIsProfileModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs uppercase shadow"
              >
                <Plus className="w-4 h-4" />
                Add Person
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {astrologyProfiles.map((p) => {
                const isSelected = selectedAstrologyProfile?.id === p.id;
                return (
                  <div
                    key={p.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-lg'
                        : 'bg-stone-950 border-stone-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-white text-base">{p.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-amber-400 font-semibold border border-stone-700">
                            {p.relationship || p.profile_type}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="mt-4 space-y-1 text-xs text-stone-300">
                        <div><span className="text-stone-500">DOB:</span> {p.date_of_birth} at {p.time_of_birth}</div>
                        <div><span className="text-stone-500">Place:</span> {p.birth_place}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-stone-800 text-xs">
                      {!isSelected && (
                        <button
                          onClick={() => switchAstrologyProfile(p)}
                          className="font-bold text-amber-400 hover:underline"
                        >
                          Make Active
                        </button>
                      )}
                      {isSelected && <span className="text-stone-500">Currently selected</span>}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProfile(p);
                            setIsProfileModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-300"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {p.profile_type !== 'SELF' && (
                          <button
                            onClick={() => handleDeleteProfile(p.id, p.name)}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-red-500/20 text-stone-300 hover:text-red-400"
                            title="Delete Person"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
