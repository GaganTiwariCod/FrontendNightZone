import React, { useState, useEffect } from 'react';
import { spiritualApi } from '../../api/spiritualApi';
import { useAuth } from '../../context/AuthContext';
import { getTranslation } from '../../utils/i18n';
import SpiritualContentCard from './SpiritualContentCard';
import SpiritualRequestModal from './SpiritualRequestModal';

export default function SpiritualPortal({ onSelectContent, onOpenAdmin, onBack }) {
  const { user, showToast } = useAuth();
  const [contents, setContents] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState('hi');
  
  // Masters
  const [types, setTypes] = useState([]);
  const [deities, setDeities] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Active Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDeity, setSelectedDeity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  
  // Request Modal State
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  // 1. Fetch Masters
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const res = await spiritualApi.getMasters();
        if (res?.data) {
          setTypes(res.data.types || []);
          setDeities(res.data.deities || []);
          setCategories(res.data.categories || []);
        }
      } catch (err) {
        console.error('Failed to load spiritual masters', err);
      }
    };
    fetchMasters();
  }, []);

  // 2. Fetch Content Directory
  const fetchDirectory = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        language: currentLang,
        search: searchTerm || undefined,
        type: selectedType || undefined,
        deity: selectedDeity || undefined,
        category: selectedCategory || undefined,
        featured: featuredOnly ? 'true' : undefined
      };

      const res = await spiritualApi.getDirectory(params);
      if (res?.data) {
        setContents(res.data.contents || []);
        setPagination(res.data.pagination || { total: 0, page: 1, limit: 12, totalPages: 1 });
      }
    } catch (err) {
      showToast('Could not load spiritual contents list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectory(1);
  }, [currentLang, selectedType, selectedDeity, selectedCategory, featuredOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDirectory(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedDeity('');
    setSelectedCategory('');
    setFeaturedOnly(false);
  };

  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 py-6 space-y-6 text-[#2A2036]">
      {/* Navigation Top Bar */}
      {onBack && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#6E6074] hover:text-[#241631] bg-white border border-[#E3D6BF] px-3.5 py-1.5 rounded-full shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <span>←</span>
            <span>Back to Home</span>
          </button>
        </div>
      )}
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-[#241631] to-[#3B1F4F] text-[#F7EEDC] rounded-[24px] p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🕉️</span>
              <span className="text-xs uppercase tracking-widest text-[#E8862B] font-bold">
                Shubhkaal Dharmik &amp; Spiritual Portal
              </span>
            </div>
            <h1 className="font-['Tiro_Devanagari_Hindi',serif] text-2xl sm:text-4xl font-normal text-white m-0">
              {getTranslation('spiritualPortalTitle', currentLang)}
            </h1>
            <p className="text-xs sm:text-sm text-[#D6C6D4] m-0 max-w-xl">
              {getTranslation('spiritualPortalSubtitle', currentLang)}
            </p>
          </div>

          {/* Language Switcher & Admin Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-[#2D1C3C] border border-[#4A3358] p-1 rounded-xl shadow-xs">
              {[
                { code: 'hi', label: 'हिन्दी' },
                { code: 'mr', label: 'मराठी' },
                { code: 'en', label: 'English' }
              ].map(l => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setCurrentLang(l.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                    currentLang === l.code
                      ? 'bg-[#E8862B] text-[#2A1503] shadow-xs'
                      : 'bg-transparent text-[#D6C6D4] hover:bg-[#3D2650]'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="bg-[#9E2B2B] hover:bg-[#821E1E] text-white font-semibold text-xs px-3.5 py-2 rounded-xl border-0 cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>⚙️</span>
                <span>{getTranslation('adminPanel', currentLang)}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={getTranslation('searchPlaceholder', currentLang)}
          className="w-full bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] focus:border-[#E8862B] rounded-2xl py-3.5 pl-12 pr-28 text-sm outline-none shadow-xs transition-colors placeholder-[#A28FA6]"
        />
        <svg
          className="w-5 h-5 text-[#8A5A12] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7"/>
          <path d="M20 20l-3.6-3.6"/>
        </svg>
        <button
          type="submit"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold text-xs px-4 py-2 rounded-xl border-0 cursor-pointer shadow-xs transition-colors"
        >
          Search
        </button>
      </form>

      {/* Type Filter Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setSelectedType('')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex-none border-0 cursor-pointer ${
            !selectedType
              ? 'bg-[#241631] text-[#F7EEDC] shadow-xs'
              : 'bg-[#FFFCF5] text-[#4A3D52] border border-[#E3D6BF] hover:bg-[#F0E5CF]'
          }`}
        >
          {getTranslation('all', currentLang)}
        </button>
        {types.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedType(selectedType === t.code ? '' : t.code)}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex-none flex items-center gap-1.5 border-0 cursor-pointer ${
              selectedType === t.code
                ? 'bg-[#E8862B] text-[#2A1503] font-bold shadow-xs'
                : 'bg-[#FFFCF5] text-[#4A3D52] border border-[#E3D6BF] hover:bg-[#F0E5CF]'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.name}</span>
          </button>
        ))}
      </div>

      {/* Secondary Filter Dropdowns & Quick Clear */}
      <div className="bg-[#FFFCF5] border border-[#E3D6BF] rounded-2xl p-3 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Deity Selector */}
          <select
            value={selectedDeity}
            onChange={(e) => setSelectedDeity(e.target.value)}
            className="bg-white border border-[#E3D6BF] rounded-xl px-3 py-1.5 outline-none font-medium"
          >
            <option value="">{getTranslation('allDeities', currentLang)}</option>
            {deities.map(d => (
              <option key={d.id} value={d.slug}>{d.name}</option>
            ))}
          </select>

          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-[#E3D6BF] rounded-xl px-3 py-1.5 outline-none font-medium"
          >
            <option value="">{getTranslation('allCategories', currentLang)}</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          {/* Featured Toggle */}
          <button
            type="button"
            onClick={() => setFeaturedOnly(!featuredOnly)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
              featuredOnly
                ? 'bg-[#9E2B2B] text-white border-[#9E2B2B]'
                : 'bg-white text-[#4A3D52] border-[#E3D6BF] hover:bg-[#F0E5CF]'
            }`}
          >
            ⭐ {getTranslation('featured', currentLang)}
          </button>

        </div>

        {/* Clear Filters Button */}
        {(searchTerm || selectedType || selectedDeity || selectedCategory || featuredOnly) && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-xs text-[#9E2B2B] hover:underline font-semibold bg-transparent border-0 cursor-pointer"
          >
            ✕ {getTranslation('clearFilters', currentLang)}
          </button>
        )}
      </div>

      {/* Main Content Grid */}
      {loading ? (
        <div className="p-16 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#E8862B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#6E6074]">Loading spiritual repository...</p>
        </div>
      ) : contents.length === 0 ? (
        <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-2xl p-12 text-center space-y-3">
          <span className="text-3xl block">📜</span>
          <h3 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-bold text-[#241631] m-0">
            {getTranslation('noContentFound', currentLang)}
          </h3>
          <p className="text-xs text-[#6E6074] m-0">
            {getTranslation('noContentFoundHint', currentLang)}
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <button
              onClick={handleClearFilters}
              className="bg-[#F0E5CF] text-[#2A2036] font-semibold text-xs px-4 py-2 rounded-xl border-0 cursor-pointer"
            >
              {getTranslation('clearFilters', currentLang)}
            </button>
            <button
              onClick={() => setRequestModalOpen(true)}
              className="bg-[#E8862B] text-[#2A1503] font-semibold text-xs px-4 py-2 rounded-xl border-0 cursor-pointer shadow-xs"
            >
              {getTranslation('requestContentBtn', currentLang)}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4.5">
          {contents.map(item => (
            <SpiritualContentCard
              key={item.id}
              item={item}
              activeLang={currentLang}
              onSelect={onSelectContent}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={pagination.page <= 1}
            onClick={() => fetchDirectory(pagination.page - 1)}
            className="px-3.5 py-1.5 rounded-xl border border-[#E3D6BF] bg-[#FFFCF5] disabled:opacity-40 text-xs font-semibold cursor-pointer"
          >
            ← Previous
          </button>
          <span className="text-xs text-[#6E6074]">
            Page <b>{pagination.page}</b> of <b>{pagination.totalPages}</b>
          </span>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => fetchDirectory(pagination.page + 1)}
            className="px-3.5 py-1.5 rounded-xl border border-[#E3D6BF] bg-[#FFFCF5] disabled:opacity-40 text-xs font-semibold cursor-pointer"
          >
            Next →
          </button>
        </div>
      )}

      {/* Explore More Section */}
      <section className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[22px] p-6 shadow-sm space-y-4">
        <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-bold text-[#241631] m-0">
          {getTranslation('exploreMore', currentLang)}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-center text-xs">
          {[
            { code: 'KATHA', label: 'पावन कथाएं', icon: '📜' },
            { code: 'MANTRA', label: 'वैदिक मंत्र', icon: '🕉️' },
            { code: 'AARTI', label: 'आरती संग्रह', icon: '🔔' },
            { code: 'CHALISA', label: 'चालीसा पाठ', icon: '📖' },
            { code: 'VRAT', label: 'व्रत व उपवास', icon: '🌙' },
            { code: 'POOJA_VIDHI', label: 'पूजा विधि', icon: '🌺' }
          ].map(sec => (
            <button
              key={sec.code}
              type="button"
              onClick={() => setSelectedType(sec.code)}
              className="bg-white hover:bg-[#FFF8EC] border border-[#E3D6BF] hover:border-[#E8862B] p-3 rounded-xl cursor-pointer transition-all flex flex-col items-center gap-1.5 shadow-2xs"
            >
              <span className="text-2xl">{sec.icon}</span>
              <span className="font-bold text-[#241631]">{sec.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Footer Request Missing Content Banner */}
      <div className="bg-gradient-to-r from-[#241631] to-[#3B1F4F] text-[#F7EEDC] rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="font-['Tiro_Devanagari_Hindi',serif] text-lg sm:text-xl font-normal text-white m-0">
            {getTranslation('cantFindTitle', currentLang)}
          </h3>
          <p className="text-xs text-[#D6C6D4] m-0 mt-1">
            {getTranslation('cantFindSubtitle', currentLang)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRequestModalOpen(true)}
          className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold text-xs px-5 py-2.5 rounded-xl border-0 cursor-pointer shadow-xs transition-colors flex-none"
        >
          {getTranslation('requestContentBtn', currentLang)}
        </button>
      </div>

      {/* Request Modal */}
      <SpiritualRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        deities={deities}
        activeLang={currentLang}
      />

    </div>
  );
}
