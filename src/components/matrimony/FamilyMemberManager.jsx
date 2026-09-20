import React, { useState } from 'react';
import { matrimonyApi } from '../../api/matrimonyApi';

export default function FamilyMemberManager({ familyMembers = [], onMembersUpdated, showToast }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    relationship: 'brother',
    gender: 'male',
    age: '',
    marital_status: 'never_married',
    occupation: '',
    education: ''
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age, 10) : undefined
      };
      const res = await matrimonyApi.addFamilyMember(payload);
      if (res.success) {
        showToast('Family member added.');
        setShowAddForm(false);
        setFormData({
          relationship: 'brother',
          gender: 'male',
          age: '',
          marital_status: 'never_married',
          occupation: '',
          education: ''
        });
        if (onMembersUpdated) onMembersUpdated();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not add family member.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this family member?')) return;
    try {
      const res = await matrimonyApi.deleteFamilyMember(id);
      if (res.success) {
        showToast('Family member removed.');
        if (onMembersUpdated) onMembersUpdated();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not delete member.', 'error');
    }
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-[#241631]">
          Siblings &amp; Additional Family Members ({familyMembers.length})
        </label>
        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="text-xs font-semibold text-[#9E2B2B] hover:text-[#7A1E1E] bg-[#F8E3E3] px-3 py-1.5 rounded-full border-0 cursor-pointer transition-colors"
          >
            + Add Member
          </button>
        )}
      </div>

      {/* Existing Members List */}
      {familyMembers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {familyMembers.map((m) => (
            <div 
              key={m.id} 
              className="p-3 bg-white border border-[#E3D6BF] rounded-xl flex items-center justify-between text-xs text-[#2A2036] shadow-xs"
            >
              <div>
                <b className="capitalize text-sm text-[#9E2B2B]">{m.relationship}</b>
                <span className="text-[#6E6074] ml-2">
                  ({m.marital_status?.replace('_', ' ') || 'Unmarried'}{m.age ? `, ${m.age} yrs` : ''})
                </span>
                {(m.occupation || m.education) && (
                  <p className="text-[#6E6074] m-0 mt-0.5">
                    {m.occupation || 'Working'} {m.education ? `· ${m.education}` : ''}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(m.id)}
                className="text-red-500 hover:text-red-700 p-1 text-base bg-transparent border-0 cursor-pointer"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-[#FFF8EC] border border-[#E8862B]/40 rounded-xl p-4 space-y-3 animate-in fade-in">
          <div className="font-semibold text-xs text-[#8A5A12] uppercase tracking-wider">Add Family Member Details</div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs text-[#6E6074] mb-1">Relationship</label>
              <select
                value={formData.relationship}
                onChange={(e) => {
                  const rel = e.target.value;
                  const g = rel === 'brother' || rel === 'father' ? 'male' : 'female';
                  setFormData({ ...formData, relationship: rel, gender: g });
                }}
                className="w-full bg-white border border-[#E3D6BF] rounded-lg p-2 text-xs outline-none"
              >
                <option value="brother">Brother</option>
                <option value="sister">Sister</option>
                <option value="father">Father</option>
                <option value="mother">Mother</option>
                <option value="other">Other Relative</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#6E6074] mb-1">Marital Status</label>
              <select
                value={formData.marital_status}
                onChange={(e) => setFormData({ ...formData, marital_status: e.target.value })}
                className="w-full bg-white border border-[#E3D6BF] rounded-lg p-2 text-xs outline-none"
              >
                <option value="never_married">Unmarried</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#6E6074] mb-1">Age</label>
              <input
                type="number"
                min="0"
                max="120"
                placeholder="Age in yrs"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full bg-white border border-[#E3D6BF] rounded-lg p-2 text-xs outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs text-[#6E6074] mb-1">Occupation</label>
              <input
                type="text"
                placeholder="e.g. Software Engineer / Student"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full bg-white border border-[#E3D6BF] rounded-lg p-2 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#6E6074] mb-1">Education</label>
              <input
                type="text"
                placeholder="e.g. B.Tech / MBA / Graduate"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full bg-white border border-[#E3D6BF] rounded-lg p-2 text-xs outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs bg-[#F0E5CF] text-[#2A2036] rounded-lg font-semibold border-0 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 text-xs bg-[#E8862B] text-[#2A1503] rounded-lg font-semibold border-0 cursor-pointer shadow-xs"
            >
              {loading ? 'Saving...' : 'Save Member'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
