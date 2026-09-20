import React, { useState, useEffect } from 'react';
import { matrimonyApi } from '../../api/matrimonyApi';
import { useAuth } from '../../context/AuthContext';

export default function MatrimonyBrowseProfiles({ onSelectProfile, onBack }) {
  const { showToast } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    gender: '',
    religion: '',
    maritalStatus: '',
    search: ''
  });
  const API_BASE = 'http://localhost:5001';

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await matrimonyApi.browseProfiles(filters);
      if (res?.data?.profiles) {
        setProfiles(res.data.profiles);
      }
    } catch (err) {
      showToast('Could not fetch matrimony matches.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [filters.gender, filters.religion, filters.maritalStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProfiles();
  };

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
            Discover Community Matches
          </h1>
          <p className="text-xs text-[#6E6074] m-0 mt-0.5">
            Verified brides &amp; grooms with full family and astrological details.
          </p>
        </div>

        {/* Gender Quick Switcher */}
        <div className="flex bg-[#F0E5CF] rounded-full p-1 shadow-inner">
          {[
            { label: 'All', value: '' },
            { label: 'Brides', value: 'female' },
            { label: 'Grooms', value: 'male' }
          ].map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => setFilters({ ...filters, gender: g.value })}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border-0 cursor-pointer ${
                filters.gender === g.value
                  ? 'bg-[#9E2B2B] text-white shadow-xs'
                  : 'bg-transparent text-[#8A7A64] hover:text-[#2A2036]'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[200px] flex items-center gap-2 bg-white border border-[#E3D6BF] rounded-xl px-3 py-2">
          <span>🔍</span>
          <input
            type="search"
            placeholder="Search by name or mother tongue..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full text-xs outline-none bg-transparent"
          />
        </form>

        <select
          value={filters.religion}
          onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
          className="bg-white border border-[#E3D6BF] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
        >
          <option value="">All Religions</option>
          <option value="Hindu">Hindu</option>
          <option value="Jain">Jain</option>
          <option value="Sikh">Sikh</option>
          <option value="Buddhist">Buddhist</option>
        </select>

        <select
          value={filters.maritalStatus}
          onChange={(e) => setFilters({ ...filters, maritalStatus: e.target.value })}
          className="bg-white border border-[#E3D6BF] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
        >
          <option value="">All Marital Statuses</option>
          <option value="never_married">Never Married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setFilters({ gender: '', religion: '', maritalStatus: '', search: '' });
          }}
          className="text-xs text-[#9E2B2B] font-semibold bg-transparent border-0 cursor-pointer hover:underline"
        >
          Clear Filters
        </button>
      </div>

      {/* Profiles Grid */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#E8862B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#6E6074]">Searching matching profiles...</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="bg-[#FFFCF5] border border-[#E3D6BF] rounded-2xl p-12 text-center space-y-2">
          <span className="text-4xl block">🔍</span>
          <h3 className="text-base font-semibold text-[#241631] m-0">No Matrimonial Profiles Found</h3>
          <p className="text-xs text-[#6E6074] max-w-sm mx-auto m-0">
            Try adjusting your search filters or be the first to publish a profile in your community!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {profiles.map((p) => {
            const photoUrl = p.photo
              ? (p.photo.startsWith('http') ? p.photo : `${API_BASE}${p.photo}`)
              : null;

            return (
              <div
                key={p.id}
                className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Thumbnail */}
                  <div className="relative aspect-[4/4.5] bg-[#241631] overflow-hidden">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={p.first_name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white">
                        <span className="text-3xl mb-1">👤</span>
                        <span className="text-[11px] text-[#D6C6D4]">Photo on request</span>
                      </div>
                    )}

                    {p.is_verified && (
                      <span className="absolute top-2 left-2 bg-[#4E6B4F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        ✓ Verified
                      </span>
                    )}

                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {p.age} Yrs · {p.height ? `${p.height}cm` : ''}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="p-3.5 space-y-1">
                    <h3 className="font-['Tiro_Devanagari_Hindi',serif] text-lg font-normal text-[#241631] m-0 leading-tight">
                      {p.first_name}
                    </h3>

                    <p className="text-xs text-[#9E2B2B] font-semibold m-0">
                      {p.religion || 'Hindu'}, {p.community || 'Community'}
                    </p>

                    <p className="text-xs text-[#6E6074] m-0 truncate">
                      💼 {p.profession || 'Professional'}
                    </p>

                    <p className="text-xs text-[#6E6074] m-0 truncate">
                      📍 {p.city || 'City not set'}, {p.state || 'India'}
                    </p>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-3 pt-0">
                  <button
                    type="button"
                    onClick={() => onSelectProfile && onSelectProfile(p.id)}
                    className="w-full bg-[#FFF8EC] hover:bg-[#E8862B] text-[#8A5A12] hover:text-[#2A1503] border border-[#E8862B]/50 font-semibold text-xs py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    View Full Profile →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
