import React from 'react';

export default function EventCard({ event, onSelect, onRaiseHand, isHandRaised = false }) {
  const formatDateTime = (dateStr, timeStr) => {
    try {
      const d = new Date(dateStr);
      const formattedDate = d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      return `${formattedDate}${timeStr ? ` • ${timeStr}` : ''}`;
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = () => {
    switch (event.status) {
      case 'PUBLISHED':
        return <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">Active</span>;
      case 'ONGOING':
        return <span className="bg-amber-500/10 text-amber-400 text-xs px-2.5 py-1 rounded-full border border-amber-500/20 font-medium animate-pulse">Live Now</span>;
      case 'REGISTRATION_CLOSED':
        return <span className="bg-rose-500/10 text-rose-400 text-xs px-2.5 py-1 rounded-full border border-rose-500/20 font-medium">Housefull / Closed</span>;
      case 'COMPLETED':
        return <span className="bg-slate-500/10 text-slate-400 text-xs px-2.5 py-1 rounded-full border border-slate-500/20 font-medium">Completed</span>;
      case 'CANCELLED':
        return <span className="bg-red-500/10 text-red-400 text-xs px-2.5 py-1 rounded-full border border-red-500/20 font-medium">Cancelled</span>;
      default:
        return null;
    }
  };

  const category = event.category || {};
  const location = event.location || {};
  const isFull = event.max_capacity && event.current_confirmed_count >= event.max_capacity;

  return (
    <div className="group bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/60 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
      {/* Cover Image & Category Chip */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img
          src={event.cover_image || 'https://images.unsplash.com/photo-1545232979-fbf67839352e?q=80&w=800&auto=format&fit=crop'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1545232979-fbf67839352e?q=80&w=800&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          <span className="bg-slate-900/80 backdrop-blur-md text-amber-300 text-xs px-2.5 py-1 rounded-lg border border-amber-500/30 font-medium flex items-center gap-1">
            <span>{category.icon || '🕉️'}</span>
            <span>{category.name || 'Spiritual'}</span>
          </span>
          {event.is_featured && (
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs px-2 py-0.5 rounded-lg font-bold shadow">
              ⭐ Featured
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>

        {/* Distance Badge if available */}
        {event.distance_km !== undefined && (
          <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md text-cyan-300 text-xs px-2 py-1 rounded-lg border border-cyan-500/30 font-medium flex items-center gap-1">
            <span>📍</span>
            <span>{event.distance_km} km away</span>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3">
          {event.pricing_type === 'FREE' ? (
            <span className="bg-emerald-500/90 text-slate-950 text-xs px-2.5 py-1 rounded-lg font-bold shadow-md">
              FREE
            </span>
          ) : (
            <span className="bg-amber-500/90 text-slate-950 text-xs px-2.5 py-1 rounded-lg font-bold shadow-md">
              ₹{event.ticket_price}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Date & Time */}
          <div className="flex items-center text-xs text-amber-400/90 font-medium mb-1.5 gap-1.5">
            <span>🗓️</span>
            <span>{formatDateTime(event.start_date, event.start_time)}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(event)}
            className="text-lg font-bold text-slate-100 hover:text-amber-400 cursor-pointer transition-colors line-clamp-2 mb-2 leading-snug"
          >
            {event.title}
          </h3>

          {/* Venue & Location */}
          <div className="flex items-start text-xs text-slate-400 mb-3 gap-1.5">
            <span className="text-sm mt-0.5">📍</span>
            <span className="line-clamp-1">
              {location.venue_name ? `${location.venue_name}, ` : ''}{location.city || 'Online'}
              {location.state ? `, ${location.state}` : ''}
            </span>
          </div>

          {/* Yatra info snippet if applicable */}
          {location.is_yatra && location.meeting_point_name && (
            <div className="mb-3 p-2 bg-indigo-950/40 border border-indigo-500/30 rounded-lg text-xs text-indigo-300 flex items-center gap-1.5">
              <span>🚩</span>
              <span className="truncate">Yatra Assembly: <strong>{location.meeting_point_name}</strong></span>
            </div>
          )}

          {/* Capacity Progress Bar */}
          {event.max_capacity && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Participation</span>
                <span className={isFull ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
                  {event.current_confirmed_count || 0} / {event.max_capacity} seats
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isFull ? 'bg-amber-500' : 'bg-gradient-to-r from-amber-500 to-emerald-400'
                  }`}
                  style={{
                    width: `${Math.min(100, ((event.current_confirmed_count || 0) / event.max_capacity) * 100)}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between gap-2 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-300 overflow-hidden">
              {event.organizer?.avatar ? (
                <img src={event.organizer.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                event.organizer?.name ? event.organizer.name.charAt(0).toUpperCase() : 'O'
              )}
            </div>
            <span className="text-xs text-slate-400 truncate max-w-[100px]">
              {event.organizer?.name || 'Organizer'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {event.status === 'PUBLISHED' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRaiseHand ? onRaiseHand(event) : onSelect(event);
                }}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all shadow-sm flex items-center gap-1 ${
                  isHandRaised
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : isFull
                    ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 hover:bg-amber-600/30'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold'
                }`}
              >
                <span>{isHandRaised ? '✅ Attending' : isFull ? '⏳ Waitlist' : '🙋 Raise Hand'}</span>
              </button>
            )}

            <button
              onClick={() => onSelect(event)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors font-medium"
            >
              Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
