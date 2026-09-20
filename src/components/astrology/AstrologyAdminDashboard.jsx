import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { astrologyApi } from '../../api/astrologyApi';
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  Search, 
  FileText,
  AlertTriangle
} from 'lucide-react';

export default function AstrologyAdminDashboard({ onBack }) {
  const { user, showToast } = useAuth();

  const [activeTab, setActiveTab] = useState('VERIFICATION'); // 'VERIFICATION' | 'ANALYTICS' | 'SERVICES'
  const [astrologers, setAstrologers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Rejection modal
  const [rejectingAstrologerId, setRejectingAstrologerId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [astrologersRes, analyticsRes, servicesRes] = await Promise.all([
        astrologyApi.getAdminAstrologers({ status: filterStatus }),
        astrologyApi.getAdminAnalytics(),
        astrologyApi.getCategoriesAndServices()
      ]);

      if (astrologersRes.success) setAstrologers(astrologersRes.astrologers || []);
      if (analyticsRes.success) setAnalytics(analyticsRes.analytics);
      if (servicesRes.success) setServices(servicesRes.services || []);
    } catch (err) {
      console.error('Error fetching admin astrology data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [filterStatus]);

  const handleUpdateStatus = async (id, status, reason = '') => {
    try {
      const res = await astrologyApi.verifyAstrologer(id, {
        status,
        rejection_reason: reason
      });
      if (res.success) {
        showToast(`Astrologer status updated to ${status}!`, 'success');
        setRejectingAstrologerId(null);
        setRejectionReason('');
        fetchAdminData();
      } else {
        showToast(res.message || 'Status update failed.', 'error');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('Error updating status.', 'error');
    }
  };

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
            <span>Exit Admin Panel</span>
          </button>
          <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
            Astrology Admin Moderation
          </span>
        </div>

        {/* Analytics Top Cards */}
        {analytics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-3xl bg-stone-900 border border-stone-800 space-y-1">
              <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Total Astrologers</div>
              <div className="text-2xl font-black text-amber-400">{analytics.totalAstrologers}</div>
              <div className="text-[10px] text-emerald-400">{analytics.verifiedAstrologers} Verified</div>
            </div>
            <div className="p-4 rounded-3xl bg-stone-900 border border-stone-800 space-y-1">
              <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Pending KYC</div>
              <div className="text-2xl font-black text-orange-400">{analytics.pendingAstrologers}</div>
              <div className="text-[10px] text-stone-400">Needs Review</div>
            </div>
            <div className="p-4 rounded-3xl bg-stone-900 border border-stone-800 space-y-1">
              <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Consultations</div>
              <div className="text-2xl font-black text-white">{analytics.totalBookings}</div>
              <div className="text-[10px] text-stone-400">{analytics.completedBookings} Completed</div>
            </div>
            <div className="p-4 rounded-3xl bg-stone-900 border border-stone-800 space-y-1">
              <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Gross Revenue</div>
              <div className="text-2xl font-black text-emerald-400">₹{analytics.totalRevenue}</div>
              <div className="text-[10px] text-stone-400">{analytics.totalReports} Reports</div>
            </div>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b border-stone-800 gap-6 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('VERIFICATION')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'VERIFICATION' ? 'border-amber-500 text-amber-400' : 'border-transparent text-stone-400'
            }`}
          >
            Astrologer KYC Verification ({astrologers.length})
          </button>
          <button
            onClick={() => setActiveTab('SERVICES')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'SERVICES' ? 'border-amber-500 text-amber-400' : 'border-transparent text-stone-400'
            }`}
          >
            Dynamic Service Catalogue ({services.length})
          </button>
        </div>

        {/* Tab 1: Astrologer Verification Table */}
        {activeTab === 'VERIFICATION' && (
          <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl space-y-4">
            
            {/* Filter Pills */}
            <div className="p-4 border-b border-stone-800 bg-stone-950 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {['ALL', 'PENDING', 'VERIFIED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      filterStatus === st
                        ? 'bg-amber-500 text-stone-950 shadow'
                        : 'bg-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950 text-stone-400 uppercase font-bold border-b border-stone-800">
                  <tr>
                    <th className="p-4">Astrologer</th>
                    <th className="p-4">Contact & Location</th>
                    <th className="p-4">Experience & Education</th>
                    <th className="p-4">Pricing</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {astrologers.map((a) => (
                    <tr key={a.id} className="hover:bg-stone-850/50">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{a.full_name}</div>
                        <div className="text-[11px] text-amber-300">{a.display_name}</div>
                      </td>
                      <td className="p-4 text-stone-300">
                        <div>{a.phone}</div>
                        <div className="text-stone-500">{a.city}, {a.state}</div>
                      </td>
                      <td className="p-4 text-stone-300">
                        <div className="font-semibold text-white">{a.years_of_experience} Yrs Practice</div>
                        <div className="text-stone-500 line-clamp-1">{a.education}</div>
                      </td>
                      <td className="p-4 text-stone-300">
                        <div>Chat: ₹{a.chat_price}/min</div>
                        <div>Call: ₹{a.call_price}/min</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          a.status === 'VERIFIED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : a.status === 'PENDING'
                            ? 'bg-orange-500/20 text-orange-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {a.status !== 'VERIFIED' && (
                            <button
                              onClick={() => handleUpdateStatus(a.id, 'VERIFIED')}
                              className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold"
                              title="Approve & Verify"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {a.status !== 'REJECTED' && (
                            <button
                              onClick={() => setRejectingAstrologerId(a.id)}
                              className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold"
                              title="Reject Application"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Dynamic Services */}
        {activeTab === 'SERVICES' && (
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">Dynamic Astrology Offerings Catalogue</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">{s.category?.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                      {s.duration_minutes} Mins
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{s.name}</h4>
                  <p className="text-xs text-stone-400 line-clamp-2">{s.short_description}</p>
                  <div className="text-xs font-black text-amber-300 pt-1">
                    Base Price: ₹{s.pricing}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {rejectingAstrologerId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white">Reject Astrologer Application</h3>
              <div>
                <label className="block text-xs text-stone-300 mb-1">Reason for Rejection</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Incomplete certification documents..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-3 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setRejectingAstrologerId(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStatus(rejectingAstrologerId, 'REJECTED', rejectionReason)}
                  className="px-5 py-2 rounded-xl bg-red-500 text-white font-bold text-xs uppercase"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
