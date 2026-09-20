import React, { useState, useEffect } from 'react';
import { eventApi } from '../../api/eventApi';

export default function EventCreationWizard({ onCancel, onSuccess, onNotify, currentUser }) {
  const [categories, setCategories] = useState([]);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: '',
    category_id: '',
    deity_or_tradition: '',
    language: 'Hindi',
    registration_type: 'OPEN',
    description: '',
    dress_code: 'Traditional / Modest Attire',

    // Step 2: Schedule
    start_date: '',
    start_time: '08:00',
    end_date: '',
    end_time: '12:00',
    registration_deadline: '',

    // Step 3: Venue & Location
    venue_name: '',
    address_line1: '',
    address_line2: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '',
    landmark: '',
    latitude: '',
    longitude: '',
    google_maps_url: '',
    parking_available: true,

    // Step 4: Yatra Logistics
    is_yatra: false,
    meeting_point_name: '',
    meeting_point_address: '',
    yatra_route_description: '',

    // Step 5: Capacity & Pricing
    has_capacity_limit: true,
    max_capacity: 50,
    auto_promote_waitlist: true,
    pricing_type: 'FREE',
    ticket_price: 0,
    contact_phone: '',
    contact_email: '',

    // Step 6: Cover Image
    cover_image: 'https://images.unsplash.com/photo-1545232979-fbf67839352e?q=80&w=1200&auto=format&fit=crop'
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await eventApi.getCategories();
        if (res.success && res.data) {
          setCategories(res.data);
          if (res.data.length > 0 && !formData.category_id) {
            setFormData((prev) => ({ ...prev, category_id: res.data[0].id }));
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const data = new FormData();
      data.append('cover_image', file);
      const res = await eventApi.uploadCoverImage(data);
      if (res.success) {
        setFormData((prev) => ({ ...prev, cover_image: res.url }));
        onNotify?.('Cover image uploaded successfully!', 'success');
      }
    } catch (err) {
      onNotify?.('Failed to upload image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFetchCurrentCoords = () => {
    if (!navigator.geolocation) {
      onNotify?.('Geolocation is not supported by your browser', 'error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6)
        }));
        onNotify?.('Current GPS Coordinates captured!', 'success');
      },
      () => {
        onNotify?.('Failed to fetch GPS coordinates. Please enter manually.', 'warning');
      }
    );
  };

  const handleSubmit = async (publishImmediately = true) => {
    if (!formData.title || !formData.category_id || !formData.start_date || !formData.city) {
      onNotify?.('Please complete required fields (Title, Category, Start Date, City)', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title,
        category_id: formData.category_id,
        deity_or_tradition: formData.deity_or_tradition,
        language: formData.language,
        registration_type: formData.registration_type,
        description: formData.description,
        dress_code: formData.dress_code,
        start_date: formData.start_date,
        start_time: formData.start_time,
        end_date: formData.end_date || formData.start_date,
        end_time: formData.end_time,
        registration_deadline: formData.registration_deadline || null,
        max_capacity: formData.has_capacity_limit ? parseInt(formData.max_capacity) || null : null,
        auto_promote_waitlist: formData.auto_promote_waitlist,
        pricing_type: formData.pricing_type,
        ticket_price: formData.pricing_type === 'PAID' ? parseFloat(formData.ticket_price) || 0 : 0,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
        cover_image: formData.cover_image,
        location: {
          venue_name: formData.venue_name,
          address_line1: formData.address_line1,
          address_line2: formData.address_line2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          google_maps_url: formData.google_maps_url,
          parking_available: formData.parking_available,
          is_yatra: formData.is_yatra,
          meeting_point_name: formData.is_yatra ? formData.meeting_point_name : null,
          meeting_point_address: formData.is_yatra ? formData.meeting_point_address : null,
          yatra_route_description: formData.is_yatra ? formData.yatra_route_description : null
        }
      };

      const res = await eventApi.createEvent(payload);
      if (res.success) {
        onNotify?.('✨ Spiritual Event Created & Published Successfully!', 'success');
        onSuccess ? onSuccess(res.data) : onCancel();
      }
    } catch (err) {
      onNotify?.(err.response?.data?.message || 'Failed to create event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Basic Info' },
    { num: 2, label: 'Date & Time' },
    { num: 3, label: 'Venue & GPS' },
    { num: 4, label: 'Yatra Pilgrimage' },
    { num: 5, label: 'Capacity & Pricing' },
    { num: 6, label: 'Visuals & Review' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Wizard Card Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Wizard Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
              Organizer Portal
            </span>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <span>🪔</span> Host a Spiritual Event or Yatra
            </h2>
          </div>

          <button
            onClick={onCancel}
            className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800 self-start sm:self-auto"
          >
            ✕ Cancel & Exit
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800/80 overflow-x-auto">
          <div className="flex items-center min-w-max gap-4 sm:gap-6 justify-between">
            {steps.map((s) => (
              <button
                key={s.num}
                onClick={() => setStep(s.num)}
                className={`flex items-center gap-2 text-xs font-semibold transition-all ${
                  step === s.num
                    ? 'text-amber-400 font-bold'
                    : step > s.num
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    step === s.num
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : step > s.num
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-100 mb-2">Step 1: Event Essentials</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maha Shivaratri 108 Rudrabhishek & Bhajan Sandhya"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Event Category *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon || '🕉️'} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Deity / Tradition</label>
                  <input
                    type="text"
                    placeholder="e.g. Lord Shiva, Lord Krishna, ISKCON, Vedic"
                    value={formData.deity_or_tradition}
                    onChange={(e) => setFormData({ ...formData, deity_or_tradition: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Language of Discourse / Katha</label>
                  <input
                    type="text"
                    placeholder="e.g. Hindi, Sanskrit, Marathi, English"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Recommended Dress Code</label>
                  <input
                    type="text"
                    placeholder="e.g. Dhoti/Kurta, Saree, Modest Traditional"
                    value={formData.dress_code}
                    onChange={(e) => setFormData({ ...formData, dress_code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Detailed Description & Vidhi</label>
                <textarea
                  rows={4}
                  placeholder="Provide spiritual significance, sequence of ceremonies, Prasad arrangement, and benefits for devotees..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Schedule */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-100 mb-2">Step 2: Timings & Schedule</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Start Time</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">End Time</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Registration Cutoff Deadline (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.registration_deadline}
                  onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
                <span className="text-[11px] text-slate-400">
                  After this deadline, registration will close automatically.
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Venue & Location */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-100 mb-2">Step 3: Venue & Geolocation</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Venue / Mandir Name</label>
                <input
                  type="text"
                  placeholder="e.g. ISKCON Temple Auditorium / Babulnath Mandir"
                  value={formData.venue_name}
                  onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Address Line 1</label>
                  <input
                    type="text"
                    placeholder="Street, Ashram Road"
                    value={formData.address_line1}
                    onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, Varanasi, Haridwar"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">State</label>
                  <input
                    type="text"
                    placeholder="Maharashtra"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pincode</label>
                  <input
                    type="text"
                    placeholder="400007"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Landmark</label>
                  <input
                    type="text"
                    placeholder="Opposite Metro Station"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* GPS Coordinates & Map URL */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">GPS Coordinates (For Distance Radius Discovery)</span>
                  <button
                    type="button"
                    onClick={handleFetchCurrentCoords}
                    className="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg hover:bg-amber-500/30 transition-colors"
                  >
                    📍 Detect Current GPS
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="19.0760"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="72.8777"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Google Maps Direct URL</label>
                  <input
                    type="url"
                    placeholder="https://maps.app.goo.gl/..."
                    value={formData.google_maps_url}
                    onChange={(e) => setFormData({ ...formData, google_maps_url: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Yatra Pilgrimage Logistics */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-100 mb-2">Step 4: Yatra & Pilgrimage Logistics</h3>

              <div className="flex items-center gap-3 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <input
                  type="checkbox"
                  id="is_yatra"
                  checked={formData.is_yatra}
                  onChange={(e) => setFormData({ ...formData, is_yatra: e.target.checked })}
                  className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="is_yatra" className="text-sm font-semibold text-slate-200 cursor-pointer">
                  Is this event a Yatra / Padyatra / Tirtha Pilgrimage Journey?
                </label>
              </div>

              {formData.is_yatra ? (
                <div className="space-y-4 p-4 bg-gradient-to-r from-amber-950/20 to-orange-950/20 rounded-2xl border border-amber-500/30">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Departure Assembly Meeting Point Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dadar East Station Central Bridge / Haridwar Ghat Gate 2"
                      value={formData.meeting_point_name}
                      onChange={(e) => setFormData({ ...formData, meeting_point_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Meeting Point Full Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Outside Platform 1, Dadar Central, Mumbai"
                      value={formData.meeting_point_address}
                      onChange={(e) => setFormData({ ...formData, meeting_point_address: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Yatra Route & Halt Plan
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Day 1: Assembly at Dadar -> Halt at Igatpuri -> Day 2: Trimbakeshwar Darshan & Snan..."
                      value={formData.yatra_route_description}
                      onChange={(e) => setFormData({ ...formData, yatra_route_description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                  Standard non-moving temple or hall event. Check the box above if organizing a moving pilgrimage yatra.
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Capacity & Pricing */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-100 mb-2">Step 5: Capacity, Pricing & Waitlists</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-200">Seat Capacity Limit</label>
                    <input
                      type="checkbox"
                      checked={formData.has_capacity_limit}
                      onChange={(e) => setFormData({ ...formData, has_capacity_limit: e.target.checked })}
                      className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                    />
                  </div>

                  {formData.has_capacity_limit ? (
                    <div>
                      <input
                        type="number"
                        min="1"
                        placeholder="Max attendees (e.g. 100)"
                        value={formData.max_capacity}
                        onChange={(e) => setFormData({ ...formData, max_capacity: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          id="auto_promote"
                          checked={formData.auto_promote_waitlist}
                          onChange={(e) => setFormData({ ...formData, auto_promote_waitlist: e.target.checked })}
                          className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
                        />
                        <label htmlFor="auto_promote" className="text-[11px] text-slate-300">
                          Auto-promote waitlist on cancellation
                        </label>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-emerald-400">Unlimited Seating / Open Ground</span>
                  )}
                </div>

                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                  <label className="block text-xs font-semibold text-slate-200">Admission Fee / Seva</label>
                  <select
                    value={formData.pricing_type}
                    onChange={(e) => setFormData({ ...formData, pricing_type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="FREE">Free (Nishulk Seva)</option>
                    <option value="PAID">Paid / Dakshina Pass</option>
                  </select>

                  {formData.pricing_type === 'PAID' && (
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Ticket Price (₹)</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 251"
                        value={formData.ticket_price}
                        onChange={(e) => setFormData({ ...formData, ticket_price: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Contact Helpline Phone</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Contact Email</label>
                  <input
                    type="email"
                    placeholder="seva@ashram.org"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Visuals & Review */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-100 mb-2">Step 6: Cover Image & Final Review</h3>

              {/* Cover Image Upload / URL */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300">Event Banner / Cover Image</label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:w-48 h-28 bg-slate-950 rounded-2xl overflow-hidden border border-slate-700 flex-shrink-0">
                    <img
                      src={formData.cover_image}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1545232979-fbf67839352e?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/20 file:text-amber-300 hover:file:bg-amber-500/30"
                    />
                    {uploadingImage && <p className="text-xs text-amber-400">Uploading banner image...</p>}
                    <input
                      type="url"
                      placeholder="Or paste external image URL..."
                      value={formData.cover_image}
                      onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Summary Overview */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <div className="font-bold text-amber-400 text-sm">Summary Review</div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div><strong>Title:</strong> {formData.title || 'Untitled'}</div>
                  <div><strong>Start Date:</strong> {formData.start_date} at {formData.start_time}</div>
                  <div><strong>Location:</strong> {formData.venue_name ? `${formData.venue_name}, ` : ''}{formData.city}</div>
                  <div><strong>Capacity:</strong> {formData.has_capacity_limit ? `${formData.max_capacity} seats` : 'Unlimited'}</div>
                  <div><strong>Pricing:</strong> {formData.pricing_type === 'FREE' ? 'Free' : `₹${formData.ticket_price}`}</div>
                  <div><strong>Yatra:</strong> {formData.is_yatra ? 'Yes (Assembly configured)' : 'No'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all"
              >
                ← Previous
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                Next Step →
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit(true)}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-sm rounded-xl shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <span>{submitting ? 'Publishing...' : '✨ Publish Event Now'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
