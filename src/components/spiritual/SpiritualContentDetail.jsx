import React, { useState, useEffect } from 'react';
import { spiritualApi } from '../../api/spiritualApi';
import { useAuth } from '../../context/AuthContext';
import { getTranslation } from '../../utils/i18n';
import SpiritualContentCard from './SpiritualContentCard';

export default function SpiritualContentDetail({ slug, initialLang = 'hi', onBack, onSelectOtherSlug, onOpenRequest }) {
  const { showToast } = useAuth();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState(initialLang || 'hi');
  const API_BASE = 'http://localhost:5001';

  const loadDetail = async (targetLang) => {
    setLoading(true);
    try {
      const res = await spiritualApi.getContentBySlug(slug, targetLang || currentLang);
      if (res?.data) {
        setContent(res.data);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not load spiritual text.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail(currentLang);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, currentLang]);

  const handleLanguageSwitch = (langCode) => {
    setCurrentLang(langCode);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast(getTranslation('linkCopied', currentLang));
  };

  if (loading) {
    return (
      <div className="max-w-[960px] mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-3 border-[#E8862B] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-[#6E6074]">Loading sacred Dharmik text...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="max-w-[720px] mx-auto px-4 py-16 text-center space-y-4">
        <span className="text-4xl">📜</span>
        <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-2xl font-bold text-[#241631]">
          {getTranslation('noContentFound', currentLang)}
        </h2>
        <button
          onClick={onBack}
          className="bg-[#E8862B] text-[#2A1503] font-semibold text-xs px-4 py-2.5 rounded-xl border-0 cursor-pointer shadow-xs"
        >
          {getTranslation('backToDirectory', currentLang)}
        </button>
      </div>
    );
  }

  const trans = content.active_translation || {};
  const coverUrl = content.image_url
    ? (content.image_url.startsWith('http') ? content.image_url : `${API_BASE}${content.image_url}`)
    : 'https://images.unsplash.com/photo-1567591414240-e2ff01e85567?w=1200&auto=format&fit=crop&q=80';

  const typeData = content.type_specific_data || {};

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-6 space-y-6 text-[#2A2036]">
      
      {/* Top Breadcrumb & Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold text-[#6E6074] hover:text-[#241631] flex items-center gap-1.5 bg-[#F0E5CF] hover:bg-[#E3D6BF] px-3.5 py-1.5 rounded-full border-0 cursor-pointer transition-colors"
        >
          {getTranslation('backToDirectory', currentLang)}
        </button>

        {/* Multi-Language Switcher */}
        <div className="flex items-center gap-1.5 bg-[#FFFCF5] border border-[#E3D6BF] p-1 rounded-xl shadow-xs">
          <span className="text-xs px-2 text-[#8A5A12] font-semibold flex items-center gap-1">
            <span>🌐</span>
            <span className="hidden sm:inline">{getTranslation('switchLanguage', currentLang)}:</span>
          </span>
          {[
            { code: 'hi', label: 'हिन्दी' },
            { code: 'mr', label: 'मराठी' },
            { code: 'en', label: 'English' }
          ].map(l => (
            <button
              key={l.code}
              type="button"
              onClick={() => handleLanguageSwitch(l.code)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                currentLang === l.code
                  ? 'bg-[#E8862B] text-[#2A1503] shadow-xs'
                  : 'bg-transparent text-[#6E6074] hover:bg-[#F0E5CF]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fallback Notice Banner */}
      {trans.is_fallback && (
        <div className="bg-[#FFF8EC] border border-[#E8862B]/50 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
          <span className="text-xl flex-none">ℹ️</span>
          <div className="text-xs text-[#8A5A12]">
            <b className="block font-semibold mb-0.5">
              {currentLang === 'mr' ? 'मराठी भाषांतर लवकरच जोडले जाईल' : 'Translation Notice'}
            </b>
            <span>
              {getTranslation('fallbackNotice', currentLang)}
            </span>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#241631] to-[#3B1F4F] text-[#F7EEDC] rounded-[24px] p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          
          <div className="flex flex-wrap items-center gap-2">
            {content.type && (
              <span className="bg-[#E8862B] text-[#2A1503] font-bold text-xs px-3 py-1 rounded-full shadow-xs">
                {content.type.icon} {content.type.name}
              </span>
            )}
            {content.deity && (
              <span className="bg-white/10 text-white border border-white/20 text-xs font-medium px-3 py-1 rounded-full">
                🕉️ {content.deity.name}
              </span>
            )}
            {content.category && (
              <span className="bg-white/10 text-[#C99A3F] border border-[#C99A3F]/30 text-xs font-medium px-3 py-1 rounded-full">
                {content.category.name}
              </span>
            )}
          </div>

          <h1 className="font-['Tiro_Devanagari_Hindi',serif] text-2xl sm:text-4xl font-normal text-white m-0 leading-tight">
            {trans.title}
          </h1>

          {trans.short_description && (
            <p className="text-[#D6C6D4] text-sm sm:text-base leading-relaxed m-0 max-w-2xl">
              {trans.short_description}
            </p>
          )}

          {/* Social Share & Quick Tools */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/10 text-xs">
            <button
              onClick={handleCopyLink}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/20 cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <span>🔗</span>
              <span>{getTranslation('copyLink', currentLang)}</span>
            </button>
            <button
              onClick={onOpenRequest}
              className="bg-[#E8862B]/20 hover:bg-[#E8862B]/30 text-[#E8862B] px-3 py-1.5 rounded-lg border border-[#E8862B]/30 cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <span>✍️</span>
              <span>{getTranslation('requestContentBtn', currentLang)}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Full Reading Material */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Sacred Verse / Beej Mantra Highlight Box (if present) */}
          {(typeData.sacred_verse_sanskrit || typeData.sacred_verses_count) && (
            <div className="bg-[#FFF8EC] border-[1.5px] border-[#E8862B]/40 rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-xs uppercase font-bold text-[#8A5A12] bg-[#F6E7CE] px-2.5 py-0.5 rounded-md">
                🕉️ Sacred Invocations &amp; Guidelines
              </span>
              {typeData.sacred_verse_sanskrit && (
                <p className="font-['Tiro_Devanagari_Hindi',serif] text-lg font-bold text-[#9E2B2B] text-center p-3 bg-white rounded-xl border border-[#E3D6BF] leading-relaxed my-2">
                  {typeData.sacred_verse_sanskrit}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#6E6074]">
                {typeData.ideal_time && <div><b>⏰ Best Time:</b> {typeData.ideal_time}</div>}
                {typeData.mala_recommended && <div><b>📿 Recommended Mala:</b> {typeData.mala_recommended}</div>}
                {typeData.best_time_to_chant && <div><b>📅 Auspicious Day:</b> {typeData.best_time_to_chant}</div>}
                {typeData.benefits && <div className="sm:col-span-2"><b>✨ Benefits:</b> {typeData.benefits}</div>}
              </div>
            </div>
          )}

          {/* Full Text Render */}
          <article className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[24px] p-6 sm:p-8 shadow-sm text-[#2A2036] space-y-4 leading-relaxed font-['Inter',sans-serif]">
            <div 
              className="prose prose-sm sm:prose-base max-w-none text-[#2A2036] space-y-4 whitespace-pre-line"
              style={{ fontFamily: currentLang === 'en' ? 'Inter, sans-serif' : "'Tiro Devanagari Hindi', serif" }}
            >
              {trans.content}
            </div>
          </article>

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#6E6074]">
              <span className="font-semibold">{getTranslation('tags', currentLang)}:</span>
              {content.tags.map(t => (
                <span key={t.id} className="bg-[#F0E5CF] text-[#4A3D52] px-2.5 py-1 rounded-full font-medium">
                  #{t.name}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* Right Sidebar: Samagri Checklist, Deity Info & Related */}
        <div className="space-y-5">
          
          {/* Deity Card */}
          {content.deity && (
            <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-2xl p-5 shadow-xs text-center space-y-3">
              {content.deity.image_url && (
                <img
                  src={content.deity.image_url}
                  alt={content.deity.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#E8862B] shadow-sm"
                />
              )}
              <div>
                <h3 className="font-['Tiro_Devanagari_Hindi',serif] text-lg font-bold text-[#241631] m-0">
                  {content.deity.name}
                </h3>
                {content.deity.description && (
                  <p className="text-xs text-[#6E6074] m-0 mt-1 line-clamp-3">
                    {content.deity.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Pooja Samagri & Vidhi Sidebar Info (if available) */}
          {typeData.samagri && (
            <div className="bg-[#FFF8EC] border-[1.5px] border-[#E3D6BF] rounded-2xl p-5 shadow-xs space-y-2 text-xs">
              <h4 className="font-bold text-[#8A5A12] m-0 text-sm flex items-center gap-1.5">
                <span>🌺</span>
                <span>Pooja Samagri Checklist</span>
              </h4>
              <p className="text-[#4A3D52] leading-relaxed m-0 bg-white p-3 rounded-xl border border-[#E3D6BF]">
                {typeData.samagri}
              </p>
            </div>
          )}

          {/* Request Missing Content CTA Box */}
          <div className="bg-gradient-to-br from-[#241631] to-[#3D2650] text-[#F7EEDC] rounded-2xl p-5 shadow-sm space-y-2.5 text-center">
            <span className="text-2xl block">📖</span>
            <h4 className="font-['Tiro_Devanagari_Hindi',serif] text-base font-normal text-white m-0">
              {getTranslation('cantFindTitle', currentLang)}
            </h4>
            <p className="text-xs text-[#D6C6D4] m-0">
              {getTranslation('cantFindSubtitle', currentLang)}
            </p>
            <button
              type="button"
              onClick={onOpenRequest}
              className="w-full bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold text-xs py-2 rounded-xl border-0 cursor-pointer shadow-xs transition-colors"
            >
              {getTranslation('requestContentBtn', currentLang)}
            </button>
          </div>

        </div>

      </div>

      {/* Related Content Recommendations */}
      {content.related_content && content.related_content.length > 0 && (
        <section className="pt-6 border-t border-[#E3D6BF] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-bold text-[#241631] m-0">
              {getTranslation('relatedContent', currentLang)}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {content.related_content.map(rel => (
              <div
                key={rel.id}
                onClick={() => onSelectOtherSlug && onSelectOtherSlug(rel.slug)}
                className="bg-[#FFFCF5] border border-[#E3D6BF] hover:border-[#E8862B] rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between text-[11px] text-[#8A5A12] font-semibold">
                  <span>{rel.type}</span>
                  {rel.deity && <span>🕉️ {rel.deity}</span>}
                </div>
                <h4 className="font-['Tiro_Devanagari_Hindi',serif] text-base font-bold text-[#241631] hover:text-[#9E2B2B] m-0 line-clamp-1">
                  {rel.title}
                </h4>
                <p className="text-xs text-[#6E6074] line-clamp-2 m-0">
                  {rel.short_description || 'Read complete text, mantras and vidhi.'}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
