import React, { useState, useEffect, useCallback } from 'react';
import { eventApi } from '../../api/eventApi';
import EventCard from './EventCard';

export default function EventsDiscoveryPage({ onSelectEvent, onNavigateCreate, currentUser, onNotify, onBack }) {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [city, setCity] = useState('');
  const [dateRange, setDateRange] = useState('ALL'); // 'ALL' | 'TODAY' | 'TOMORROW' | 'WEEKEND' | 'MONTH'
  const [priceType, setPriceType] = useState('ALL'); // 'ALL' | 'FREE' | 'PAID'
  const [isYatraOnly, setIsYatraOnly] = useState(false);

  // Geolocation & Radius (Haversine)
  const [userCoords, setUserCoords] = useState(null); // { lat, lng }
  const [radiusKm, setRadiusKm] = useState(''); // '1', '5', '10', '25', '50', ''
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Quick Raise Hand state
  const [handRaisedEvents, setHandRaisedEvents] = useState(new Set());

  // Load Categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await eventApi.getCategories();
        if (res.success) {
          setCategories(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load event categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Detect Geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      onNotify?.('Geolocation is not supported by your browser', 'warning');
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        if (!radiusKm) setRadiusKm('25'); // Default to 25km when detecting
        setDetectingLocation(false);
        onNotify?.('Location detected! Showing nearest spiritual gatherings.', 'success');
      },
      (err) => {
        console.error('Geolocation error:', err);
        onNotify?.('Could not access current location. Please check browser permissions.', 'warning');
        setDetectingLocation(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      let start_date;
      let end_date;
      const now = new Date();

      if (dateRange === 'TODAY') {
        start_date = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        end_date = new Date(now.setHours(23, 59, 59, 999)).toISOString();
      } else if (dateRange === 'TOMORROW') {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        start_date = new Date(tomorrow.setHours(0, 0, 0, 0)).toISOString();
        end_date = new Date(tomorrow.setHours(23, 59, 59, 999)).toISOString();
      } else if (dateRange === 'WEEKEND') {
        const currentDay = now.getDay();
        const distanceToSaturday = (6 - currentDay + 7) % 7;
        const sat = new Date(now);
        sat.setDate(sat.getDate() + distanceToSaturday);
        sat.setHours(0, 0, 0, 0);

        const sun = new Date(sat);
        sun.setDate(sun.getDate() + 1);
        sun.setHours(23, 59, 59, 999);

        start_date = sat.toISOString();
        end_date = sun.toISOString();
      } else if (dateRange === 'MONTH') {
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        start_date = new Date().toISOString();
        end_date = endOfMonth.toISOString();
      }

      const params = {
        page,
        limit: 9,
        search: search.trim() || undefined,
        category: selectedCategory || undefined,
        city: city.trim() || undefined,
        pricing: priceType !== 'ALL' ? priceType : undefined,
        is_yatra: isYatraOnly ? 'true' : undefined,
        start_date,
        end_date
      };

      if (userCoords && radiusKm) {
        params.lat = userCoords.lat;
        params.lng = userCoords.lng;
        params.radius = radiusKm;
      }

      const res = await eventApi.getEvents(params);
      if (res.success) {
        setEvents(res.data || []);
        setTotalPages(res.pagination?.pages || 1);
        setTotalCount(res.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
      onNotify?.('Failed to load spiritual events feed', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedCategory, city, dateRange, priceType, isYatraOnly, userCoords, radiusKm]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleQuickRaiseHand = async (event) => {
    if (!currentUser) {
      onNotify?.('Please login to raise your hand and attend this event', 'warning');
      return;
    }
    // If user has specific modal requirements or event is paid, open details
    if (event.pricing_type === 'PAID') {
      onSelectEvent(event);
      return;
    }

    try {
      const res = await eventApi.raiseHand(event.id, { guests_count: 0 });
      if (res.success) {
        onNotify?.(
          res.data?.status === 'WAITLISTED'
            ? 'Event is full. Added to auto-promoting waitlist!'
            : '✨ Hand Raised! You are confirmed for this event.',
          'success'
        );
        setHandRaisedEvents((prev) => new Set(prev).add(event.id));
        fetchEvents();
      }
    } catch (err) {
      onNotify?.(err.response?.data?.message || 'Failed to raise hand', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Navigation Top Bar */}
      {onBack && (
        <div className="flex items-center justify-start">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900/80 border border-slate-700/60 px-3.5 py-1.5 rounded-full hover:border-amber-500/60 transition-all cursor-pointer shadow-xs"
          >
            <span>←</span>
            <span>Back to Home</span>
          </button>
        </div>
      )}

      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border border-amber-500/30 p-8 sm:p-12 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide uppercase">
            <span>🪔</span> Sanatan Events & Meetup Platform
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
            Discover Nearby <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200">Pooja, Satsangs</span> & Yatra Groups
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Join thousands of devotees at local temple events, bhajan sandhyas, katha discourses, or coordinate group travel and carpools to sacred pilgrimage dhams.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onNavigateCreate}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl transition-all flex items-center gap-2 transform active:scale-95"
            >
              <span>➕</span> Host a Spiritual Event / Yatra
            </button>

            <button
              onClick={handleDetectLocation}
              disabled={detectingLocation}
              className="px-5 py-3 bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-sm font-semibold rounded-2xl transition-colors flex items-center gap-2"
            >
              <span>📍</span> {detectingLocation ? 'Locating...' : 'Find Events Near Me'}
            </button>
          </div>
        </div>

        {/* Ambient Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 text-9xl opacity-10 pointer-events-none select-none">
          🕉️
        </div>
      </div>

      {/* Category Carousel / Filter Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Browse by Sacred Tradition
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory('')}
              className="text-xs text-amber-400 hover:underline"
            >
              Clear Category Filter
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === ''
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>✨</span> All Traditions ({totalCount})
          </button>

          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.slug === selectedCategory ? '' : c.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === c.slug
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{c.icon || '🕉️'}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Multi-Filter Control Console */}
      <div className="bg-slate-900/80 border border-slate-700/60 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search event name, deity, or mandir..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
            <span className="absolute left-3 top-2.5 text-slate-500 text-xs">🔍</span>
          </div>

          {/* City / Area Filter */}
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by City / Area (e.g. Mumbai)"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
            <span className="absolute left-3 top-2.5 text-slate-500 text-xs">📍</span>
          </div>

          {/* Date Filter Dropdown */}
          <div>
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">🗓️ Any Date</option>
              <option value="TODAY">Today Only</option>
              <option value="TOMORROW">Tomorrow</option>
              <option value="WEEKEND">This Upcoming Weekend</option>
              <option value="MONTH">This Month</option>
            </select>
          </div>

          {/* Distance Radius Filter (Haversine) */}
          <div className="flex items-center gap-2">
            <select
              value={radiusKm}
              onChange={(e) => {
                setRadiusKm(e.target.value);
                setPage(1);
                if (!userCoords && e.target.value) {
                  handleDetectLocation();
                }
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            >
              <option value="">🎯 Distance (Any)</option>
              <option value="5">Within 5 km radius</option>
              <option value="10">Within 10 km radius</option>
              <option value="25">Within 25 km radius</option>
              <option value="50">Within 50 km radius</option>
              <option value="100">Within 100 km radius</option>
            </select>

            {userCoords && (
              <button
                onClick={() => {
                  setUserCoords(null);
                  setRadiusKm('');
                }}
                className="p-2 text-xs text-slate-400 hover:text-rose-400 bg-slate-950 border border-slate-700 rounded-xl"
                title="Reset GPS filter"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Bottom Toggle Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 mr-1">Pricing:</span>
            {['ALL', 'FREE', 'PAID'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setPriceType(type);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  priceType === type
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {type === 'ALL' ? 'All' : type === 'FREE' ? 'Free (Nishulk)' : 'Paid / Dakshina'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="yatra_filter"
              checked={isYatraOnly}
              onChange={(e) => {
                setIsYatraOnly(e.target.checked);
                setPage(1);
              }}
              className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="yatra_filter" className="text-xs text-slate-300 font-semibold cursor-pointer flex items-center gap-1">
              <span>🚩</span> Pilgrimages & Yatra Events Only
            </label>
          </div>
        </div>
      </div>

      {/* Events Listing Grid */}
      <div>
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 text-sm">Discovering sacred events near you...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-3xl p-16 text-center space-y-4">
            <div className="text-5xl">🪔</div>
            <h3 className="text-xl font-bold text-slate-200">No spiritual events found for your criteria</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try expanding your distance radius, removing filters, or be the community pioneer to host an event yourself!
            </p>
            <button
              onClick={onNavigateCreate}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-all"
            >
              Host a Spiritual Event
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Showing <strong>{events.length}</strong> of <strong>{totalCount}</strong> upcoming events</span>
              {userCoords && radiusKm && (
                <span className="text-cyan-400 font-medium">📍 Sorted by distance from your location</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  onSelect={onSelectEvent}
                  onRaiseHand={handleQuickRaiseHand}
                  isHandRaised={handRaisedEvents.has(ev.id)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 pt-6">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 disabled:opacity-40 hover:border-slate-700"
                >
                  ← Previous
                </button>
                <span className="text-xs text-slate-400">
                  Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 disabled:opacity-40 hover:border-slate-700"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
