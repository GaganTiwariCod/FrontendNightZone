import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { astrologyApi } from '../../api/astrologyApi';
import AstrologyProfileSelector from './AstrologyProfileSelector';
import AstrologyProfileModal from './AstrologyProfileModal';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Star, 
  MessageSquare, 
  Phone, 
  Video, 
  FileText, 
  Calendar, 
  Clock, 
  Award, 
  Languages, 
  MapPin, 
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function AstrologerProfileDetail({ slug, onBack, onBookingSuccess }) {
  const { 
    user, 
    selectedAstrologyProfile, 
    loadAstrologyProfiles,
    openAuth, 
    showToast 
  } = useAuth();

  const [astrologer, setAstrologer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consultationType, setConsultationType] = useState('CHAT'); // 'CHAT' | 'AUDIO_CALL' | 'VIDEO_CALL' | 'REPORT'
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('10:00');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  const timeSlots = [
    '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00',
    '17:00', '17:30', '18:00', '18:30', '19:00'
  ];

  useEffect(() => {
    const fetchAstrologer = async () => {
      setLoading(true);
      try {
        const res = await astrologyApi.getAstrologerBySlug(slug);
        if (res.success) {
          setAstrologer(res.astrologer);
        }
      } catch (err) {
        console.error('Error fetching astrologer details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchAstrologer();
    }
  }, [slug]);

  const handleBookSession = async () => {
    if (!user) {
      openAuth(`Consultation with ${astrologer.display_name}`, 'login');
      return;
    }
    if (!selectedAstrologyProfile) {
      showToast('Please create or select an astrology birth profile first.', 'error');
      setIsProfileModalOpen(true);
      return;
    }

    setBookingLoading(true);
    try {
      const payload = {
        astrologer_id: astrologer.id,
        astrology_profile_id: selectedAstrologyProfile.id,
        consultation_type: consultationType,
        booking_date: selectedDate,
        start_time: selectedSlot,
        duration_minutes: 30
      };

      const res = await astrologyApi.createBooking(payload);
      if (res.success) {
        showToast('Consultation successfully booked! Joining room...', 'success');
        if (onBookingSuccess) {
          onBookingSuccess(res.consultation_id);
        }
      } else {
        showToast(res.message || 'Failed to book session.', 'error');
      }
    } catch (err) {
      console.error('Error booking session:', err);
      showToast('Network error while booking consultation.', 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center text-stone-100">
        <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (!astrologer) {
    return (
      <div className="min-h-screen bg-stone-950 py-16 text-center text-stone-100 space-y-4">
        <h2 className="text-xl font-bold">Astrologer profile not found</h2>
        <button onClick={onBack} className="text-amber-400 font-bold hover:underline">
          Return to Astrologers Directory
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold border border-stone-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Astrologers</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Astrologer Profile & Credentials (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Profile Overview Card */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <img
                  src={astrologer.profile_photo || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300'}
                  alt={astrologer.display_name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-amber-500/40 shadow-xl shrink-0"
                />
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-black text-white">{astrologer.display_name}</h1>
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" title="Verified Astrologer" />
                  </div>
                  <div className="text-sm text-amber-400 font-bold">{astrologer.years_of_experience}+ Years of Vedic Astrological Practice</div>
                  
                  <div className="flex items-center gap-3 text-xs text-stone-300">
                    <span className="flex items-center gap-1 font-bold text-amber-300">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {astrologer.rating || 4.9} ({astrologer.review_count || 120} reviews)
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-500" />
                      {astrologer.city}, {astrologer.state || 'India'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-stone-400">
                    <Languages className="w-3.5 h-3.5 text-stone-500" />
                    <span>Languages: {Array.isArray(astrologer.languages) ? astrologer.languages.join(', ') : 'Hindi, English'}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2 pt-4 border-t border-stone-800">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">About the Astrologer</h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-line">
                  {astrologer.bio}
                </p>
              </div>

              {/* Specializations & Methods */}
              <div className="space-y-3 pt-4 border-t border-stone-800">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Areas of Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(astrologer.specializations) && astrologer.specializations.map((spec, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-stone-800 text-xs font-semibold text-stone-200 border border-stone-700">
                      ✦ {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education & Credentials */}
              {astrologer.education && (
                <div className="space-y-2 pt-4 border-t border-stone-800">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Education & Qualification</h3>
                  <p className="text-xs text-stone-300 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    {astrologer.education}
                  </p>
                </div>
              )}
            </div>

            {/* Client Reviews */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                Verified Client Reviews ({astrologer.reviews?.length || 0})
              </h3>

              <div className="space-y-3">
                {astrologer.reviews && astrologer.reviews.length > 0 ? (
                  astrologer.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-850 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-white">{rev.user?.name || 'Verified Client'}</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating || 5 }).map((_, idx) => (
                            <Star key={idx} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed">{rev.review_text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-400">No public reviews yet for this astrologer.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Widget & Slot Picker (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-stone-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 sticky top-8">
              
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                  Direct Appointment
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">
                  Book Vedic Consultation
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Consultation will be conducted for <span className="font-bold text-amber-300">{selectedAstrologyProfile?.name || 'Selected Person'}</span>.
                </p>
              </div>

              {/* 1. Select Consultation Type */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  1. Consultation Mode
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setConsultationType('CHAT')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      consultationType === 'CHAT'
                        ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Live Chat
                    </div>
                    <div className="text-[11px] opacity-80">₹{astrologer.chat_price || 20}/min</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultationType('AUDIO_CALL')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      consultationType === 'AUDIO_CALL'
                        ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                      <Phone className="w-3.5 h-3.5" />
                      Audio Call
                    </div>
                    <div className="text-[11px] opacity-80">₹{astrologer.call_price || 30}/min</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultationType('VIDEO_CALL')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      consultationType === 'VIDEO_CALL'
                        ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                      <Video className="w-3.5 h-3.5" />
                      Video Call
                    </div>
                    <div className="text-[11px] opacity-80">₹{astrologer.video_price || 45}/min</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultationType('REPORT')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      consultationType === 'REPORT'
                        ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                      <FileText className="w-3.5 h-3.5" />
                      PDF Report
                    </div>
                    <div className="text-[11px] opacity-80">₹{astrologer.report_price || 499}</div>
                  </button>
                </div>
              </div>

              {/* 2. Select Date */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  2. Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-sm focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>

              {/* 3. Select Time Slot */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  3. Select Available Slot
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
                        selectedSlot === slot
                          ? 'bg-amber-500 text-stone-950 font-bold shadow'
                          : 'bg-stone-950 text-stone-300 border border-stone-800 hover:bg-stone-850'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total & Submit Action */}
              <div className="pt-4 border-t border-stone-800 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400">Selected Profile:</span>
                  <span className="font-bold text-white">{selectedAstrologyProfile?.name || 'Self'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400">Duration / Slot:</span>
                  <span className="font-bold text-white">30 Minutes ({selectedSlot})</span>
                </div>

                <button
                  onClick={handleBookSession}
                  disabled={bookingLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50"
                >
                  {bookingLoading ? 'Reserving Slot...' : 'Confirm & Start Consultation'}
                </button>
              </div>
            </div>
          </div>
        </div>

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
