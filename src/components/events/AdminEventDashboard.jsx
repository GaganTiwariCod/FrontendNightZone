import React, { useState, useEffect } from 'react';
import { eventApi } from '../../api/eventApi';

export default function AdminEventDashboard({ onBack, onNotify }) {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'categories' | 'reports'
  const [loading, setLoading] = useState(true);

  // Events tab state
  const [events, setEvents] = useState([]);
  const [eventSearch, setEventSearch] = useState('');
  const [eventStatus, setEventStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Categories tab state
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    name_hi: '',
    slug: '',
    icon: '🕉️',
    description: '',
    display_order: 0,
    is_active: true
  });

  // Reports tab state
  const [reports, setReports] = useState([]);
  const [reportStatus, setReportStatus] = useState('PENDING');

  const loadDashboardStats = async () => {
    try {
      const res = await eventApi.adminGetDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin event stats:', err);
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await eventApi.adminGetEvents({
        page,
        limit: 15,
        search: eventSearch,
        status: eventStatus
      });
      if (res.success) {
        setEvents(res.data || []);
        setTotalPages(res.pagination?.pages || 1);
      }
    } catch (err) {
      console.error('Failed to load admin events:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await eventApi.adminGetCategories();
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadReports = async () => {
    try {
      const res = await eventApi.adminGetReports({ status: reportStatus });
      if (res.success) {
        setReports(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    }
  };

  useEffect(() => {
    loadDashboardStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'events') {
      loadEvents();
    } else if (activeTab === 'categories') {
      loadCategories();
    } else if (activeTab === 'reports') {
      loadReports();
    }
  }, [activeTab, page, eventStatus, reportStatus]);

  const handleUpdateEventStatus = async (eventId, newStatus) => {
    try {
      const res = await eventApi.adminUpdateEventStatus(eventId, { status: newStatus });
      if (res.success) {
        onNotify?.(`Event status updated to ${newStatus}`, 'success');
        loadEvents();
        loadDashboardStats();
      }
    } catch (err) {
      onNotify?.('Failed to update event status', 'error');
    }
  };

  const handleToggleFeatured = async (eventId) => {
    try {
      const res = await eventApi.adminToggleFeatured(eventId);
      if (res.success) {
        onNotify?.('Featured status updated', 'success');
        loadEvents();
      }
    } catch (err) {
      onNotify?.('Failed to toggle featured', 'error');
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await eventApi.adminSaveCategory(categoryForm);
      if (res.success) {
        onNotify?.('Category saved successfully!', 'success');
        setShowCategoryModal(false);
        setCategoryForm({
          name: '',
          name_hi: '',
          slug: '',
          icon: '🕉️',
          description: '',
          display_order: 0,
          is_active: true
        });
        loadCategories();
      }
    } catch (err) {
      onNotify?.('Failed to save category', 'error');
    }
  };

  const handleResolveReport = async (reportId, resolutionStatus) => {
    const actionNotes = window.prompt('Enter moderator resolution notes:');
    if (actionNotes === null) return;

    try {
      const res = await eventApi.adminResolveReport(reportId, {
        status: resolutionStatus,
        action_taken: actionNotes
      });
      if (res.success) {
        onNotify?.(`Report marked as ${resolutionStatus}`, 'success');
        loadReports();
        loadDashboardStats();
      }
    } catch (err) {
      onNotify?.('Failed to resolve report', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-400 hover:text-amber-400 mb-2 inline-flex items-center gap-1.5"
          >
            <span>←</span> Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>🛡️</span> Spiritual Events & Meetup Admin Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Platform-wide governance, event moderation, category management, and user issue resolution.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow text-center">
            <span className="text-xs text-slate-400 block mb-1">Total Events</span>
            <span className="text-2xl font-black text-slate-100">{stats.totalEvents || 0}</span>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow text-center">
            <span className="text-xs text-slate-400 block mb-1">Active Published</span>
            <span className="text-2xl font-black text-emerald-400">{stats.publishedEvents || 0}</span>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow text-center">
            <span className="text-xs text-slate-400 block mb-1">Total Devotee RSVPs</span>
            <span className="text-2xl font-black text-amber-400">{stats.totalParticipants || 0}</span>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow text-center">
            <span className="text-xs text-slate-400 block mb-1">Pending Reports</span>
            <span className="text-2xl font-black text-rose-400">{stats.pendingReports || 0}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'events'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🪔 Event Moderation ({stats?.totalEvents || 0})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'categories'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🏷️ Categories ({categories.length || 16})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'reports'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🚩 User Reports ({stats?.pendingReports || 0} Pending)
        </button>
      </div>

      {/* Tab 1: Event Moderation */}
      {activeTab === 'events' && (
        <div className="bg-slate-900/80 border border-slate-700/60 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Search event title, organizer, city..."
              value={eventSearch}
              onChange={(e) => setEventSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadEvents()}
              className="w-full sm:w-80 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100"
            />

            <div className="flex items-center gap-2">
              <select
                value={eventStatus}
                onChange={(e) => setEventStatus(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
              >
                <option value="">All Statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <button
                onClick={loadEvents}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              <span className="animate-spin inline-block mr-2">⏳</span> Loading platform events...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Event Title</th>
                    <th className="py-3 px-4">Organizer</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Featured</th>
                    <th className="py-3 px-4 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 max-w-[240px]">
                        <div className="font-bold text-slate-100 truncate">{ev.title}</div>
                        <div className="text-[11px] text-amber-400">{ev.category?.name || 'Spiritual'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-200 font-medium">{ev.organizer?.name || 'User'}</div>
                        <div className="text-[10px] text-slate-500">{ev.organizer?.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-300">{ev.location?.city || 'Online'}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {ev.start_date}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={ev.status}
                          onChange={(e) => handleUpdateEventStatus(ev.id, e.target.value)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border bg-slate-950 ${
                            ev.status === 'PUBLISHED'
                              ? 'text-emerald-400 border-emerald-500/40'
                              : ev.status === 'CANCELLED'
                              ? 'text-rose-400 border-rose-500/40'
                              : 'text-amber-400 border-amber-500/40'
                          }`}
                        >
                          <option value="PUBLISHED">PUBLISHED</option>
                          <option value="DRAFT">DRAFT</option>
                          <option value="ONGOING">ONGOING</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(ev.id)}
                          className={`text-sm p-1 rounded transition-colors ${
                            ev.is_featured ? 'text-amber-400 scale-125' : 'text-slate-600 hover:text-amber-400'
                          }`}
                          title="Toggle Featured"
                        >
                          ★
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleUpdateEventStatus(ev.id, ev.status === 'CANCELLED' ? 'PUBLISHED' : 'CANCELLED')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${
                            ev.status === 'CANCELLED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {ev.status === 'CANCELLED' ? 'Re-activate' : 'Cancel / Ban'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Category Manager */}
      {activeTab === 'categories' && (
        <div className="bg-slate-900/80 border border-slate-700/60 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100">Event Categories & Taxonomy</h3>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors"
            >
              ➕ Add New Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {categories.map((c) => (
              <div
                key={c.id}
                className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.icon || '🕉️'}</span>
                  <div>
                    <div className="font-bold text-slate-200 text-sm">{c.name}</div>
                    <div className="text-xs text-amber-400/90">{c.name_hi || c.slug}</div>
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    c.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {c.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: User Reports Queue */}
      {activeTab === 'reports' && (
        <div className="bg-slate-900/80 border border-slate-700/60 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
              <span>🚩</span> User Moderation Reports
            </h3>

            <select
              value={reportStatus}
              onChange={(e) => setReportStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
            >
              <option value="PENDING">Pending Review</option>
              <option value="INVESTIGATING">Under Investigation</option>
              <option value="RESOLVED">Resolved</option>
              <option value="DISMISSED">Dismissed</option>
            </select>
          </div>

          {reports.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
              No reports matching "{reportStatus}". Community is safe and peaceful!
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold text-[10px] mr-2">
                        {r.reason}
                      </span>
                      <span className="font-bold text-slate-200">Event: {r.event?.title || 'Unknown Event'}</span>
                    </div>

                    <span className="text-slate-500 text-[11px]">
                      Reported by: {r.reporter?.name || 'User'} on {new Date(r.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  <p className="text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    "{r.details}"
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500">Status: <strong>{r.status}</strong></span>
                    {r.status === 'PENDING' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResolveReport(r.id, 'DISMISSED')}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleResolveReport(r.id, 'RESOLVED')}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl"
                        >
                          Resolve & Ban Event
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Add New Category */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-950">
              <h3 className="text-base font-bold text-amber-400">Add New Spiritual Category</h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-slate-400 hover:text-slate-200 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category Name (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhajan Sandhya"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category Name (Hindi) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. भजन संध्या"
                  value={categoryForm.name_hi}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name_hi: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Emoji Icon</label>
                  <input
                    type="text"
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={categoryForm.display_order}
                    onChange={(e) => setCategoryForm({ ...categoryForm, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
