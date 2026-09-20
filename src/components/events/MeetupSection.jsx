import React, { useState, useEffect } from 'react';
import { eventApi } from '../../api/eventApi';

export default function MeetupSection({ eventId, currentUser, onNotify }) {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    origin_location: '',
    origin_lat: '',
    origin_lng: '',
    transport_mode: 'CARPOOL',
    vehicle_info: '',
    total_capacity: 4,
    departure_time: '',
    meeting_landmark: '',
    cost_sharing_type: 'FREE',
    estimated_cost_per_person: 0,
    chat_group_url: '',
    organizer_contact_number: ''
  });

  // Join modal state
  const [activeJoinMeetup, setActiveJoinMeetup] = useState(null);
  const [joinData, setJoinData] = useState({
    seats_requested: 1,
    notes: '',
    pickup_point: ''
  });

  const loadMeetups = async () => {
    try {
      setLoading(true);
      const res = await eventApi.getEventMeetups(eventId);
      if (res.success) {
        setMeetups(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load meetups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      loadMeetups();
    }
  }, [eventId]);

  const handleCreateMeetup = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      onNotify?.('Please login to create a meetup / carpool group', 'warning');
      return;
    }
    if (!formData.title || !formData.origin_location || !formData.departure_time) {
      onNotify?.('Please fill required fields (Title, Origin, Departure Time)', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await eventApi.createMeetup(eventId, formData);
      if (res.success) {
        onNotify?.('Meetup / Carpool group created successfully!', 'success');
        setShowCreateModal(false);
        setFormData({
          title: '',
          description: '',
          origin_location: '',
          origin_lat: '',
          origin_lng: '',
          transport_mode: 'CARPOOL',
          vehicle_info: '',
          total_capacity: 4,
          departure_time: '',
          meeting_landmark: '',
          cost_sharing_type: 'FREE',
          estimated_cost_per_person: 0,
          chat_group_url: '',
          organizer_contact_number: ''
        });
        loadMeetups();
      }
    } catch (err) {
      onNotify?.(err.response?.data?.message || 'Failed to create meetup group', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinMeetup = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      onNotify?.('Please login to join this meetup group', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await eventApi.joinMeetup(eventId, activeJoinMeetup.id, joinData);
      if (res.success) {
        onNotify?.('Joined meetup group successfully!', 'success');
        setActiveJoinMeetup(null);
        setJoinData({ seats_requested: 1, notes: '', pickup_point: '' });
        loadMeetups();
      }
    } catch (err) {
      onNotify?.(err.response?.data?.message || 'Failed to join meetup', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeaveMeetup = async (meetupId) => {
    if (!window.confirm('Are you sure you want to leave this meetup group?')) return;
    try {
      const res = await eventApi.leaveMeetup(eventId, meetupId);
      if (res.success) {
        onNotify?.('Left meetup group', 'info');
        loadMeetups();
      }
    } catch (err) {
      onNotify?.(err.response?.data?.message || 'Failed to leave meetup', 'error');
    }
  };

  const getTransportIcon = (mode) => {
    switch (mode) {
      case 'CARPOOL': return '🚗 Carpool';
      case 'BUS_GROUP': return '🚌 Bus Group';
      case 'TRAIN_GROUP': return '🚆 Train Journey';
      case 'BIKE_RIDE': return '🏍️ Bike Convoy';
      case 'WALKING_GROUP': return '🚶 Yatra Padyatra';
      default: return '🚗 Travel Group';
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/60">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>🚗</span> Travel Together & Meetups
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Connect with fellow devotees travelling from your area. Carpool, hire a bus together, or travel in groups safely.
          </p>
        </div>

        <button
          onClick={() => {
            if (!currentUser) {
              onNotify?.('Please login to organize a travel group', 'warning');
              return;
            }
            setShowCreateModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>➕</span> Create Travel / Carpool Group
        </button>
      </div>

      {/* Meetups List */}
      <div className="mt-6">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            <span className="animate-spin inline-block mr-2">⏳</span> Loading connected meetup groups...
          </div>
        ) : meetups.length === 0 ? (
          <div className="py-10 text-center bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
            <div className="text-3xl mb-2">🚗 🚌 🚶</div>
            <p className="text-slate-300 font-medium text-sm">No travel groups created for this event yet.</p>
            <p className="text-slate-500 text-xs mt-1">
              Be the first devotee to create a carpool, bus, or travel group from your city/locality!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meetups.map((m) => {
              const isCreator = currentUser && m.created_by === currentUser.id;
              const myMembership = m.participants?.find((p) => p.user_id === currentUser?.id);
              const isJoined = !!myMembership;
              const availableSeats = Math.max(0, m.total_capacity - (m.current_members_count || 1));

              return (
                <div
                  key={m.id}
                  className="bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                        {getTransportIcon(m.transport_mode)}
                      </span>
                      <span className="text-xs text-slate-400">
                        {availableSeats > 0 ? (
                          <span className="text-emerald-400 font-semibold">{availableSeats} seats left</span>
                        ) : (
                          <span className="text-rose-400 font-semibold">Group Full</span>
                        )}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-200 mb-1">{m.title}</h4>
                    {m.description && (
                      <p className="text-xs text-slate-400 mb-3 line-clamp-2">{m.description}</p>
                    )}

                    <div className="space-y-1.5 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">📍 Origin:</span>
                        <span className="font-medium text-slate-200">{m.origin_location}</span>
                      </div>
                      {m.meeting_landmark && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">🚩 Landmark:</span>
                          <span>{m.meeting_landmark}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">⏰ Departure:</span>
                        <span className="text-amber-400 font-medium">
                          {new Date(m.departure_time).toLocaleString('en-IN', {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>
                      {m.vehicle_info && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">🚘 Vehicle:</span>
                          <span>{m.vehicle_info}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">💰 Cost:</span>
                        <span>
                          {m.cost_sharing_type === 'FREE'
                            ? 'Free / Seva'
                            : `₹${m.estimated_cost_per_person} per head (Split Cost)`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>Lead: <strong>{m.creator?.name || 'Devotee'}</strong></span>
                      {m.organizer_contact_number && (
                        <span className="text-emerald-400">📞 {m.organizer_contact_number}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isJoined ? (
                        <button
                          onClick={() => handleLeaveMeetup(m.id)}
                          className="px-2.5 py-1 text-xs rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-colors"
                        >
                          Leave
                        </button>
                      ) : availableSeats > 0 ? (
                        <button
                          onClick={() => setActiveJoinMeetup(m)}
                          className="px-3 py-1 text-xs rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 font-medium transition-colors"
                        >
                          Join Group
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500">Full</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Create Meetup Group */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-950">
              <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                <span>🚗</span> Create Travel / Carpool Group
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-200 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMeetup} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Group Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dadar to Shirdi Morning Carpool (4 Seats)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Transport Mode</label>
                  <select
                    value={formData.transport_mode}
                    onChange={(e) => setFormData({ ...formData, transport_mode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="CARPOOL">🚗 Carpool (Car)</option>
                    <option value="BUS_GROUP">🚌 Bus / Tempo Traveller</option>
                    <option value="TRAIN_GROUP">🚆 Train Travel Group</option>
                    <option value="BIKE_RIDE">🏍️ Bike Ride Convoy</option>
                    <option value="WALKING_GROUP">🚶 Padyatra Walking Group</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Capacity (Seats) *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.total_capacity}
                    onChange={(e) => setFormData({ ...formData, total_capacity: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Origin / Pickup City & Area *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Borivali West, Mumbai"
                  value={formData.origin_location}
                  onChange={(e) => setFormData({ ...formData, origin_location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Departure Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.departure_time}
                    onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Landmark</label>
                  <input
                    type="text"
                    placeholder="e.g. Near Borivali National Park Gate"
                    value={formData.meeting_landmark}
                    onChange={(e) => setFormData({ ...formData, meeting_landmark: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cost Sharing</label>
                  <select
                    value={formData.cost_sharing_type}
                    onChange={(e) => setFormData({ ...formData, cost_sharing_type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="FREE">Free (Seva)</option>
                    <option value="SPLIT_FUEL">Split Fuel / Tolls</option>
                    <option value="FIXED_PER_HEAD">Fixed Amount per person</option>
                  </select>
                </div>

                {formData.cost_sharing_type !== 'FREE' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Est. Cost (₹ / person)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.estimated_cost_per_person}
                      onChange={(e) => setFormData({ ...formData, estimated_cost_per_person: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle Model / Info</label>
                  <input
                    type="text"
                    placeholder="e.g. Ertiga White / AC Bus"
                    value={formData.vehicle_info}
                    onChange={(e) => setFormData({ ...formData, vehicle_info: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact / WhatsApp No.</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={formData.organizer_contact_number}
                    onChange={(e) => setFormData({ ...formData, organizer_contact_number: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Luggage instructions, food stops, meeting coordination details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Join Meetup Group */}
      {activeJoinMeetup && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-950">
              <h3 className="text-base font-bold text-amber-400">Join Travel Group: {activeJoinMeetup.title}</h3>
              <button
                onClick={() => setActiveJoinMeetup(null)}
                className="text-slate-400 hover:text-slate-200 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleJoinMeetup} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Seats Required</label>
                <input
                  type="number"
                  min="1"
                  max={Math.max(1, activeJoinMeetup.total_capacity - (activeJoinMeetup.current_members_count || 1))}
                  value={joinData.seats_requested}
                  onChange={(e) => setJoinData({ ...joinData, seats_requested: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Pickup Point (on route)</label>
                <input
                  type="text"
                  placeholder="e.g. Andheri Flyover / Highway Junction"
                  value={joinData.pickup_point}
                  onChange={(e) => setJoinData({ ...joinData, pickup_point: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Message for Group Organizer</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Travelling light, will reach pickup 10 mins early"
                  value={joinData.notes}
                  onChange={(e) => setJoinData({ ...joinData, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveJoinMeetup(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50"
                >
                  {submitting ? 'Joining...' : 'Confirm Join'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
