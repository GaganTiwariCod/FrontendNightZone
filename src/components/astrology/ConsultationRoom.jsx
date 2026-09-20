import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { astrologyApi } from '../../api/astrologyApi';
import { 
  ChevronLeft, 
  Send, 
  Sparkles, 
  User, 
  Phone, 
  Video, 
  CheckCircle2, 
  Star, 
  Flame, 
  ShieldCheck, 
  Clock, 
  FileText,
  AlertCircle
} from 'lucide-react';

export default function ConsultationRoom({ consultationId, onBack, onOpenPanditBooking }) {
  const { user, showToast } = useAuth();

  const [consultation, setConsultation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Astrologer completion state
  const [isAstrologerDrawerOpen, setIsAstrologerDrawerOpen] = useState(false);
  const [sessionSummary, setSessionSummary] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [remedyTitle, setRemedyTitle] = useState('Navgraha Shanti Puja');
  const [remedyDesc, setRemedyDesc] = useState('Perform Navgraha Shanti puja on Thursday for planetary harmony.');

  // Review state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const messagesEndRef = useRef(null);

  const fetchSession = async () => {
    try {
      const res = await astrologyApi.getConsultationDetails(consultationId);
      if (res.success) {
        setConsultation(res.consultation);
        setMessages(res.consultation.messages || []);
      }
    } catch (err) {
      console.error('Error fetching consultation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (consultationId) {
      fetchSession();
      const interval = setInterval(fetchSession, 5000); // Polling for new messages
      return () => clearInterval(interval);
    }
  }, [consultationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const res = await astrologyApi.sendConsultationMessage(consultationId, {
        message: text
      });
      if (res.success && res.message) {
        setMessages((prev) => [...prev, res.message]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      showToast('Failed to send message.', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleCompleteSession = async () => {
    try {
      const payload = {
        summary: sessionSummary,
        astrologer_notes: sessionNotes,
        recommendations: remedyTitle ? [
          {
            service_type: 'PUJA',
            title: remedyTitle,
            description: remedyDesc,
            optional_action_url: '/services/pandit'
          }
        ] : []
      };

      const res = await astrologyApi.completeConsultation(consultationId, payload);
      if (res.success) {
        showToast('Consultation completed and remedies recorded!', 'success');
        setIsAstrologerDrawerOpen(false);
        fetchSession();
      }
    } catch (err) {
      console.error('Error completing session:', err);
      showToast('Error completing session.', 'error');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      const res = await astrologyApi.submitReview({
        consultation_id: consultationId,
        rating,
        review_text: reviewText
      });
      if (res.success) {
        showToast('Thank you! Review published.', 'success');
        setIsReviewModalOpen(false);
        fetchSession();
      } else {
        showToast(res.message || 'Failed to submit review.', 'error');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      showToast('Error submitting review.', 'error');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center text-stone-100">
        <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="min-h-screen bg-stone-950 py-16 text-center text-stone-100 space-y-4">
        <h2 className="text-xl font-bold">Consultation session not found</h2>
        <button onClick={onBack} className="text-amber-400 font-bold hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isClient = consultation.user_id === user?.id;
  const isAstrologer = consultation.astrologer?.user_id === user?.id;
  const profile = consultation.booking?.profile;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation & Status Header */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white">
                  Consultation with {consultation.astrologer?.display_name}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  consultation.status === 'ACTIVE'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse'
                    : consultation.status === 'COMPLETED'
                    ? 'bg-stone-800 text-stone-400'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {consultation.status}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Client: <span className="font-semibold text-amber-300">{profile?.name}</span> ({profile?.relationship || 'Self'}) • Mode: {consultation.booking?.consultation_type}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAstrologer && consultation.status !== 'COMPLETED' && (
              <button
                onClick={() => setIsAstrologerDrawerOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 font-bold text-xs uppercase"
              >
                Complete Session & Add Remedy
              </button>
            )}

            {isClient && consultation.status === 'COMPLETED' && (
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs uppercase shadow-md shadow-amber-500/20"
              >
                <Star className="w-4 h-4 fill-current" />
                Rate Astrologer
              </button>
            )}
          </div>
        </div>

        {/* Main Grid: Chat transcript & Details panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Chat Window (8 cols) */}
          <div className="lg:col-span-8 bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((m) => {
                const isMe = m.sender_id === user?.id;
                const isSystem = m.sender_role === 'SYSTEM';

                if (isSystem) {
                  return (
                    <div key={m.id} className="text-center my-2">
                      <span className="px-3 py-1 rounded-full bg-stone-950 text-[11px] text-stone-400 border border-stone-800 inline-block">
                        {m.message}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs shrink-0">
                        {m.sender?.name?.charAt(0) || 'A'}
                      </div>
                    )}
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-medium rounded-br-none shadow-md shadow-orange-500/10'
                          : 'bg-stone-850 text-stone-100 border border-stone-750 rounded-bl-none'
                      }`}
                    >
                      <div className="text-[10px] font-bold opacity-70 mb-1">
                        {isMe ? 'You' : m.sender?.name || 'Astrologer'}
                      </div>
                      <p className="whitespace-pre-wrap">{m.message}</p>
                      <div className="text-[9px] opacity-60 text-right mt-1">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-stone-950 border-t border-stone-800 flex items-center gap-2">
              <input
                type="text"
                placeholder={consultation.status === 'COMPLETED' ? 'Consultation completed' : 'Type your astrological query or reply...'}
                disabled={consultation.status === 'COMPLETED' || sending}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl bg-stone-900 border border-stone-700 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending || consultation.status === 'COMPLETED'}
                className="p-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold transition-all shadow-md disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Right: Birth Details & Spiritual Recommendations Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Birth Details Card */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                Active Birth Profile Details
              </div>

              <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-850 space-y-1.5 text-xs">
                <div className="font-bold text-white text-sm">{profile?.name}</div>
                <div className="text-stone-400">Relation: <span className="text-stone-200">{profile?.relationship || 'Self'}</span></div>
                <div className="text-stone-400">DOB: <span className="text-stone-200">{profile?.date_of_birth}</span></div>
                <div className="text-stone-400">Time: <span className="text-stone-200">{profile?.time_of_birth}</span></div>
                <div className="text-stone-400">Place: <span className="text-stone-200">{profile?.birth_place}</span></div>
              </div>
            </div>

            {/* Spiritual Recommendations / Remedies (if completed) */}
            {consultation.recommendations && consultation.recommendations.length > 0 && (
              <div className="bg-gradient-to-br from-amber-500/10 via-stone-900 to-stone-900 border border-amber-500/30 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Recommended Spiritual Remedies
                </div>

                {consultation.recommendations.map((rec) => (
                  <div key={rec.id} className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800 space-y-2 text-xs">
                    <div className="font-bold text-white text-sm">{rec.title}</div>
                    <p className="text-stone-300 leading-relaxed">{rec.description}</p>
                    <button
                      onClick={onOpenPanditBooking}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow"
                    >
                      Book Puja with Verified Pandit
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Astrologer Session Completion Drawer / Modal */}
        {isAstrologerDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white">Complete Consultation & Add Remedies</h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Session Summary & Predictions</label>
                  <textarea
                    rows="3"
                    value={sessionSummary}
                    onChange={(e) => setSessionSummary(e.target.value)}
                    placeholder="Enter summary of guidance provided..."
                    className="w-full p-3 rounded-xl bg-stone-800 border border-stone-700 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Recommended Remedy / Puja Title</label>
                  <input
                    type="text"
                    value={remedyTitle}
                    onChange={(e) => setRemedyTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Remedy Description & Pandit Instructions</label>
                  <textarea
                    rows="2"
                    value={remedyDesc}
                    onChange={(e) => setRemedyDesc(e.target.value)}
                    className="w-full p-3 rounded-xl bg-stone-800 border border-stone-700 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsAstrologerDrawerOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteSession}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 font-bold text-xs uppercase"
                >
                  Save & Complete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Client Review Modal */}
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <form onSubmit={handleSubmitReview} className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white">Rate Your Consultation</h3>
              
              <div>
                <label className="block text-xs text-stone-300 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`p-2 rounded-xl text-lg ${rating >= num ? 'text-amber-400' : 'text-stone-600'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Feedback / Review</label>
                <textarea
                  rows="3"
                  required
                  placeholder="How was your astrological guidance session?"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs uppercase"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
