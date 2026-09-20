import React, { useState, useEffect } from 'react';
import { eventApi } from '../../api/eventApi';
import MeetupSection from './MeetupSection';

export default function EventDetailsPage({ slug, onBack, currentUser, onNotify, onNavigateOrganizer }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals & States
  const [showRaiseHandModal, setShowRaiseHandModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Raise hand form
  const [raiseHandData, setRaiseHandData] = useState({
    guests_count: 0,
    emergency_contact: '',
    dietary_preference: 'SATVIK',
    special_notes: '',
    needs_transport: false
  });

  // Report form
  const [reportData, setReportData] = useState({
    reason: 'INAPPROPRIATE_CONTENT',
    details: ''
  });

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await eventApi.getEventBySlug(slug);
      if (res.success) {
        setEvent(res.data);
      } else {
        setError(res.message || 'Event not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      loadEvent();
    }
  }, [slug]);

  const handleRaiseHandSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      onNotify?.('Please login to raise your hand and register for this event', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await eventApi.raiseHand(event.id, raiseHandData);
      if (res.success) {
        const isWaitlisted = res.data?.status === 'WAITLISTED';
        onNotify?.(
          isWaitlisted
            ? 'Event is currently full. You have been placed on the priority waitlist!'
            : '✨ Hand Raised! Your registration is confirmed!',
          'success'
        );
        setShowRaiseHandModal(false);
        loadEvent();
      }
    } catch (err) {
      onNotify?.(err.response?.data?.message || 'Failed to register participation', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelParticipation = async () => {
    if (!window.confirm('Are you sure you want to cancel your attendance? If waitlisted users exist, seats will be automatically offered to them.')) {
      return;
    }

    try {
      setSubmitting(true);
      const res = await eventApi.cancelParticipation(event.id);
      if (res.success) {
        onNotify?.('Participation cancelled successfully', 'info');
        loadEvent();
      }
    } catch (err) {
      onNotify?.(err.response?.data?.message || 'Failed to cancel participation', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      onNotify?.('Please login to bookmark events', 'warning');
      return;
    }
    try {
      const res = await eventApi.toggleFavorite(event.id);
      if (res.success) {
        onNotify?.(res.message, 'success');
        setEvent((prev) => ({ ...prev, is_favorite: res.favorited }));
      }
    } catch (err) {
      onNotify?.('Failed to update favorite', 'error');
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      onNotify?.('Please login to report an issue', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await eventApi.reportEvent(event.id, reportData);
      if (res.success) {
        onNotify?.('Thank you. Your report has been submitted to admin moderators.', 'success');
        setShowReportModal(false);
        setReportData({ reason: 'INAPPROPRIATE_CONTENT', details: '' });
      }
    } catch (err) {
      onNotify?.(err.response?.data?.message || 'Failed to submit report', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const copyEventLink = () => {
    navigator.clipboard.writeText(window.location.href);
    onNotify?.('Event link copied to clipboard! Share with your spiritual community.', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading spiritual event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🪔</div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Event Not Found</h2>
        <p className="text-slate-400 mb-6">{error || 'This event may have been cancelled or removed.'}</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-all"
        >
          ← Back to Events Discovery
        </button>
      </div>
    );
  }

  const category = event.category || {};
  const location = event.location || {};
  const userParticipation = event.user_participation;
  const isOrganizer = currentUser && event.organizer_id === currentUser.id;
  const isFull = event.max_capacity && (event.current_confirmed_count || 0) >= event.max_capacity;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors bg-slate-900/60 px-3.5 py-2 rounded-xl border border-slate-800"
        >
          <span>←</span> Back to All Events
        </button>

        <div className="flex items-center gap-2">
          {isOrganizer && (
            <button
              onClick={() => onNavigateOrganizer && onNavigateOrganizer(event.id)}
              className="px-3.5 py-1.5 bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span>⚙️</span> Manage as Organizer
            </button>
          )}

          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-xl border transition-colors ${
              event.is_favorite
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-rose-400'
            }`}
            title="Bookmark Event"
          >
            {event.is_favorite ? '❤️' : '🤍'}
          </button>

          <button
            onClick={copyEventLink}
            className="p-2 rounded-xl bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-amber-400 transition-colors"
            title="Share Link"
          >
            🔗
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="p-2 rounded-xl bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-amber-500 transition-colors"
            title="Report Event"
          >
            🚩
          </button>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
        <div className="relative h-72 sm:h-96 w-full">
          <img
            src={event.cover_image || 'https://images.unsplash.com/photo-1545232979-fbf67839352e?q=80&w=1200&auto=format&fit=crop'}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1545232979-fbf67839352e?q=80&w=1200&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            {/* Category & Status */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500/20 backdrop-blur-md text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/40 font-semibold flex items-center gap-1.5">
                <span>{category.icon || '🕉️'}</span>
                <span>{category.name || 'Spiritual Event'}</span>
              </span>

              {event.is_featured && (
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs px-2.5 py-1 rounded-full font-extrabold shadow">
                  ⭐ Featured
                </span>
              )}

              {event.status === 'PUBLISHED' && (
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-500/40 font-medium">
                  Active
                </span>
              )}
              {event.status === 'ONGOING' && (
                <span className="bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/40 font-medium animate-pulse">
                  Live Happening Now
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
              {event.title}
            </h1>

            {/* Quick Meta */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-amber-400">🗓️</span>
                <span>{formatDate(event.start_date)} {event.start_time ? `at ${event.start_time}` : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400">📍</span>
                <span>
                  {location.venue_name ? `${location.venue_name}, ` : ''}{location.city || 'Online'}
                  {location.state ? `, ${location.state}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400">💰</span>
                <span className="font-bold text-amber-300">
                  {event.pricing_type === 'FREE' ? 'Free Admission' : `₹${event.ticket_price} per person`}
                </span>
              </div>
            </div>
          </div>

          {/* Raise Hand / Action Box */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-2xl sm:min-w-[280px] shadow-2xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
                <span>Total Confirmed</span>
                <span className="text-slate-200 font-bold">
                  {event.current_confirmed_count || 0} {event.max_capacity ? `/ ${event.max_capacity}` : 'Devotees'}
                </span>
              </div>

              {event.max_capacity && (
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isFull ? 'bg-amber-500' : 'bg-gradient-to-r from-amber-500 to-emerald-400'
                    }`}
                    style={{
                      width: `${Math.min(100, ((event.current_confirmed_count || 0) / event.max_capacity) * 100)}%`
                    }}
                  />
                </div>
              )}

              {isFull && (
                <div className="text-[11px] text-amber-400/90 font-medium">
                  ⚠️ Max capacity reached. Raising hand now places you on the auto-promoting waitlist.
                </div>
              )}
            </div>

            {/* Participation Buttons */}
            {userParticipation ? (
              <div className="space-y-2">
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center">
                  <div className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                    <span>{userParticipation.status === 'CONFIRMED' ? '✅ You are Attending' : '⏳ On Waitlist'}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Total Seats: <strong>{1 + (userParticipation.guests_count || 0)}</strong>
                  </div>
                </div>

                <button
                  onClick={handleCancelParticipation}
                  disabled={submitting}
                  className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold rounded-xl transition-all disabled:opacity-50"
                >
                  Cancel Attendance
                </button>
              </div>
            ) : event.status === 'PUBLISHED' ? (
              <button
                onClick={() => {
                  if (!currentUser) {
                    onNotify?.('Please login to raise hand', 'warning');
                    return;
                  }
                  setShowRaiseHandModal(true);
                }}
                className={`w-full py-3.5 rounded-xl font-extrabold text-sm shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                  isFull
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-slate-950'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950'
                }`}
              >
                <span>{isFull ? '⏳ Join Waitlist' : '🙋 Raise Hand / Attend'}</span>
              </button>
            ) : (
              <div className="py-2 text-center text-xs text-slate-400 bg-slate-950/60 rounded-xl border border-slate-800">
                Registrations Closed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Details, Schedule, Logistics), Right Column (Announcements, Organizer, FAQ) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: Overview & Description */}
          <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-4">
              <span>🪔</span> About the Spiritual Event
            </h2>

            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Deity / Tradition</span>
                <span className="text-sm font-semibold text-amber-300">{event.deity_or_tradition || 'Sanatan Dharma'}</span>
              </div>
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Language</span>
                <span className="text-sm font-semibold text-slate-200">{event.language || 'Hindi / Sanskrit'}</span>
              </div>
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Entry Type</span>
                <span className="text-sm font-semibold text-emerald-400">
                  {event.registration_type === 'OPEN' ? 'Open for All' : 'RSVP Required'}
                </span>
              </div>
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Dress Code</span>
                <span className="text-sm font-semibold text-slate-200">{event.dress_code || 'Traditional / Modest'}</span>
              </div>
            </div>
          </div>

          {/* Section: Yatra & Venue Logistics */}
          <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-4">
              <span>📍</span> Venue & Logistics Details
            </h2>

            {location.is_yatra && (
              <div className="p-4 bg-gradient-to-r from-amber-950/40 to-orange-950/30 border border-amber-500/40 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <span>🚩</span> Yatra Pilgrimage Assembly Point
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div><strong>Assembly Location:</strong> {location.meeting_point_name || 'Designated Gate'}</div>
                  {location.meeting_point_address && <div><strong>Address:</strong> {location.meeting_point_address}</div>}
                  {location.yatra_route_description && <div><strong>Route:</strong> {location.yatra_route_description}</div>}
                </div>
              </div>
            )}

            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <span className="text-lg">🏛️</span>
                <div>
                  <div className="font-bold text-slate-100">{location.venue_name || 'Main Ashram / Mandir'}</div>
                  <div className="text-xs text-slate-400">{location.address_line1} {location.address_line2}</div>
                  <div className="text-xs text-slate-400">
                    {location.city}, {location.state} - {location.pincode}
                  </div>
                </div>
              </div>

              {location.landmark && (
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="text-sm">🚩 Landmark:</span>
                  <span>{location.landmark}</span>
                </div>
              )}

              {location.parking_available && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <span>🅿️ Dedicated Vehicle Parking Available</span>
                </div>
              )}

              {location.google_maps_url && (
                <div className="pt-2">
                  <a
                    href={location.google_maps_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <span>🗺️</span> Open Location in Google Maps ↗
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Section: Connected Travel & Meetups */}
          <MeetupSection
            eventId={event.id}
            currentUser={currentUser}
            onNotify={onNotify}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Organizer Card */}
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Organized By</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-lg font-bold text-amber-300 overflow-hidden">
                {event.organizer?.avatar ? (
                  <img src={event.organizer.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  event.organizer?.name?.charAt(0) || 'O'
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-100 text-base">{event.organizer?.name || 'Spiritual Organization'}</h4>
                <p className="text-xs text-slate-400">{event.organizer?.email || 'Verified Organizer'}</p>
              </div>
            </div>

            {event.contact_phone && (
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-400">Helpline / Inquiry:</span>
                <a href={`tel:${event.contact_phone}`} className="text-amber-400 font-bold hover:underline">
                  {event.contact_phone}
                </a>
              </div>
            )}
          </div>

          {/* Live Announcements */}
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span>📢</span> Organizer Announcements
            </h3>

            {event.announcements?.length > 0 ? (
              <div className="space-y-3">
                {event.announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                      ann.priority === 'HIGH' || ann.priority === 'URGENT'
                        ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{ann.title}</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {new Date(ann.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-slate-300 whitespace-pre-line">{ann.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                No recent announcements posted yet.
              </div>
            )}
          </div>

          {/* Prasad & Seva Guidelines */}
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-3 text-xs text-slate-300">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <span>🥣</span> Prasad & Seva Information
            </h3>
            <p>
              Mahaprasad / Satvik Bhog will be distributed to all attending devotees following the concluding Aarti.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
              <div className="font-semibold text-amber-300">Guidelines for Devotees:</div>
              <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                <li>Please arrive 15 minutes prior to scheduled start time.</li>
                <li>Traditional Indian spiritual attire is recommended.</li>
                <li>Maintain silence and sanctity during chanting & Pooja.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Raise Hand / Participation */}
      {showRaiseHandModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-950">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <span>🙋</span> Raise Hand & Join Event
              </h3>
              <button
                onClick={() => setShowRaiseHandModal(false)}
                className="text-slate-400 hover:text-slate-200 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRaiseHandSubmit} className="p-6 space-y-4">
              <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-200">
                {isFull
                  ? 'Capacity is full. Submitting will register you on the Priority Waitlist. If anyone cancels, you will be auto-confirmed!'
                  : 'Raising your hand reserves your seat and helps organizers prepare Prasad and logistics arrangements.'}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Accompanying Family / Guests Count
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={raiseHandData.guests_count}
                  onChange={(e) =>
                    setRaiseHandData({ ...raiseHandData, guests_count: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
                <span className="text-[11px] text-slate-400">Total attending: {1 + raiseHandData.guests_count} people</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Emergency Contact / Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 9876543210"
                  value={raiseHandData.emergency_contact}
                  onChange={(e) => setRaiseHandData({ ...raiseHandData, emergency_contact: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Dietary / Prasad Preference</label>
                <select
                  value={raiseHandData.dietary_preference}
                  onChange={(e) => setRaiseHandData({ ...raiseHandData, dietary_preference: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="SATVIK">Satvik Prasad (No Onion / Garlic)</option>
                  <option value="FASTING">Upvas / Vrat Fasting Food (Farali)</option>
                  <option value="GENERAL">General Vegetarian</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="needs_transport"
                  checked={raiseHandData.needs_transport}
                  onChange={(e) => setRaiseHandData({ ...raiseHandData, needs_transport: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
                />
                <label htmlFor="needs_transport" className="text-xs text-slate-300 cursor-pointer">
                  Interested in Travel Group / Carpooling
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Note for Organizer (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Any senior citizens, wheelchair requirements, or special Seva offering..."
                  value={raiseHandData.special_notes}
                  onChange={(e) => setRaiseHandData({ ...raiseHandData, special_notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRaiseHandModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Confirm Raise Hand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Report Event */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-950">
              <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                <span>🚩</span> Report Event to Moderators
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-200 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Report</label>
                <select
                  value={reportData.reason}
                  onChange={(e) => setReportData({ ...reportData, reason: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                >
                  <option value="INAPPROPRIATE_CONTENT">Inappropriate or Non-Spiritual Content</option>
                  <option value="SPAM_OR_FRAUD">Spam / Fraud / Commercial Scam</option>
                  <option value="MISLEADING_INFO">Misleading Information or Fake Location</option>
                  <option value="OFFENSIVE_LANGUAGE">Hate Speech or Offensive Details</option>
                  <option value="OTHER">Other Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Details & Evidence</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe why this event should be reviewed by administrators..."
                  value={reportData.details}
                  onChange={(e) => setReportData({ ...reportData, details: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
