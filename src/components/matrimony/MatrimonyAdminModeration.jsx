import React, { useState, useEffect } from 'react';
import { matrimonyApi } from '../../api/matrimonyApi';
import { useAuth } from '../../context/AuthContext';

export default function MatrimonyAdminModeration({ onBack }) {
  const { user, showToast } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const API_BASE = 'http://localhost:5001';

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const res = await matrimonyApi.adminGetAllProfiles({ status: filterStatus || undefined });
      if (res?.data?.profiles) {
        setProfiles(res.data.profiles);
      }
    } catch (err) {
      showToast('Could not fetch admin profiles list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, [filterStatus]);

  const handleOpenReview = async (id) => {
    try {
      const res = await matrimonyApi.adminGetProfileDetail(id);
      if (res?.data?.profile) {
        setSelectedProfile(res.data.profile);
        setRejectionReason(res.data.profile.rejection_reason || '');
        setReviewModalOpen(true);
      }
    } catch (err) {
      showToast('Could not load profile details for moderation.', 'error');
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === 'rejected' && !rejectionReason) {
      showToast('Please provide a reason for rejecting this profile.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const res = await matrimonyApi.adminUpdateProfileStatus(selectedProfile.id, {
        status: newStatus,
        rejection_reason: rejectionReason
      });
      if (res.success) {
        showToast(`Profile status updated to ${newStatus}.`);
        setReviewModalOpen(false);
        loadProfiles();
      }
    } catch (err) {
      showToast('Failed to update status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (user?.role?.toUpperCase() !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto p-12 text-center space-y-3">
        <span className="text-4xl">🚫</span>
        <h2 className="text-lg font-semibold text-[#241631]">Access Denied</h2>
        <p className="text-xs text-[#6E6074]">This module requires Administrator privileges.</p>
        <button onClick={onBack} className="bg-[#E8862B] text-[#2A1503] font-semibold px-4 py-2 rounded-xl border-0 cursor-pointer">
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 py-6 space-y-6 text-[#2A2036]">
      
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-[#6E6074] hover:text-[#241631] flex items-center gap-1.5 bg-[#F0E5CF] hover:bg-[#E3D6BF] px-3.5 py-1.5 rounded-full border-0 cursor-pointer mb-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="font-['Tiro_Devanagari_Hindi',serif] text-2xl sm:text-3xl font-normal text-[#241631] m-0">
            Matrimonial Profiles Moderation
          </h1>
          <p className="text-xs text-[#6E6074] m-0 mt-0.5">
            Admin console for approving, reviewing, rejecting, and suspending community matrimonial profiles.
          </p>
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white border border-[#E3D6BF] rounded-xl px-3.5 py-2 text-xs font-semibold outline-none"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="pending_review">Pending Review</option>
          <option value="published">Published</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Profiles Table */}
      <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[22px] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#E8862B] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#6E6074]">Loading profiles for moderation...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6E6074]">
            No profiles found matching current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F0E5CF] text-[#4A3D52] uppercase font-semibold border-b border-[#E3D6BF]">
                <tr>
                  <th className="p-3.5 pl-5">Profile / User</th>
                  <th className="p-3.5">Details</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Score</th>
                  <th className="p-3.5 text-right pr-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E5CF]">
                {profiles.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FFF8EC] transition-colors">
                    <td className="p-3.5 pl-5">
                      <b className="text-sm text-[#241631] block">{p.first_name} {p.last_name}</b>
                      <span className="text-[#6E6074]">{p.user?.email} · {p.user?.phone || 'No phone'}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="capitalize">{p.gender} · {p.age || 'N/A'} yrs</span>
                      <span className="text-[#6E6074] block">{p.religiousProfile?.religion || 'Hindu'}, {p.religiousProfile?.community || 'N/A'}</span>
                    </td>
                    <td className="p-3.5">
                      <span>{p.locationProfile?.current_city || 'N/A'}, {p.locationProfile?.current_state || ''}</span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        p.profile_status === 'published'
                          ? 'bg-[#EDF4ED] text-[#4E6B4F]'
                          : p.profile_status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : p.profile_status === 'suspended'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-[#FFF8EC] text-[#8A5A12]'
                      }`}>
                        {p.profile_status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <b className="text-[#9E2B2B]">{p.completion_percentage}%</b>
                    </td>
                    <td className="p-3.5 text-right pr-5">
                      <button
                        type="button"
                        onClick={() => handleOpenReview(p.id)}
                        className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold text-xs px-3.5 py-1.5 rounded-lg border-0 cursor-pointer shadow-xs transition-colors"
                      >
                        Review Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModalOpen && selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[24px] p-6 sm:p-7 shadow-2xl text-[#2A2036] space-y-4">
            
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute right-4 top-4 text-sm font-bold bg-[#F0E5CF] hover:bg-[#E3D6BF] rounded-full w-8 h-8 flex items-center justify-center border-0 cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-xs uppercase font-bold text-[#8A5A12] bg-[#F6E7CE] px-2.5 py-0.5 rounded-md">
                Admin Profile Moderation
              </span>
              <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-2xl font-normal text-[#241631] m-0 mt-1">
                {selectedProfile.first_name} {selectedProfile.last_name} ({selectedProfile.gender}, {selectedProfile.age || 'N/A'} yrs)
              </h2>
              <p className="text-xs text-[#6E6074] m-0">
                User: {selectedProfile.user?.email} · Created: {new Date(selectedProfile.created_at || selectedProfile.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>

            {/* Photos Strip */}
            {selectedProfile.photos && selectedProfile.photos.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {selectedProfile.photos.map((p) => {
                  const url = p.file_url.startsWith('http') ? p.file_url : `${API_BASE}${p.file_url}`;
                  return (
                    <img key={p.id} src={url} alt="Profile" className="w-20 h-24 object-cover rounded-xl border border-[#E3D6BF]" />
                  );
                })}
              </div>
            )}

            {/* Profile Overview */}
            <div className="bg-white border border-[#E3D6BF] rounded-xl p-4 text-xs space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-[#6E6074]">Religion:</span> <b>{selectedProfile.religiousProfile?.religion}, {selectedProfile.religiousProfile?.community}</b></div>
                <div><span className="text-[#6E6074]">Location:</span> <b>{selectedProfile.locationProfile?.current_city}, {selectedProfile.locationProfile?.current_state}</b></div>
                <div><span className="text-[#6E6074]">Education:</span> <b>{selectedProfile.educationProfile?.highest_education || 'N/A'}</b></div>
                <div><span className="text-[#6E6074]">Profession:</span> <b>{selectedProfile.careerProfile?.profession || 'N/A'}</b></div>
              </div>

              <div>
                <span className="text-[#6E6074] block mb-0.5 font-semibold">About Me:</span>
                <p className="p-2 bg-[#F6EFE1] rounded-lg text-[#241631] m-0">
                  {selectedProfile.about_me || 'No about me provided.'}
                </p>
              </div>
            </div>

            {/* Rejection / Action Note */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3D52] mb-1">
                Moderation Reason / Note (Required if Rejecting)
              </label>
              <textarea
                rows="2"
                placeholder="Reason for rejection or suspension (will be visible to the user)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-white border border-[#E3D6BF] rounded-xl p-2.5 text-xs outline-none"
              />
            </div>

            {/* Moderation Actions Bar */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F0E5CF]">
              <button
                type="button"
                onClick={() => handleStatusUpdate('published')}
                disabled={actionLoading}
                className="flex-1 bg-[#4E6B4F] hover:bg-[#3E573F] text-white font-semibold text-xs py-2.5 rounded-xl border-0 cursor-pointer shadow-xs"
              >
                ✓ Approve &amp; Publish
              </button>

              <button
                type="button"
                onClick={() => handleStatusUpdate('rejected')}
                disabled={actionLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2.5 rounded-xl border-0 cursor-pointer shadow-xs"
              >
                ✕ Reject Profile
              </button>

              <button
                type="button"
                onClick={() => handleStatusUpdate('suspended')}
                disabled={actionLoading}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs py-2.5 rounded-xl border-0 cursor-pointer shadow-xs"
              >
                ⏸ Suspend Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
