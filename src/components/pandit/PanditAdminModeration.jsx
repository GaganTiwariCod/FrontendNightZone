import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { panditApi } from '../../api/panditApi';

export default function PanditAdminModeration({ onBack }) {
  const { showToast } = useAuth();
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Inspector state
  const [selectedPandit, setSelectedPandit] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [badges, setBadges] = useState({
    identity_verified: true,
    education_verified: true,
    experience_verified: true,
    vedic_certified: true,
    top_rated_pandit: false
  });
  const [moderating, setModerating] = useState(false);

  // Fetch pandits
  const fetchAdminPandits = async () => {
    setLoading(true);
    try {
      const res = await panditApi.adminGetAllPandits({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined
      });
      if (res.success && res.data) {
        setPandits(res.data.pandits || []);
      }
    } catch (err) {
      showToast('Failed to load Pandits for moderation', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminPandits();
  }, [statusFilter, searchTerm]);

  // Open detail
  const handleOpenDetail = async (p) => {
    setSelectedPandit(p);
    setDetailLoading(true);
    try {
      const res = await panditApi.adminGetPanditDetail(p.id);
      if (res.success && res.data?.profile) {
        const prof = res.data.profile;
        setDetailData(prof);
        setRejectionReason(prof.rejection_reason || '');
        setAdminNotes(prof.admin_notes || '');
        if (prof.verification) {
          setBadges({
            identity_verified: prof.verification.identity_verified || false,
            education_verified: prof.verification.education_verified || false,
            experience_verified: prof.verification.experience_verified || false,
            vedic_certified: prof.verification.vedic_certified || false,
            top_rated_pandit: prof.verification.top_rated_pandit || false
          });
        }
      }
    } catch (err) {
      showToast('Could not load detailed pandit information', 'error');
    } finally {
      setDetailLoading(false);
    }
  };

  // Moderate Status
  const handleModerate = async (newStatus) => {
    if (newStatus === 'rejected' && !rejectionReason) {
      showToast('Please provide a rejection reason for feedback', 'error');
      return;
    }

    setModerating(true);
    try {
      const res = await panditApi.adminModeratePandit(selectedPandit.id, {
        status: newStatus,
        rejection_reason: newStatus === 'rejected' ? rejectionReason : null,
        admin_notes: adminNotes,
        badges
      });

      if (res.success) {
        showToast(`Pandit profile marked as ${newStatus.toUpperCase()}!`);
        setSelectedPandit(null);
        fetchAdminPandits();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update moderation status', 'error');
    } finally {
      setModerating(false);
    }
  };

  // Verify Single Document
  const handleVerifyDoc = async (docId, status) => {
    try {
      const res = await panditApi.adminVerifyDocument(selectedPandit.id, docId, { status });
      if (res.success) {
        showToast(`Document status updated to ${status}`);
        // Update local doc
        setDetailData(prev => ({
          ...prev,
          documents: prev.documents.map(d => d.id === docId ? { ...d, verification_status: status } : d)
        }));
      }
    } catch (err) {
      showToast('Failed to update document verification', 'error');
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={onBack}
            className="text-xs text-[#8A5A12] font-semibold hover:underline flex items-center gap-1 mb-1"
          >
            <span>← Back to Directory</span>
          </button>
          <h1 className="font-['Tiro_Devanagari_Hindi',serif] text-2xl md:text-3xl font-bold text-[#241631]">
            Vedic Council Moderation Portal ⚖️
          </h1>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-[#2B1736] text-[#F7EEDC] text-xs font-bold">
          Admin Access
        </span>
      </div>

      {/* Filter bar */}
      <div className="bg-[#FFFCF5] border border-[#E3D6BF] rounded-2xl p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {['all', 'pending_review', 'published', 'rejected', 'suspended'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-colors ${
                statusFilter === st
                  ? 'bg-[#E8862B] text-[#2A1503]'
                  : 'bg-white border border-[#D5C7B0] text-[#6E6074] hover:bg-[#F6E7CE]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, city..."
          className="px-3.5 py-1.5 text-xs bg-white border border-[#D5C7B0] rounded-xl outline-none text-[#241631] w-64"
        />
      </div>

      {/* Table */}
      <div className="bg-[#FFFCF5] border border-[#E3D6BF] rounded-3xl overflow-hidden shadow-sm mb-8">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F8F4EB] text-[#8A5A12] border-b border-[#E3D6BF] uppercase text-[11px] tracking-wider">
              <th className="py-3.5 px-4">Pandit Name &amp; Title</th>
              <th className="py-3.5 px-4">City / State</th>
              <th className="py-3.5 px-4">Experience</th>
              <th className="py-3.5 px-4">Documents</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE5D2]">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-[#6E6074]">Loading Pandits...</td>
              </tr>
            ) : pandits.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-[#6E6074]">No Pandit profiles found matching criteria.</td>
              </tr>
            ) : (
              pandits.map((p) => (
                <tr key={p.id} className="hover:bg-[#FFF9EE] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#241631]">
                    {p.title} {p.full_name}
                    <span className="block text-[11px] text-[#6E6074] font-normal">{p.user?.email || p.email}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#6E6074]">{p.city}, {p.state}</td>
                  <td className="py-3.5 px-4 text-[#2E5E35] font-semibold">{p.years_of_experience} yrs</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-[#E8F3EA] text-[#2E5E35] px-2 py-0.5 rounded-md font-bold text-[10px]">
                      {p.documents?.length || 0} Docs
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      p.status === 'published' ? 'bg-[#2E5E35] text-white' :
                      p.status === 'pending_review' ? 'bg-[#D97706] text-white' :
                      p.status === 'rejected' ? 'bg-red-700 text-white' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {p.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenDetail(p)}
                      className="px-3.5 py-1 rounded-full bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold text-xs"
                    >
                      Inspect &amp; Moderate
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal / Drawer */}
      {selectedPandit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFCF5] border border-[#E3D6BF] rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedPandit(null)}
              className="absolute right-5 top-5 text-[#8C7558] hover:text-[#241631] text-xl font-bold"
            >
              ✕
            </button>

            {detailLoading || !detailData ? (
              <div className="py-16 text-center">Loading complete details...</div>
            ) : (
              <div>
                <div className="flex items-center gap-4 mb-6 border-b border-[#E3D6BF] pb-4">
                  {detailData.profile_photo ? (
                    <img
                      src={`http://localhost:5001${detailData.profile_photo}`}
                      alt="Pandit"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E8862B]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-[#E8862B] text-white text-xl font-bold flex items-center justify-center">
                      {detailData.title?.substring(0, 1)}
                    </div>
                  )}
                  <div>
                    <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-bold text-[#241631]">
                      {detailData.title} {detailData.full_name}
                    </h2>
                    <p className="text-xs text-[#6E6074]">
                      {detailData.city}, {detailData.state} · Phone: {detailData.primary_phone || 'N/A'} · Email: {detailData.email || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Vedic & Religious details */}
                <div className="bg-[#F8F4EB] p-4 rounded-2xl border border-[#EBE1D0] mb-4 text-xs">
                  <h4 className="font-bold text-[#8A5A12] mb-2">Vedic Lineage</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div><b>Veda:</b> {detailData.religiousDetail?.veda || 'N/A'}</div>
                    <div><b>Gotra:</b> {detailData.religiousDetail?.gotra || 'N/A'}</div>
                    <div><b>Shakha:</b> {detailData.religiousDetail?.shakha || 'N/A'}</div>
                    <div><b>Sampradaya:</b> {detailData.religiousDetail?.sampradaya || 'N/A'}</div>
                    <div><b>Kuldevta:</b> {detailData.religiousDetail?.kul_devta || 'N/A'}</div>
                    <div><b>Peeth / Guru:</b> {detailData.religiousDetail?.guru_parampara || 'N/A'}</div>
                  </div>
                </div>

                {/* KYC Documents */}
                <div className="mb-5">
                  <h4 className="font-bold text-xs text-[#241631] mb-2">Uploaded KYC Verification Documents</h4>
                  {(!detailData.documents || detailData.documents.length === 0) ? (
                    <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl">No KYC documents uploaded yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {detailData.documents.map((doc) => (
                        <div key={doc.id} className="p-3 bg-white border border-[#D5C7B0] rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <b>{doc.document_title || doc.document_type}</b> ({doc.document_type})
                            <span className="block text-[11px] text-[#6E6074]">Number: {doc.document_number || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={`http://localhost:5001${doc.file_path}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 bg-[#F0EBE1] text-[#241631] rounded-lg font-semibold hover:underline"
                            >
                              View File ↗
                            </a>
                            <button
                              onClick={() => handleVerifyDoc(doc.id, 'verified')}
                              className="px-3 py-1 bg-[#2E5E35] text-white rounded-lg font-bold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleVerifyDoc(doc.id, 'rejected')}
                              className="px-3 py-1 bg-red-700 text-white rounded-lg font-bold"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Verification Badges */}
                <div className="bg-[#F8F4EB] p-4 rounded-2xl border border-[#EBE1D0] mb-5 text-xs">
                  <h4 className="font-bold text-[#8A5A12] mb-2">Assign Verification Badges</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.keys(badges).map((badgeKey) => (
                      <label key={badgeKey} className="flex items-center gap-2 cursor-pointer font-medium text-[#241631]">
                        <input
                          type="checkbox"
                          checked={badges[badgeKey]}
                          onChange={(e) => setBadges({ ...badges, [badgeKey]: e.target.checked })}
                          className="accent-[#E8862B]"
                        />
                        <span className="capitalize">{badgeKey.replace(/_/g, ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Admin Feedback / Notes */}
                <div className="mb-6 space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#6E6074] mb-1">Internal Admin Notes</label>
                    <input
                      type="text"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="e.g. Spoke to Pandit Ji on phone, credentials verified with Varanasi Sanskrit Board."
                      className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#6E6074] mb-1">Rejection / Revision Reason (If rejecting)</label>
                    <input
                      type="text"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="e.g. Please re-upload clearer Gurukul certificate or complete your location details."
                      className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded-xl outline-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E3D6BF]">
                  <button
                    disabled={moderating}
                    onClick={() => handleModerate('rejected')}
                    className="px-6 py-2.5 rounded-full bg-red-700 hover:bg-red-800 text-white font-bold text-xs"
                  >
                    Reject Profile
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={moderating}
                      onClick={() => handleModerate('suspended')}
                      className="px-5 py-2.5 rounded-full bg-gray-600 hover:bg-gray-700 text-white font-bold text-xs"
                    >
                      Suspend
                    </button>
                    <button
                      disabled={moderating}
                      onClick={() => handleModerate('published')}
                      className="px-8 py-2.5 rounded-full bg-[#2E5E35] hover:bg-[#244A29] text-white font-bold text-xs shadow-md"
                    >
                      ✓ Approve &amp; Publish Publicly
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
