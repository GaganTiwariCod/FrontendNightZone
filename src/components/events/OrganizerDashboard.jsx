import React, { useState, useEffect } from 'react';
import { eventApi } from '../../api/eventApi';

export default function OrganizerDashboard({ initialEventId, onBack, onNavigateCreate, onNotify, currentUser }) {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(initialEventId || null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participantsLoading, setParticipantsLoading] = useState(false);

  // Tabs inside active event
  const [activeTab, setActiveTab] = useState('participants'); // 'participants' | 'announcements' | 'settings'

  // Announcement form
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    message: '',
    priority: 'NORMAL'
  });
  const [postingAnnouncement, setPostingAnnouncement] = useState(false);

  // Participant search / filter
  const [participantSearch, setParticipantSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadMyEvents = async () => {
    try {
      setLoading(true);
      const res = await eventApi.getMyOrganizedEvents();
      if (res.success) {
        setEvents(res.data || []);
        if (res.data?.length > 0 && !selectedEventId) {
          setSelectedEventId(res.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load organized events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyEvents();
  }, []);

  const loadEventData = async (eventId) => {
    if (!eventId) return;
    try {
      setParticipantsLoading(true);
      const ev = events.find((e) => e.id === eventId);
      setSelectedEvent(ev || null);

      const [pRes, aRes] = await Promise.all([
        eventApi.getEventParticipants(eventId, {
          search: participantSearch,
          status: statusFilter
        }),
        eventApi.getAnnouncements(eventId)
      ]);

      if (pRes.success) {
        setParticipants(pRes.data || []);
      }
      if (aRes.success) {
        setAnnouncements(aRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load event participants or announcements:', err);
    } finally {
      setParticipantsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      loadEventData(selectedEventId);
    }
  }, [selectedEventId, statusFilter]);

  const handleCheckIn = async (participant) => {
    try {
      const res = await eventApi.checkInAttendance(selectedEventId, {
        user_id: participant.user_id,
        status: 'ATTENDED',
        notes: 'Checked in by organizer'
      });
      if (res.success) {
        onNotify?.(`Checked in ${participant.user?.name || 'devotee'}!`, 'success');
        loadEventData(selectedEventId);
      }
    } catch (err) {
      onNotify?.(err.response?.data?.message || 'Failed to check in participant', 'error');
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    if (!window.confirm('Are you sure you want to remove this participant? Seats will automatically be re-allocated to waitlist if available.')) {
      return;
    }
    try {
      const res = await eventApi.moderateParticipant(selectedEventId, participantId, {
        status: 'CANCELLED',
        admin_notes: 'Removed by organizer'
      });
      if (res.success) {
        onNotify?.('Participant removed successfully', 'info');
        loadEventData(selectedEventId);
      }
    } catch (err) {
      onNotify?.(err.response?.data?.message || 'Failed to remove participant', 'error');
    }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementForm.title || !announcementForm.message) {
      onNotify?.('Please provide title and message for announcement', 'warning');
      return;
    }

    try {
      setPostingAnnouncement(true);
      const res = await eventApi.createAnnouncement(selectedEventId, announcementForm);
      if (res.success) {
        onNotify?.('📢 Announcement broadcasted to attendees successfully!', 'success');
        setAnnouncementForm({ title: '', message: '', priority: 'NORMAL' });
        loadEventData(selectedEventId);
      }
    } catch (err) {
      onNotify?.(err.response?.data?.message || 'Failed to broadcast announcement', 'error');
    } finally {
      setPostingAnnouncement(false);
    }
  };

  const handleCancelEvent = async () => {
    const reason = window.prompt('Please enter the reason for cancelling this event:');
    if (!reason) return;

    try {
      const res = await eventApi.cancelEvent(selectedEventId, { cancellation_reason: reason });
      if (res.success) {
        onNotify?.('Event cancelled and attendees notified', 'info');
        loadMyEvents();
      }
    } catch (err) {
      onNotify?.('Failed to cancel event', 'error');
    }
  };

  const filteredParticipants = participants.filter((p) => {
    if (!participantSearch) return true;
    const q = participantSearch.toLowerCase();
    return (
      p.user?.name?.toLowerCase().includes(q) ||
      p.user?.email?.toLowerCase().includes(q) ||
      p.emergency_contact?.includes(q)
    );
  });

  const totalAttendees = participants.filter((p) => p.status === 'CONFIRMED').length;
  const totalWaitlisted = participants.filter((p) => p.status === 'WAITLISTED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-400 hover:text-amber-400 mb-2 inline-flex items-center gap-1.5"
          >
            <span>←</span> Back to Public Events
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>⚙️</span> Organizer Event Management Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage attendance, broadcast announcements, and coordinate devotee logistics.
          </p>
        </div>

        <button
          onClick={onNavigateCreate}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span>➕</span> Host New Event
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          <span className="animate-spin inline-block mr-2">⏳</span> Loading your organized events...
        </div>
      ) : events.length === 0 ? (
        <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="text-5xl">🪔</div>
          <h3 className="text-xl font-bold text-slate-200">You haven't hosted any spiritual events yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Host a pooja, katha, yatra, satsang, or bhajan sandhya for your community and manage devotee participation seamlessly.
          </p>
          <button
            onClick={onNavigateCreate}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow transition-all"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Events Selector List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Your Hosted Events</h3>
            <div className="space-y-2">
              {events.map((ev) => {
                const isSelected = ev.id === selectedEventId;
                return (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedEventId(ev.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>{ev.category?.name || 'Spiritual'}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold ${
                          ev.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {ev.status}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-200 line-clamp-1">{ev.title}</div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                      <span>🗓️ {ev.start_date}</span>
                      <span>•</span>
                      <span>👥 {ev.current_confirmed_count || 0} seats</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 3 Columns: Selected Event Management Portal */}
          <div className="lg:col-span-3 space-y-6">
            {selectedEvent && (
              <>
                {/* Event Overview & Quick Stats Banner */}
                <div className="bg-slate-900/80 border border-slate-700/60 rounded-3xl p-6 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-xs text-amber-400 font-bold block mb-1">
                        {selectedEvent.category?.name} • {selectedEvent.location?.city}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-100">{selectedEvent.title}</h2>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedEvent.status !== 'CANCELLED' && (
                        <button
                          onClick={handleCancelEvent}
                          className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold rounded-xl transition-all"
                        >
                          Cancel Event
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 3 Metric Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center">
                      <span className="text-xs text-slate-400 block mb-1">Confirmed Devotees</span>
                      <span className="text-2xl font-black text-emerald-400">{totalAttendees}</span>
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center">
                      <span className="text-xs text-slate-400 block mb-1">Waitlisted</span>
                      <span className="text-2xl font-black text-amber-400">{totalWaitlisted}</span>
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center">
                      <span className="text-xs text-slate-400 block mb-1">Max Capacity</span>
                      <span className="text-2xl font-black text-slate-200">
                        {selectedEvent.max_capacity || '∞'}
                      </span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-2 border-b border-slate-800 pt-2">
                    <button
                      onClick={() => setActiveTab('participants')}
                      className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                        activeTab === 'participants'
                          ? 'border-amber-500 text-amber-400'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      👥 Devotee Attendees ({participants.length})
                    </button>

                    <button
                      onClick={() => setActiveTab('announcements')}
                      className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                        activeTab === 'announcements'
                          ? 'border-amber-500 text-amber-400'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      📢 Broadcast Announcements ({announcements.length})
                    </button>
                  </div>
                </div>

                {/* Tab 1: Participants List & Check-in */}
                {activeTab === 'participants' && (
                  <div className="bg-slate-900/80 border border-slate-700/60 rounded-3xl p-6 shadow-xl space-y-4">
                    {/* Search & Filter Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <input
                        type="text"
                        placeholder="Search devotee by name, email, or mobile..."
                        value={participantSearch}
                        onChange={(e) => setParticipantSearch(e.target.value)}
                        className="w-full sm:w-80 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100"
                      />

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                        >
                          <option value="">All Statuses</option>
                          <option value="CONFIRMED">Confirmed Only</option>
                          <option value="WAITLISTED">Waitlisted Only</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Table */}
                    {participantsLoading ? (
                      <div className="py-12 text-center text-slate-400 text-xs">
                        <span className="animate-spin inline-block mr-2">⏳</span> Loading attendees...
                      </div>
                    ) : filteredParticipants.length === 0 ? (
                      <div className="py-10 text-center text-slate-400 text-xs bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                        No devotee registrations match your search criteria.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                            <tr>
                              <th className="py-3 px-4">Devotee</th>
                              <th className="py-3 px-4">Guests</th>
                              <th className="py-3 px-4">Prasad Diet</th>
                              <th className="py-3 px-4">Status</th>
                              <th className="py-3 px-4">Attendance</th>
                              <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {filteredParticipants.map((p) => (
                              <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                                <td className="py-3 px-4">
                                  <div className="font-bold text-slate-100">{p.user?.name || 'Devotee'}</div>
                                  <div className="text-[11px] text-slate-400">{p.user?.email || p.emergency_contact}</div>
                                </td>
                                <td className="py-3 px-4 font-semibold text-slate-200">
                                  +{p.guests_count || 0} ({1 + (p.guests_count || 0)} Total)
                                </td>
                                <td className="py-3 px-4">
                                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px]">
                                    {p.dietary_preference || 'Satvik'}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                      p.status === 'CONFIRMED'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                        : p.status === 'WAITLISTED'
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                    }`}
                                  >
                                    {p.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <button
                                    onClick={() => handleCheckIn(p)}
                                    className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-bold transition-colors"
                                  >
                                    ✓ Check-In
                                  </button>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  {p.status !== 'CANCELLED' && (
                                    <button
                                      onClick={() => handleRemoveParticipant(p.id)}
                                      className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-[10px] font-semibold transition-colors"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Broadcast Announcements */}
                {activeTab === 'announcements' && (
                  <div className="bg-slate-900/80 border border-slate-700/60 rounded-3xl p-6 shadow-xl space-y-6">
                    {/* Create Announcement Box */}
                    <form
                      onSubmit={handlePostAnnouncement}
                      className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4"
                    >
                      <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                        <span>📢</span> Broadcast New Live Announcement
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Announcement Headline *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Prasad distribution schedule updated / Parking gate changed"
                            value={announcementForm.title}
                            onChange={(e) =>
                              setAnnouncementForm({ ...announcementForm, title: e.target.value })
                            }
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Priority</label>
                          <select
                            value={announcementForm.priority}
                            onChange={(e) =>
                              setAnnouncementForm({ ...announcementForm, priority: e.target.value })
                            }
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                          >
                            <option value="NORMAL">Normal</option>
                            <option value="HIGH">High Priority</option>
                            <option value="URGENT">Urgent / Alert</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">Message Body *</label>
                        <textarea
                          rows={2}
                          required
                          placeholder="Type details for all devotees..."
                          value={announcementForm.message}
                          onChange={(e) =>
                            setAnnouncementForm({ ...announcementForm, message: e.target.value })
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={postingAnnouncement}
                          className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50"
                        >
                          {postingAnnouncement ? 'Broadcasting...' : 'Broadcast Announcement'}
                        </button>
                      </div>
                    </form>

                    {/* Announcements List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Past Broadcast History
                      </h4>
                      {announcements.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                          No announcements posted for this event yet.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {announcements.map((ann) => (
                            <div
                              key={ann.id}
                              className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs space-y-1.5"
                            >
                              <div className="flex items-center justify-between font-bold text-slate-200">
                                <span>{ann.title}</span>
                                <span className="text-[10px] text-slate-500 font-normal">
                                  {new Date(ann.created_at).toLocaleString('en-IN', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                  })}
                                </span>
                              </div>
                              <p className="text-slate-300">{ann.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
